package net.ruixin.dao.plat.organ.impl;

import net.ruixin.dao.plat.organ.IUserDao;
import net.ruixin.domain.plat.organ.SysUser;
import net.ruixin.enumerate.plat.Sfyx_st;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-8-17.
 * 用户DAO实现
 */
@Repository
public class UserDao extends BaseDao<SysUser> implements IUserDao {

    @Override
    public SysUser getUserById(Long userId) {
        SysUser user = super.get(userId);
        if (user != null) {
            Hibernate.initialize(user.getSysGlbRoleList());
            Hibernate.initialize(user.getSysGlbOrganUserPostList());
        }
        return user;
    }

    @Override
    public FastPagination getUserList(Map map, String hasDelData) {
        StringBuilder sql = new StringBuilder();
        List<Object> params = new ArrayList<>();
        sql.append(" SELECT U.ID,\n" +
                "       U.LOGIN_NAME,\n" +
                "       U.USER_NAME,\n" +
                "       U.IS_BLOCKED,\n" +
                "       U.CJSJ,\n" +
                "       U.SFYX_ST,\n" +
                "       U.SFKHF,\n" +
                "       (SELECT O.ORGAN_NAME FROM SYS_ORGAN O " +
                "       WHERE O.ID=U.DEFAULT_ORGAN_ID AND O.SFYX_ST='1') ORGAN_NAME\n" +
                "  FROM SYS_USER U ");
        if (RxStringUtils.isNotEmpty(map.get("organ_id")) || RxStringUtils.isNotEmpty(map.get("post_id"))) {
            sql.append(" ,SYS_GLB_ORGAN_USER_POST OUP " +
                    "WHERE U.ID = OUP.USER_ID AND OUP.SFYX_ST = '1' ");
            if ("-1".equals(map.get("organ_id"))) {
                sql.append(" AND OUP.ORGAN_ID IS NULL ");
            } else if (RxStringUtils.isNotEmpty(map.get("organ_id"))) {
                sql.append(" AND OUP.ORGAN_ID = ? ");
                params.add(map.get("organ_id"));
            }
            if (RxStringUtils.isNotEmpty(map.get("post_id"))) {
                sql.append(" AND OUP.POST_ID = ? ");
                params.add(map.get("post_id"));
            }
            if (RxStringUtils.isNotEmpty(map.get("user_name"))) {
                sql.append(" AND U.USER_NAME LIKE ? ");
                params.add("%" + map.get("user_name") + "%");
            }
        } else if (RxStringUtils.isNotEmpty(map.get("user_name"))) {
            sql.append(" WHERE 1=1 AND U.USER_NAME LIKE ? ");
            params.add("%" + map.get("user_name") + "%");
        } else {
            sql.append(" WHERE 1=1 ");
        }
        if (RxStringUtils.isEmpty(hasDelData)) {
            sql.append(" AND U.SFYX_ST = '1' ");
        } else {
            sql.append(" AND (U.SFYX_ST = '1' OR U.SFKHF = '1') ");
        }
        sql.append(" ORDER BY U.IS_BLOCKED,U.XGSJ DESC ");
        return super.cacheNextPagePaginationSql(sql, params, (Integer) map.get("pageNo"),
                (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }

    @Override
    public void saveUser(SysUser sysUser) {
        super.saveOrUpdate(sysUser);
        super.getSession().flush();
        //调用存储过程
        List<Object> params = new ArrayList<>();
        params.add(sysUser.getId());
        params.add(4);  //参数类型定义 1为roleId、2为organId、3为postId、4为userId
        super.prepareCallNoReturn("{call PKG_PLATFORM.USP_SYS_GLB_ROLE_USER(?,?,?)}", params.toArray());
    }

    @Override
    public List<Map<String, Object>> getUserListByOrganId(Long organId, String hasDelData) {
        StringBuilder sql = new StringBuilder("SELECT DISTINCT U.ID, " +
                "       U.LOGIN_NAME, " +
                "       U.USER_NAME MC, " +
                "       U.DEFAULT_ORGAN_ID ORGAN,\n" +
                "       U.SFYX_ST, " +
                "       U.SFKHF, " +
                "       U.SORT, " +
                "       U.IS_BLOCKED " +
                "  FROM SYS_USER U, SYS_GLB_ORGAN_USER_POST OUP\n" +
                " WHERE U.ID = OUP.USER_ID\n" +
                "   AND OUP.SFYX_ST = '1' ");
        List<Object> args = new ArrayList<>();
        if (organId == -1) {
            sql.append(" AND OUP.ORGAN_ID IS NULL ");
        } else {
            sql.append(" AND OUP.ORGAN_ID=? ");
            args.add(organId);
        }
        if (RxStringUtils.isEmpty(hasDelData)) {
            sql.append(" AND U.SFYX_ST = '1' ");
        } else {
            sql.append(" AND (U.SFYX_ST = '1' OR U.SFKHF = '1') ");
        }
        sql.append(" ORDER BY U.IS_BLOCKED, U.SORT ");
        if (args.size() > 0) {
            return super.getJdbcTemplate().queryForList(sql.toString(), args.toArray());
        } else {
            return super.getJdbcTemplate().queryForList(sql.toString());
        }
    }

    @Override
    public List<Map<String, Object>> getUserListByPostId(Long postId, String hasDelData) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT U.ID, U.LOGIN_NAME, U.USER_NAME MC, U.SFYX_ST, U.SFKHF\n" +
                "  FROM SYS_GLB_ORGAN_USER_POST OUP, SYS_USER U\n" +
                " WHERE OUP.USER_ID = U.ID\n" +
                "   AND OUP.SFYX_ST = '1'\n" +
                "   AND OUP.POST_ID = ? ");
        if (RxStringUtils.isEmpty(hasDelData)) {
            sql.append(" AND U.SFYX_ST = '1' ");
        } else {
            sql.append(" AND (U.SFYX_ST = '1' OR U.SFKHF = '1') ");
        }
        sql.append(" ORDER BY U.SORT ");
        return super.getJdbcTemplate().queryForList(sql.toString(), postId);
    }

    @Override
    public List<Map<String, Object>> getWgwUserListByOrganId(Long organId, String hasDelData) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT U.ID, U.LOGIN_NAME, U.USER_NAME MC, U.DEFAULT_ORGAN_ID ORGAN,\n" +
                "       U.SFYX_ST, U.SFKHF " +
                "  FROM SYS_USER U, SYS_GLB_ORGAN_USER_POST OUP\n" +
                " WHERE U.ID = OUP.USER_ID\n" +
                "   AND OUP.SFYX_ST = '1'\n" +
                "   AND OUP.ORGAN_ID = ?\n" +
                "   AND OUP.POST_ID IS NULL ");
        if (RxStringUtils.isEmpty(hasDelData)) {
            sql.append(" AND U.SFYX_ST = '1' ");
        } else {
            sql.append(" AND (U.SFYX_ST = '1' OR U.SFKHF = '1') ");
        }
        sql.append(" ORDER BY U.IS_BLOCKED, U.SORT ");
        return super.getJdbcTemplate().queryForList(sql.toString(), organId);
    }

    @Override
    public List<Map<String, Object>> getWjgWgwUserList(String hasDelData) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT U.ID, U.LOGIN_NAME, U.USER_NAME MC, U.DEFAULT_ORGAN_ID ORGAN, " +
                "       U.SFYX_ST, U.SFKHF " +
                "  FROM SYS_USER U " +
                " WHERE U.DEFAULT_ORGAN_ID IS NULL ");
        if (RxStringUtils.isEmpty(hasDelData)) {
            sql.append(" AND U.SFYX_ST = '1' ");
        } else {
            sql.append(" AND (U.SFYX_ST = '1' OR U.SFKHF = '1') ");
        }
        sql.append(" ORDER BY U.IS_BLOCKED, U.SORT ");
        return super.getJdbcTemplate().queryForList(sql.toString());
    }

    @Override
    public List<Map<String, Object>> getUserGlxx(Long userId) {
        String sb = "SELECT R.ID, R.ROLE_CODE, R.ROLE_NAME\n" +
                "  FROM SYS_GLB_ROLE_USER RU\n" +
                "  LEFT JOIN SYS_ROLE R\n" +
                "    ON RU.ROLE_ID = R.ID\n" +
                "   AND R.SFYX_ST = '1'\n" +
                " WHERE RU.USER_ID = ?\n" +
                "   AND RU.SFYX_ST = '1'";
        return super.getJdbcTemplate().queryForList(sb, userId);
    }

    @Override
    public void able(Long userId) {
        SysUser user = super.get(userId);
        user.setSfyx_st(Sfyx_st.VALID);
        user.setSfkhf("0");
        this.saveUser(user);
    }

    @Override
    public void del(Long userId) {
        SysUser user = super.get(userId);
        user.setSfyx_st(Sfyx_st.UNVALID);
        user.setSfkhf("0");
        this.saveUser(user);
    }

    @Override
    public void pause(Long userId) {
        SysUser user = super.get(userId);
        user.setSfyx_st(Sfyx_st.UNVALID);
        user.setSfkhf("1");
        this.saveUser(user);
    }

    @Override
    public SysUser getUserByLoginInfo(String loginName, String loginPwd) {
        String hql = "from SysUser u where u.loginName=? and u.loginPwd=? and u.sfyx_st='1' ";
        SysUser user = super.getByHql(hql, loginName, loginPwd);
        if (user != null) {
            Hibernate.initialize(user.getSysGlbRoleList());
            Hibernate.initialize(user.getSysGlbOrganUserPostList());
        }
        return user;
    }

    @Override
    public boolean changePwd(String newPwd, Long userId) {
        String sql = "UPDATE SYS_USER SET LOGIN_PWD=? WHERE ID=? AND SFYX_ST='1' ";
        return super.executeSqlUpdate(sql, newPwd, userId) > 0;
    }

    @Override
    public void saveUserMenu(Long userId, String menuIds) {
        //删除原有的用户关联菜单
        String delSql = "DELETE FROM SYS_GLB_MENU GM WHERE GM.GL_ID = ? AND GM.GL_TYPE = '2'";
        super.executeSqlUpdate(delSql, userId);
        //生成用户与菜单关联关系
        if (RxStringUtils.isNotEmpty(menuIds)) {
            String insertSql = "INSERT INTO SYS_GLB_MENU(ID, MENU_ID, GL_ID, GL_TYPE)" +
                    " VALUES(SEQ_SYS_GLB_MENU.NEXTVAL,?,?,'2')";
            for (String menuId : menuIds.split(",")) {
                super.executeSqlUpdate(insertSql, Integer.parseInt(menuId), userId);
            }
        }
        //将用户的个性维护菜单标志维护为1
        String updSql = "UPDATE SYS_USER U SET U.SFWHGXCD='1' WHERE U.ID = ? ";
        super.executeSqlUpdate(updSql, userId);
    }

    /**
     * 根据用户name获取用户信息
     *
     * @param name 用户name
     */
    @Override
    public List<Map<String, Object>> getUserByName(String name, Long ssbmId, String ids) {
        StringBuilder sql = new StringBuilder();
        List<Object> param = new ArrayList<>();
        param.add(ssbmId);
        sql.append("SELECT U.ID,U.IS_BLOCKED SFFJ,U.USER_NAME MC,NVL(O.ORGAN_NAME,'无') SSBM FROM SYS_USER U ")
                .append(" LEFT JOIN SYS_ORGAN O ON U.DEFAULT_ORGAN_ID = O.ID AND O.SFYX_ST = '1'")
                .append(" WHERE U.SFYX_ST = '1'")
                .append(" AND U.DEFAULT_ORGAN_ID <> ?");
        if (RxStringUtils.isNotEmpty(name)) {
            sql.append(" AND U.USER_NAME LIKE ? ");
            param.add("%" + name + "%");
        }
        if (RxStringUtils.isNotEmpty(ids)) {
            sql.append(" AND U.ID NOT IN (")
                    .append(ids)
                    .append(") ");
        }
        sql.append(" ORDER BY U.IS_BLOCKED");
        return super.getJdbcTemplate().queryForList(sql.toString(), param.toArray());
    }

    @Override
    public SysUser findUserByLoginName(String loginName) {
        return super.getByHql("from SysUser t where t.loginName = ? and t.sfyx_st = '1'",loginName);
    }

}
