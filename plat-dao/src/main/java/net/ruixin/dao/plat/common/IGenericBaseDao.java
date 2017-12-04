package net.ruixin.dao.plat.common;

import java.io.Serializable;
import java.util.List;

/**
 * Created by Jealous on 2017-2-28.
 * DAO层泛型基类接口
 */
@SuppressWarnings("unused")
public interface IGenericBaseDao {

    /**
     * 保存或更新实体, 实体没有主键时保存，否则更新
     *
     * @param entity 实体对象
     */
    <T> void saveOrUpdate(T entity);

    /**
     * 删除实体
     *
     * @param entity 实体类
     * @param id 实体对象主键
     */
    <T> void delete(Class<T> entity, Serializable id);

    /**
     * 批量删除实体
     *
     * @param ids 实体主键集合
     */
    <T> void deleteBatch(Class<T> entity, String ids);

    /**
     * 根据实体名称和主键获取实体
     *
     * @param entityName 实体类
     * @param id         实体主键
     */
    <T> T get(Class<T> entityName, Serializable id);

    /**
     * 根据实体名字获取唯一记录
     *
     * @param propertyName 属性名
     * @param value         属性值
     */
    <T> T findUniqueByProperty(Class<T> entityClass, String propertyName, Object value);

    /**
     * 按属性查找对象列表.
     *
     * @param propertyName 属性名
     * @param value         属性值
     */
    <T> List<T> findByProperty(Class<T> entityClass, String propertyName, Object value);

    <T> void deleteCascade(Class<T> entity, Serializable id);

    <T> void saveHibernate(T entity);
}
