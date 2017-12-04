package net.ruixin.service.plat.auth.impl;

import net.ruixin.service.plat.auth.IGenerateStrategy;
import net.ruixin.util.constant.Const;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.http.HttpSessionHolder;
import org.springframework.stereotype.Service;

/**
 * Created by Ruixin on 2016/9/29.
 * 规则——存储过程实现
 */
@SuppressWarnings("unused")
@Service
public class ProcedureStrategy extends BaseDao implements IGenerateStrategy {
    @SuppressWarnings({"MismatchedQueryAndUpdateOfCollection", "unchecked"})
    @Override
    public String getDataIds(String ruleDetail) {
        Long userId = (Long) HttpSessionHolder.get().getAttribute(Const.USER_ID);
        return super.prepareCallAndReturn("{call " + ruleDetail + "(?,?,?)}", userId);
    }
}
