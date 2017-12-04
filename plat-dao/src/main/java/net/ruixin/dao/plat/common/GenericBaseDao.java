package net.ruixin.dao.plat.common;

import net.ruixin.util.hibernate.BaseDao;
import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import java.io.Serializable;
import java.util.List;

/**
 * Created by Jealous on 2017-2-28.
 * DAO层泛型基类
 */
@Repository
public class GenericBaseDao extends BaseDao implements IGenericBaseDao {

    private static final Logger logger = LoggerFactory.getLogger(GenericBaseDao.class);

    @Override
    public void saveOrUpdate(Object entity) throws BeansException {
        try {
            Object id = super.save(entity, entity.getClass());

            logger.debug("保存成功,{}:{}", entity.getClass().getName(), id);

        } catch (Exception e) {
            logger.error("保存异常", e);
            throw e;
        }
    }

    @Override
    public <T> void delete(Class<T> entity, Serializable id) {
        try {
            super.delLogic(id, entity);
            logger.debug("删除成功,{}:{}", entity.getClass().getName(), id);

        } catch (RuntimeException e) {
            logger.error("删除异常", e);
            throw e;
        }
    }

    @Override
    public <T> void deleteBatch(Class<T> entity, String ids) {
        try {
            super.delLogicBatch(ids, entity);
            logger.debug("批量删除成功,{}:{}", entity.getClass().getName(), ids);
        } catch (RuntimeException e) {
            logger.error("批量删除异常", e);
            throw e;
        }
    }

    @Override
    public <T> T get(Class<T> entityClass, Serializable id) {
        return (T) getSession().get(entityClass, id);
    }

    @Override
    public <T> T findUniqueByProperty(Class<T> entityClass, String propertyName, Object value) {
        Assert.hasText(propertyName);
        return (T) createCriteria(entityClass,
                Restrictions.eq(propertyName, value)).uniqueResult();
    }

    @Override
    public <T> List<T> findByProperty(Class<T> entityClass, String propertyName, Object value) {
        Assert.hasText(propertyName);
        return (List<T>) createCriteria(entityClass,
                Restrictions.eq(propertyName, value)).list();
    }

    @Override
    public <T> void deleteCascade(Class<T> entity, Serializable id) {
        try {
            super.delLogicCascade(id, entity);
            logger.debug("删除成功,{}:{}", entity.getClass().getName(), id);
        } catch (Exception e) {
            logger.error("删除异常", e);
            throw new RuntimeException(e);
        }
    }

    private <T> Criteria createCriteria(Class<T> entityClass, Criterion... criterions) {
        Criteria criteria = getSession().createCriteria(entityClass);
        for (Criterion c : criterions) {
            criteria.add(c);
        }
        return criteria;
    }

    @Override
    public <T> void saveHibernate(T entity) {
        getSession().saveOrUpdate(entity);
    }
}
