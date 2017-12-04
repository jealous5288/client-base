package net.ruixin.service.plat.auth.impl;

import net.ruixin.service.plat.auth.IGenerateStrategy;
import net.ruixin.util.constant.Const;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.http.HttpSessionHolder;
import org.springframework.stereotype.Service;

import java.lang.reflect.Method;

/**
 * Created by Ruixin on 2016/9/29.
 * 规则——java实现
 */
@SuppressWarnings("unused")
@Service
public class JavaStrategy extends BaseDao implements IGenerateStrategy {
    @SuppressWarnings("unchecked")
    @Override
    public String getDataIds(String ruleDetail) throws Exception {
        Long userId = (Long) HttpSessionHolder.get().getAttribute(Const.USER_ID);
        Class cls = RuleJavaUtil.class;
        Method method = cls.getMethod(ruleDetail, Integer.class);
        return (String) method.invoke(null, userId);
    }
}
