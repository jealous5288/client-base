package net.ruixin.util.rule.matchingRules;

import net.ruixin.util.exception.RuleException;
import net.ruixin.util.rule.SelfValidate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 正则验证
 */
@Service
public class RegularMatch implements SelfValidate {

    /**
     * 正则验证方法
     *
     * @param propertyName 属性名
     * @param propertyValue 属性值
     * @param parameters 参数
     * @param entity 实体
     */
    @Override
    public void validate(String propertyName, Object propertyValue, Map<String, Object> parameters, Object entity) throws RuleException {
        String ruleValue = parameters.containsKey("ruleValue") ? parameters.get("ruleValue").toString() : "";
        if (ruleValue == null || ruleValue.equals("")) {
            return;
        }
        Pattern pattern = Pattern.compile(ruleValue);
        Matcher matcher = pattern.matcher(propertyValue.toString());
        if (!matcher.matches()) {
            throw new RuleException(parameters.get("name") + "值：" + propertyValue + "与正则表达式：" + ruleValue + "不匹配");
        }
    }
}
