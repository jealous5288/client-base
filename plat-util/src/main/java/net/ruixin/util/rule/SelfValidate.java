package net.ruixin.util.rule;

import net.ruixin.util.exception.RuleException;

import java.util.Map;

/**
 * 验证接口
 */
public interface SelfValidate {
    /**
     * 验证操作
     * @param propertyName  属性名称
     * @param propertyValue 属性值
     * @param parameters    规则中的验证参数map<"ruleValue">
     * @param entity        实际对象
     */
    void validate(String propertyName, Object propertyValue, Map<String, Object> parameters, Object entity) throws RuleException;
}
