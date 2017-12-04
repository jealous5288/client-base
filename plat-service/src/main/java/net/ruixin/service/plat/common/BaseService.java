package net.ruixin.service.plat.common;

import net.ruixin.dao.plat.common.IGenericBaseDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.List;

/**
 * Created by Jealous on 2017-2-27.
 * 通用服务层接口实现
 */
@Service
@Transactional
public class BaseService implements IBaseService {
    @Autowired
    private IGenericBaseDao genericBaseDao;

    @Override
    public <T> void save(T entity) {
        genericBaseDao.saveOrUpdate(entity);
    }

    @Override
    public <T> void delete(Class<T> entity, Serializable id) {
        genericBaseDao.delete(entity, id);
    }

    @Override
    public <T> void deleteBatch(Class<T> entity, String ids) {
        genericBaseDao.deleteBatch(entity, ids);
    }

    @Override
    public <T> void deleteCascade(Class<T> entity, Serializable id) {
        genericBaseDao.deleteCascade(entity, id);
    }

    @Override
    public <T> T get(Class<T> clazz, Serializable id) {
        return genericBaseDao.get(clazz, id);
    }

    @Override
    public <T> T findUniqueByProperty(Class<T> entityClass, String propertyName, Object value) {
        return genericBaseDao.findUniqueByProperty(entityClass, propertyName, value);
    }

    @Override
    public <T> List<T> findByProperty(Class<T> entityClass, String propertyName, Object value) {
        return genericBaseDao.findByProperty(entityClass, propertyName, value);
    }

    public  <T> void saveHibernate(T entity){
        genericBaseDao.saveHibernate(entity);
    }
}
