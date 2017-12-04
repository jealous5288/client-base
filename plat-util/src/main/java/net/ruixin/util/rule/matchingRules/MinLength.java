package net.ruixin.util.rule.matchingRules;

import net.ruixin.util.exception.RuleException;
import net.ruixin.util.rule.SelfValidate;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: Administrator
 * Date: 15-10-28
 * Time: 下午1:26
 * To change this template use File | Settings | File Templates.
 */
@Service
public class MinLength implements SelfValidate {

    /**
     * 大于长度限制
     *
     * @param propertyName 属性名
     * @param propertyValue 属性值
     * @param parameters 参数
     */
    @Override
    public void validate(String propertyName, Object propertyValue, Map<String, Object> parameters, Object entity) throws RuleException {
        String ruleValue = parameters.containsKey("ruleValue") ? parameters.get("ruleValue").toString() : "false";
        if (propertyValue != null) {
            int length = propertyValue.toString().length();
            int lengthRule;
            try {
                lengthRule = Integer.parseInt(ruleValue);
            } catch (Exception e) {
                throw new RuleException(parameters.get("name") + "长度限制的定义不正确，参数不为数值类型");
            }
            if (lengthRule > length) {
                throw new RuleException(parameters.get("name") + "长度过短");
            }
        }
    }
}
