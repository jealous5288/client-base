package net.ruixin.service.plat.auth;


import net.ruixin.domain.plat.auth.SysAuthRule;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.paginate.FastPagination;

import java.util.Map;

/**
 * Created by admin on 2016-9-22.
 * 权限控制类——控制规则、功能权限、数据权限
 */
public interface IRuleService {

    /**
     * 获取权限规则分页列表
     *
     * @param map RULE_NAME：规则名称  GZLX：规则类型
     * @return FastPagination
     */
    FastPagination getAuthRuleList(Map map);

    /**
     * 根据权限规则id获取权限规则实体
     *
     * @param authRuleId 权限规则id
     * @return SysAuthRule
     */
    SysAuthRule getAuthRuleById(Long authRuleId);

    /**
     * 保存权限规则实体
     *
     * @param sysAuthRule 权限规则实体
     */
    void saveAuthRule(SysAuthRule sysAuthRule);

    /**
     * 根据权限规则id删除权限规则
     *
     * @param authRuleId 权限规则id
     */
    void delAuthRule(Long authRuleId);

    /**
     * 根据规则id查询角色name
     *
     * @param ruleId 规则ID
     * @return AjaxReturn
     */
    AjaxReturn getRoleNameByRuleId(Long ruleId);

    boolean checkRuleDetail(String ruleDetail);
}
