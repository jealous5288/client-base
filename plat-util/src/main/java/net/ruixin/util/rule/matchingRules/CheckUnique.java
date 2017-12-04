package net.ruixin.util.rule.matchingRules;

import net.ruixin.util.exception.RuleException;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.rule.SelfValidate;
import net.ruixin.util.tools.ObjectUtils;
import org.hibernate.Query;
import org.springframework.stereotype.Service;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA
 * User: Administrator
 * Date: 15-10-28
 * Time: 下午1:26
 * To change this template use File | Settings | File Templates.
 */
@Service
public class CheckUnique extends BaseDao implements SelfValidate {

    @SuppressWarnings("unchecked")
    @Override
    public void validate(String propertyName, Object propertyValue, Map<String, Object> parameters, Object entity) throws RuleException {
        int count;
        try {
            Class clazz = entity.getClass();
            String clazzName = ObjectUtils.getRealClassName(entity);
            String hql = "select count(a) from " + clazzName + " a where a.sfyx_st = '1' and  a." + propertyName + " = ?";
            Method m = clazz.getDeclaredMethod("getId");
            Long entityId = (Long) m.invoke(entity);
            if (entityId != null) {
                hql += " and a.id<>" + entityId;
            }
            List<Object> params = new ArrayList<>();
            params.add(propertyValue);
            Query query = this.getSession().createQuery(hql);
            for (int i = 0; i < params.size(); i++) {
                query.setParameter(i, params.get(i));
            }
            count = Integer.parseInt(query.uniqueResult().toString());
        } catch (Exception e) {
            throw new RuleException("验重时，数据库查询失败," + e);
        }
        if (count != 0) {
            throw new RuleException("该" + parameters.get("name") + "已存在");
        }
    }
}
