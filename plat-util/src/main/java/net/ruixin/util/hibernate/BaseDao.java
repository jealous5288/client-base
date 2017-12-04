package net.ruixin.util.hibernate;


import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.rule.DelIgnore;
import net.ruixin.util.constant.Const;
import net.ruixin.util.http.HttpSessionHolder;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.ObjectUtils;
import net.ruixin.util.tools.OracleUtils;
import net.ruixin.util.tools.RxBeanUtils;
import net.ruixin.util.tools.RxStringUtils;
import oracle.jdbc.OracleTypes;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.jdbc.ReturningWork;
import org.hibernate.jdbc.Work;
import org.hibernate.transform.Transformers;
import org.springframework.beans.BeansException;
import org.springframework.beans.FatalBeanException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.persistence.*;
import java.beans.PropertyDescriptor;
import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.sql.*;
import java.util.*;

/**
 * 基础DAO实现
 */
@SuppressWarnings({"unchecked", "WeakerAccess", "SqlDialectInspection", "SqlNoDataSourceInspection"})
@Component
public class BaseDao<T> implements IBaseDao<T> {

    private Class<T> entityClazz;

    private final Class<T> sourceClazz;

    @Resource
    protected SessionFactory sessionFactory;

    @Resource
    protected JdbcTemplate jdbcTemplate;

    @Resource
    protected NamedParameterJdbcTemplate npJdbcTemplate;

    public JdbcTemplate getJdbcTemplate() {
        return jdbcTemplate;
    }

    @SuppressWarnings("unused")
    public NamedParameterJdbcTemplate getNpJdbcTemplate() {
        return npJdbcTemplate;
    }

    public Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    private Query setParameter(Query query, Map<String, ?> parameterMap) {
        for (Map.Entry<String, ?> entry : parameterMap.entrySet()) {
            Object o = entry.getValue();
            try {
                if (Number.class.isAssignableFrom(entry.getValue().getClass())) {
                    Class vc = entry.getValue().getClass();
                    Class key = entityClazz.getDeclaredField(entry.getKey()).getType();
                    if (vc != key) {
                        Method m = key.getMethod("valueOf", String.class);
                        o = m.invoke(null, entry.getValue().toString());
                    }
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
            query.setParameter(entry.getKey(), o);
        }
        return query;
    }

    public BaseDao() {
        Type type = getClass().getGenericSuperclass();
        if (type instanceof ParameterizedType) {
            this.entityClazz = (Class<T>) ((ParameterizedType) type).getActualTypeArguments()[0];
            sourceClazz = entityClazz;
        } else {
            this.entityClazz = null;
            sourceClazz = null;
        }
    }

    //------------------------------------------------------------------------------------------接口实现
    @Override
    public void delete(Serializable id) {
        delLogic(id, this.entityClazz);
    }

    protected void delLogic(Serializable id, Class<?> tClass) {
        String tableName = tClass.getAnnotation(Table.class).name();
        PropertyDescriptor sfyx = RxBeanUtils.getPropertyDescriptor(tClass, "sfyx_st");
        if (sfyx == null) {
            //没有有效标识位的直接物理删除
            executeSqlUpdate("delete from " + tableName + " where id = ?", id);
        } else {
            //否则更改标识位
            Long useid = (Long) HttpSessionHolder.get().getAttribute(Const.USER_ID);
            StringBuffer sql = new StringBuffer("update " + tableName + " set sfyx_st = '0' ");
            List args = new ArrayList();
            PropertyDescriptor pd_xgr = RxBeanUtils.getPropertyDescriptor(tClass, "xgr_id");
            if (pd_xgr != null) {
                sql.append(" ,xgr_id = ? ");
                args.add(useid);
            }
            PropertyDescriptor pd_xgsj = RxBeanUtils.getPropertyDescriptor(tClass, "xgsj");
            if (pd_xgsj != null) {
                sql.append(" ,xgsj = sysdate ");
            }
            sql.append(" where id = ? ");
            args.add(id);
            executeSqlUpdate(sql, args.toArray());
        }
    }

    @Override
    public void deleteCascade(Serializable id) {
        delLogicCascade(id, this.entityClazz);
    }

    protected void delLogicCascade(Serializable id, Class<?> clazz) {
        try {
            this.delLogic(id, clazz);
            Object t = getSession().get(clazz, id);
            Field[] fields = clazz.getDeclaredFields();
            Field.setAccessible(fields, true);
            for (Field f : fields) {
                OneToOne oto = f.getAnnotation(OneToOne.class);
                if (oto != null && !f.isAnnotationPresent(DelIgnore.class)) {
                    CascadeType[] cascadeTypes = oto.cascade();
                    for (CascadeType cascadeType : cascadeTypes) {
                        if (cascadeType == CascadeType.ALL || cascadeType == CascadeType.REMOVE) {
                            //获取属性值
                            Object o = f.get(t);
                            //获取属性对象ID属性
                            Field idFld = o.getClass().getDeclaredField("id");
                            idFld.setAccessible(true);
                            delLogicCascade((Serializable) idFld.get(o), o.getClass());
                            break;
                        }
                    }
                    continue;
                }
                OneToMany otm = f.getAnnotation(OneToMany.class);
                if (otm != null && !f.isAnnotationPresent(DelIgnore.class)) {
                    CascadeType[] cascadeTypes = otm.cascade();
                    for (CascadeType cascadeType : cascadeTypes) {
                        if (cascadeType == CascadeType.ALL || cascadeType == CascadeType.REMOVE) {
                            //获取属性值
                            Object o = f.get(t);
                            if (o instanceof Collection<?>) {
                                for (Object tmp : (Collection<?>) o) {
                                    //获取属性对象ID属性
                                    Field idFld = tmp.getClass().getDeclaredField("id");
                                    idFld.setAccessible(true);
                                    delLogicCascade((Serializable) idFld.get(tmp), tmp.getClass());
                                }
                            }
                            break;
                        }
                    }
                }
                ManyToMany mtm = f.getAnnotation(ManyToMany.class);
                if (mtm != null && !f.isAnnotationPresent(DelIgnore.class)) {
                    CascadeType[] cascadeTypes = mtm.cascade();
                    for (CascadeType cascadeType : cascadeTypes) {
                        if (cascadeType == CascadeType.ALL || cascadeType == CascadeType.REMOVE) {
                            JoinTable jt = f.getAnnotation(JoinTable.class);
                            if (jt != null) {
                                String tName = jt.name();
                                JoinColumn[] jcs = jt.joinColumns();
                                String fk = jcs[0].name();
                                deleteJoinTable(tName, fk, id);
                            }
                        }
                    }
                }
            }
        } catch (Throwable e) {
            throw new FatalBeanException("Could not cascade delete", e);
        } finally {
            entityClazz = sourceClazz;
        }
    }

    private void deleteJoinTable(String tName, String fk, Serializable id) {
        String condition = "select count(*) from user_tab_columns where table_name = ? and column_name = 'SFYX_ST'";
        Integer count = this.getJdbcTemplate().queryForObject(condition, Integer.class, id);
        if (count != null && count > 0) {
            if (RxStringUtils.isNotEmpty(tName) && RxStringUtils.isNotEmpty(fk)) {
                executeSqlUpdate("update " + tName + " set " + " sfyx_st = '0' where " + fk + " = ?", id);
            }
        } else {
            executeSqlUpdate("delete from " + tName + " where " + fk + " = ?", id);
        }
    }

    @Override
    public void saveOrUpdate(T entity) throws BeansException {
        Class<T> tClass = this.entityClazz;
        save(entity, tClass);
    }

    protected Object save(T entity, Class<T> tClass) {
        Object id = ObjectUtils.ifIdExist(entity);
        Session session =
                getSession();
        if (id != null) {
            Object persistent = null;
            if (((BaseDomain) entity).getInteractionFields() != null) {
                //先获取数据库中对象
                persistent = session.get(tClass, (Serializable) id);
                //覆盖修改的非空属性
                RxBeanUtils.copyPropertiesIgnoreNull(entity, persistent, session);
            } else {
                persistent = entity;
            }
            //修改系统属性
            ObjectUtils.setEntityValue(persistent, "xgr_id", "xgsj");
            //执行更新
            session.saveOrUpdate(persistent);
        } else {
            //系统属性赋初值
            ObjectUtils.setEntityValue(entity, "cjr_id", "cjsj", "xgr_id", "xgsj");
            //执行保存
            session.saveOrUpdate(entity);
        }
        return ObjectUtils.ifIdExist(entity);
    }

    @Override
    public void deleteBatch(String ids) {
        delLogicBatch(ids, this.entityClazz);
    }

    protected void delLogicBatch(String ids, Class<T> tClass) {
        String tableName = tClass.getAnnotation(Table.class).name();
        Long useid = (Long) HttpSessionHolder.get().getAttribute(Const.USER_ID);
        StringBuffer sql = new StringBuffer("update " + tableName + " set sfyx_st = 0 ");
        List args = new ArrayList();
        PropertyDescriptor pd_xgr = RxBeanUtils.getPropertyDescriptor(tClass, "xgr_id");
        if (pd_xgr != null) {
            sql.append(" ,xgr_id = ? ");
            args.add(useid);
        }
        PropertyDescriptor pd_xgsj = RxBeanUtils.getPropertyDescriptor(tClass, "xgsj");
        if (pd_xgsj != null) {
            sql.append(" ,xgsj = sysdate ");
        }
        sql.append(" where ").append(OracleUtils.getInSql("id", ids));
        executeSqlUpdate(sql, args.toArray());
    }

    @Override
    public void saveOrUpdateBatch(Collection<T> entities) {
        for (T entity : entities) {
            saveOrUpdate(entity);
        }
    }

    @Override
    public T get(Serializable id) {
        if (id == null || entityClazz == null)
            return null;
        return (T) getSession().get(entityClazz, id);
    }

    @Override
    public T getByHql(CharSequence queryString, Object... params) {
        Query qry = getSession().createQuery(queryString.toString());
        for (int i = 0; i < params.length; ++i) {
            qry.setParameter(i, params[i]);
        }
        List list = qry.setMaxResults(1).list();
        if (list.isEmpty())
            return null;
        return (T) list.get(0);
    }

    @Override
    public T getByHql(CharSequence queryString, Map<String, ?> params) {
        Query qry = getSession().createQuery(queryString.toString());
        setParameter(qry, params);
        List list = qry.setMaxResults(1).list();
        if (list.isEmpty())
            return null;
        return (T) list.get(0);
    }

    @Override
    @Deprecated
    public T getBySql(CharSequence sql, Object... params) {
        SQLQuery sqlQuery = getSession().createSQLQuery(sql.toString());
        for (int i = 0; i < params.length; ++i) {
            sqlQuery.setParameter(i, params[i]);
        }
        List list = sqlQuery.setResultTransformer(Transformers.aliasToBean(entityClazz)).list();
//        List list = sqlQuery.addEntity(entityClazz).list();
        if (list.isEmpty())
            return null;
        return (T) list.get(0);
    }

    @Override
    @Deprecated
    public T getBySql(CharSequence sql, Map<String, ?> params) {
        SQLQuery sqlQuery = getSession().createSQLQuery(sql.toString());
        setParameter(sqlQuery, params);
        List list = sqlQuery.setResultTransformer(Transformers.aliasToBean(entityClazz)).list();
//        List list = sqlQuery.addEntity(entityClazz).list();
        if (list.isEmpty())
            return null;
        return (T) list.get(0);
    }

    @Override
    public T getBySqlNative(CharSequence sql, Object... params) {
        return (T) ObjectUtils.parseMapToObj(this.getJdbcTemplate().queryForMap(sql.toString(), params), entityClazz);
    }

    @Override
    public T getBySqlNative(CharSequence sql, Map<String, ?> params) {
        return (T) ObjectUtils.parseMapToObj(this.getNpJdbcTemplate().queryForMap(sql.toString(), params), entityClazz);
    }

    @Override
    public List<T> findListByHql(CharSequence queryString, Object... params) {
        Query query = getSession().createQuery(queryString.toString());
        for (int i = 0; i < params.length; ++i) {
            query.setParameter(i, params[i]);
        }
        return query.list();
    }

    @Override
    public List<T> findListByHql(CharSequence queryString, Map<String, ?> params) {
//        if(params.get("HqlName")!=null){
//            params.remove("HqlName");
//        }
        Query query = getSession().createQuery(queryString.toString());
        setParameter(query, params);
        return query.list();
    }

    @Override
    public List<T> getListBySql(CharSequence sql, Object... params) {
        List<T> listT = new ArrayList<>();
        List<Map<String, Object>> list = this.getJdbcTemplate().queryForList(sql.toString(), params);
        for (Map map : list) {
            listT.add((T) ObjectUtils.parseMapToObj(map, entityClazz));
        }
        return listT;
//        SQLQuery sqlQuery = getSession().createSQLQuery(sql.toString());
//        for (int i = 0; i < params.length; ++i) {
//            sqlQuery.setParameter(i, params[i]);
//        }
//        return sqlQuery.addEntity(entityClazz).list();
    }

    @Override
    public List<T> getListBySql(CharSequence sql, Map<String, ?> params) {
        List<T> listT = new ArrayList<>();
        List<Map<String, Object>> list = this.getNpJdbcTemplate().queryForList(sql.toString(), params);
        for (Map map : list) {
            listT.add((T) ObjectUtils.parseMapToObj(map, entityClazz));
        }
        return listT;
//        SQLQuery sqlQuery = getSession().createSQLQuery(sql.toString());
//        setParameter(sqlQuery, params);
//        return sqlQuery.addEntity(entityClazz).list();
    }

    @Override
    public List<T> findByProperty(String name, Object value) {
        String hql = "from " + entityClazz.getSimpleName() + " where " + name + " = ? ";
        return findListByHql(hql, value);
    }

    @Override
    public List<T> findByProperty(Map<String, ?> conditionMap) {
        StringBuilder hql = new StringBuilder();
        hql.append("from  ").append(entityClazz.getSimpleName());
        if (!conditionMap.isEmpty()) {
            Iterator<String> it = conditionMap.keySet().iterator();
            String key = it.next();
            hql.append(" where  ").append(key).append("=:").append(key);
            while (it.hasNext()) {
                key = it.next();
                hql.append(" and  ").append(key).append("=:").append(key);
            }
        }
        return findListByHql(hql.toString(), conditionMap);
    }

    @Override
    public int executeSqlUpdate(CharSequence sql, Object... args) {
        SQLQuery queryObject = this.getSession().createSQLQuery(sql.toString());
        for (int i = 0; i < args.length; ++i) {
            queryObject.setParameter(i, args[i]);
        }
        return queryObject.executeUpdate();
    }

    @Override
    public int executeHqlUpdate(CharSequence hql, Object... args) {
        Query queryObject = getSession().createQuery(hql.toString());
        for (int i = 0; i < args.length; ++i) {
            queryObject.setParameter(i, args[i]);
        }
        return queryObject.executeUpdate();
    }

    @Override
    public FastPagination cacheNextTotalPaginationSql(CharSequence queryString, List params, Map pageParam) {
        FastPagination fastPagination = new FastPagination();
        int pageIndex = (int) pageParam.get("pageNo");
        int pageSize = (int) pageParam.get("pageSize");
        int oldPage = pageIndex;
        if (null != pageParam.get("oldPage")) {
            oldPage = (int) pageParam.get("oldPage");
        }
        String sql = "SELECT * FROM ( SELECT A.*, ROWNUM RN FROM( " +
                queryString +
                " ) A WHERE ROWNUM <= ? ) WHERE RN >= ?";
        List<Object> args = new ArrayList<>();
        args.addAll(params);
        if (pageIndex == 1 || oldPage == 1) {
            String totalsql = "SELECT count(*) as rn FROM( " + queryString + " ) A";
            Integer total = ((BigDecimal) this.getJdbcTemplate().queryForMap(totalsql, args.toArray()).get("RN")).intValue();
            fastPagination.setTotal(total);
        }
        Integer pages;
        if (oldPage <= pageIndex) {//向前翻页
            //end
            args.add(pageIndex * pageSize + 1);
            //start
            args.add((oldPage - 1) * pageSize + 1);
            pages = pageIndex - oldPage + 1;
        } else {      //向后翻页
            //end
            args.add(oldPage * pageSize + 1);
            //start
            args.add((pageIndex - 1) * pageSize + 1);
            pages = oldPage - pageIndex + 1;
        }
//        List rows = this.getListBySql(sql, args.toArray());
        List rows = this.getJdbcTemplate().queryForList(sql, args.toArray());
        fastPagination.setPageCurrent(pageIndex);
        fastPagination.setPageSize(pageSize);
        fastPagination.setRows(rows);
        if (rows.size() <= pageSize * pages) {
            fastPagination.setHasNext(false);
        } else {
            fastPagination.setHasNext(true);
            fastPagination.getRows().remove(fastPagination.getRows().size() - 1);
        }
        return fastPagination;
    }

    @Override
    public FastPagination cacheNextPagePaginationSql(CharSequence queryString, List params, int pageIndex, int pageSize, Boolean onePage, int oldPage) {
        String sql = "SELECT * FROM ( SELECT A.*, ROWNUM RN FROM( " +
                queryString +
                " ) A WHERE ROWNUM <= ? ) WHERE RN >= ?";
        List<Object> args = new ArrayList<>();
        args.addAll(params);
        FastPagination fastPagination = new FastPagination();
        if (pageIndex == 1 || oldPage == 1) {
            String totalsql = "SELECT count(*) as rn FROM( " + queryString + " ) A";
            Integer total = ((BigDecimal) this.getJdbcTemplate().queryForMap(totalsql, args.toArray()).get("RN")).intValue();
            fastPagination.setTotal(total);
        }
        Integer pages;
        if (oldPage <= pageIndex) {//向前翻页
            //end
            args.add(pageIndex * pageSize + 1);
            //start
            args.add((oldPage - 1) * pageSize + 1);
            pages = pageIndex - oldPage + 1;
        } else {      //向后翻页
            //end
            args.add(oldPage * pageSize + 1);
            //start
            args.add((pageIndex - 1) * pageSize + 1);
            pages = oldPage - pageIndex + 1;
        }
//        List rows = this.getListBySql(sql, args.toArray());
        List rows = this.getJdbcTemplate().queryForList(sql, args.toArray());
        fastPagination.setPageCurrent(pageIndex);
        fastPagination.setPageSize(pageSize);
        fastPagination.setRows(rows);
        if (rows.size() <= pageSize * pages) {
            fastPagination.setHasNext(false);
        } else {
            fastPagination.setHasNext(true);
        }
        return fastPagination;
    }

    @Override
    public FastPagination cacheNextPagePaginationSql(CharSequence queryString, int pageIndex, int pageSize, Boolean onePage, int oldPage, Object... params) {
        String sql = "SELECT * FROM ( SELECT A.*, ROWNUM RN FROM( " +
                queryString +
                " ) A WHERE ROWNUM <= ? ) WHERE RN >= ?";
        List<Object> args = new ArrayList<>();
        Collections.addAll(args, params);
        FastPagination fastPagination = new FastPagination();
        if (pageIndex == 1 || oldPage == 1) {
            String totalsql = "SELECT count(*) as rn FROM( " + queryString + " ) A";
            Integer total = ((BigDecimal) this.getJdbcTemplate().queryForMap(totalsql, args.toArray()).get("RN")).intValue();
            fastPagination.setTotal(total);
        }
        Integer pages;
        if (oldPage <= pageIndex) {//向前翻页
            //end
            args.add(pageIndex * pageSize + 1);
            //start
            args.add((oldPage - 1) * pageSize + 1);
            pages = pageIndex - oldPage + 1;
        } else {      //向后翻页
            //end
            args.add(oldPage * pageSize + 1);
            //start
            args.add((pageIndex - 1) * pageSize + 1);
            pages = oldPage - pageIndex + 1;
        }
//        List rows = this.getListBySql(sql, args.toArray());
        List rows = this.getJdbcTemplate().queryForList(sql, args.toArray());
        fastPagination.setPageCurrent(pageIndex);
        fastPagination.setPageSize(pageSize);
        fastPagination.setRows(rows);
        if (rows.size() <= pageSize * pages) {
            fastPagination.setHasNext(false);
        } else {
            fastPagination.setHasNext(true);
        }
        return fastPagination;
    }

    @Override
    public FastPagination cacheNextPagePaginationHql(CharSequence queryString, List params, int pageIndex, int pageSize, Boolean onePage, int oldPage) {
        Query query = getSession().createQuery(queryString.toString());
        for (int i = 0; i < params.size(); ++i) {
            query.setParameter(i, params.get(i));
        }
        FastPagination fastPagination = new FastPagination();
        if (pageIndex == 1 || oldPage == 1) {
            String totalsql = "SELECT count(*) as rn FROM( " + queryString + " ) A";
            Integer total = ((BigDecimal) this.getJdbcTemplate().queryForMap(totalsql, params.toArray()).get("RN")).intValue();
            fastPagination.setTotal(total);
        }
        int temp = (pageIndex < 2) ? 0 : (pageIndex - 1) * pageSize;
        if (oldPage <= pageIndex) {//判断向前翻页还是向后翻页
            //end
            if (!onePage) {
                query.setMaxResults(pageSize + pageSize);//向后多取一页数据
            } else {
                query.setMaxResults(pageSize);
            }
            //start
            query.setFirstResult(temp);
        } else {
            //end
            query.setMaxResults(pageSize);
            //start
            if (!onePage) {
                query.setFirstResult(temp - pageSize);//向前多取一页数据
            } else {
                query.setFirstResult(temp);
            }
        }
        List rows = query.list();
        fastPagination.setPageCurrent(pageIndex);
        fastPagination.setPageSize(pageSize);
        fastPagination.setRows(rows);
        if (rows.size() < pageSize) {
            fastPagination.setHasNext(false);
        } else {
            fastPagination.setHasNext(true);
        }
        return fastPagination;
    }

    @Override
    public FastPagination cacheNextPagePaginationHql(CharSequence queryString, int pageIndex, int pageSize, Boolean onePage, int oldPage, Object... params) {
        Query query = getSession().createQuery(queryString.toString());
        for (int i = 0; i < params.length; ++i) {
            query.setParameter(i, params[i]);
        }
        FastPagination fastPagination = new FastPagination();
        if (pageIndex == 1 || oldPage == 1) {
            String totalsql = "SELECT count(*) as rn FROM( " + queryString + " ) A";
            Integer total = ((BigDecimal) this.getJdbcTemplate().queryForMap(totalsql, params).get("RN")).intValue();
            fastPagination.setTotal(total);
        }
        if (oldPage <= pageIndex) {//判断向前翻页还是向后翻页
            //end
            if (!onePage) {
                query.setMaxResults(pageSize + pageSize);//向后多取一页数据
            } else {
                query.setMaxResults(pageSize);
            }
            //start
            query.setFirstResult((pageIndex < 2) ? 0 : (pageIndex - 1) * pageSize);
        } else {
            //end
            query.setMaxResults(pageSize);
            //start
            if (!onePage) {
                query.setFirstResult((pageIndex < 2) ? 0 : (pageIndex - 1) * pageSize - pageSize);//向前多取一页数据
            } else {
                query.setFirstResult((pageIndex < 2) ? 0 : (pageIndex - 1) * pageSize);
            }
        }
        List rows = query.list();
        fastPagination.setPageCurrent(pageIndex);
        fastPagination.setPageSize(pageSize);
        fastPagination.setRows(rows);
        if (rows.size() < pageSize) {
            fastPagination.setHasNext(false);
        } else {
            fastPagination.setHasNext(true);
        }
        return fastPagination;
    }

    @Override
    public String prepareCallAndReturn(final CharSequence callSql, final Object... inParameters) {
        Session session = getSession();
        return session.doReturningWork(new ReturningWork<String>() {
            @Override
            public String execute(Connection connection) throws SQLException {
                CallableStatement cs = connection.prepareCall(callSql.toString());
                int inParametersLength = inParameters.length;
                for (int i = 0; i < inParametersLength; i++) {
                    cs.setObject(i + 1, inParameters[i]);
                }
                cs.registerOutParameter(inParametersLength + 1, Types.VARCHAR);
                cs.registerOutParameter(inParametersLength + 2, Types.VARCHAR);
                cs.executeUpdate();
                if (cs.getString(inParametersLength + 2).equals("SUCCESS"))
                    return cs.getString(inParametersLength + 1);
                else
                    throw new RuntimeException(cs.getString(inParametersLength + 2));
            }
        });
    }

    @Override
    public List prepareCallAndReturnList(final CharSequence callSql, final Object... inParameters) {
        Session session = getSession();
        return session.doReturningWork(new ReturningWork<List>() {
            @Override
            public List execute(Connection connection) throws SQLException {
                CallableStatement cs = connection.prepareCall(callSql.toString());
                int inParametersLength = inParameters.length;
                for (int i = 0; i < inParametersLength; i++) {
                    cs.setObject(i + 1, inParameters[i]);
                }
                cs.registerOutParameter(inParametersLength + 1, oracle.jdbc.internal.OracleTypes.CURSOR);
                cs.registerOutParameter(inParametersLength + 2, Types.VARCHAR);
                cs.executeUpdate();
                if (cs.getString(inParametersLength + 2).equals("SUCCESS"))
                    return OracleUtils.parseResultSetToList((ResultSet) cs.getObject(inParametersLength + 1), null);
                else
                    throw new RuntimeException(cs.getString(inParametersLength + 2));
            }
        });
    }

    @Override
    public void prepareCallNoReturn(final CharSequence callSql, final Object... inParameters) {
        Session session = getSession();
        session.doWork(new Work() {
            @Override
            public void execute(Connection connection) throws SQLException {
                CallableStatement cs = connection.prepareCall(callSql.toString());
                int inParametersLength = inParameters.length;
                for (int i = 0; i < inParametersLength; i++) {
                    cs.setObject(i + 1, inParameters[i]);
                }
                cs.registerOutParameter(inParametersLength + 1, Types.VARCHAR);
                cs.executeUpdate();
                if (!cs.getString(inParametersLength + 1).equals("SUCCESS"))
                    throw new RuntimeException(cs.getString(inParametersLength + 1));
            }
        });
    }

    @Override
    public List<Object> prepareCallAndReturnCustom(final CharSequence callSql, final List<Object> inParameters, final List<Integer> outTypeList) {
        Session session = getSession();
        return session.doReturningWork(new ReturningWork<List>() {
            @Override
            public List<Object> execute(Connection connection) throws SQLException {
                CallableStatement cs = connection.prepareCall(callSql.toString());
                int inParametersLength = inParameters.size();
                int outLength = outTypeList.size();
                for (int i = 0; i < inParametersLength; i++) {
                    cs.setObject(i + 1, inParameters.get(i));
                }
                for (int j = 0; j < outLength; j++) {
                    cs.registerOutParameter(inParametersLength + j + 1, outTypeList.get(j));
                }
                cs.registerOutParameter(inParametersLength + outLength + 1, Types.VARCHAR);
                cs.executeUpdate();
                if (!cs.getString(inParametersLength + outLength + 1).equals("SUCCESS"))
                    throw new RuntimeException(cs.getString(inParametersLength + outLength + 1));
                else {
                    List<Object> result = new ArrayList<>();
                    for (int k = 0; k < outLength; k++) {
                        if (outTypeList.get(k).equals(OracleTypes.CURSOR)) {
                            result.add(OracleUtils.parseResultSetToList((ResultSet) cs.getObject(inParametersLength + k + 1), null));
                        } else {
                            result.add(cs.getObject(inParametersLength + k + 1));
                        }
                    }
                    return result;
                }
            }
        });
    }
}