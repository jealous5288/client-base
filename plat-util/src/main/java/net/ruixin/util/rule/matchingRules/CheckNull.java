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
public class CheckNull implements SelfValidate {
    /**
     * 验证字段不能为空
     */
    @Override
    public void validate(String propertyName, Object propertyValue, Map<String, Object> parameters, Object entity) throws RuleException {
        String ruleValue = parameters.containsKey("ruleValue") ? parameters.get("ruleValue").toString() : "false";
        if (!ruleValue.equals("false")) {
            if (propertyValue == null || "".equals(propertyValue.toString().trim())) {
                throw new RuleException(parameters.get("name") + "不能为空");
            }
        }
    }
}
