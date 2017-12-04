package net.ruixin.service.plat.auth.impl;

import net.ruixin.dao.plat.auth.IRuleDao;
import net.ruixin.domain.plat.auth.SysAuthRule;
import net.ruixin.service.plat.auth.IRuleService;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.paginate.FastPagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-9-22.
 * 权限控制类——控制规则、功能权限、数据权限
 */
@Service
public class RuleService implements IRuleService {

    @Autowired
    private IRuleDao ruleDao;

    @Override
    public FastPagination getAuthRuleList(Map map) {
        return ruleDao.getAuthRuleList(map);
    }

    @Override
    public SysAuthRule getAuthRuleById(Long authRuleId) {
        return ruleDao.getAuthRuleById(authRuleId);
    }

    @Override
    @Transactional
    public void saveAuthRule(SysAuthRule sysAuthRule) {
        ruleDao.saveAuthRule(sysAuthRule);
    }

    @Override
    public void delAuthRule(Long authRuleId) {
        ruleDao.delAuthRule(authRuleId);
    }

    @Override
    public AjaxReturn getRoleNameByRuleId(Long ruleId) {
        AjaxReturn ar = new AjaxReturn();
        List<Map<String, Object>> list = ruleDao.getRoleNameByRuleId(ruleId);
        List<Object> newList = new ArrayList<>();
        if (list.size() > 0) { //被其它角色使用
            Map<String, Object> map = new HashMap<>();
            map.put("data", list);
            map.put("name", "角色");
            map.put("showName", "ROLE_NAME");
            newList.add(map);
            ar.setSuccess(false).setData(newList);
        } else { //未被其它角色使用
            ar.setSuccess(true);
        }
        return ar;
    }

    @Override
    public boolean checkRuleDetail(String ruleDetail) {
        return ruleDao.checkRuleDetail(ruleDetail);
    }
}
