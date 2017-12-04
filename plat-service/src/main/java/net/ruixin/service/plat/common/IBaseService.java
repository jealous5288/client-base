package net.ruixin.service.plat.common;

import java.io.Serializable;
import java.util.List;

/**
 * Created by Jealous on 2017-2-27.
 * 通用服务层接口
 */
public interface IBaseService {
    /**
     * 保存对象
     * @param entity
     * @param <T>
     */
    <T> void save(T entity);

    /**
     * 通过单个id删除对象
     * @param entity
     * @param id
     * @param <T>
     */
    <T> void delete(Class<T> entity, Serializable id);

    /**
     * 批量删除实体
     * @param entity
     * @param ids
     * @param <T>
     */
    <T> void deleteBatch(Class<T> entity, String ids);

    /**
     * 级联删除
     * @param entity
     * @param id
     * @param <T>
     */
    <T> void deleteCascade(Class<T> entity, Serializable id);

    /**
     * 通过id获取到实体对象
     * @param clazz
     * @param id
     * @param <T>
     * @return
     */
    <T> T get(Class<T> clazz, Serializable id);

    /**
     * 通过属性查找单一的参数
     * @param entityClass
     * @param propertyName
     * @param value
     * @param <T>
     * @return
     */
    <T> T findUniqueByProperty(Class<T> entityClass, String propertyName, Object value);

    /**
     * 通过参数查看对象list
     * @param entityClass
     * @param propertyName
     * @param value
     * @param <T>
     * @return
     */
    <T> List<T> findByProperty(Class<T> entityClass, String propertyName, Object value);
}
