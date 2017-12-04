package net.ruixin.service.plat.auth.impl;

import net.ruixin.service.plat.auth.IGenerateStrategy;
import net.ruixin.util.constant.Const;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.http.HttpSessionHolder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Ruixin on 2016/9/29.
 * 规则——sql脚本实现
 */
@SuppressWarnings("unused")
@Service
public class SqlStrategy extends BaseDao implements IGenerateStrategy {
    
    @Override
    public String getDataIds(String ruleDetail) {
        StringBuilder sb = new StringBuilder();
        List<String> strs = super.getJdbcTemplate().queryForList(
                ruleDetail, String.class,(Long) HttpSessionHolder.get().getAttribute(Const.USER_ID));
        for (String str : strs) {
            sb.append(str).append(",");
        }
        return sb.substring(0, sb.length() - 1);
    }
}
