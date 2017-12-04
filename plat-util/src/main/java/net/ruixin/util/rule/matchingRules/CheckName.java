package net.ruixin.util.rule.matchingRules;

import net.ruixin.util.exception.RuleException;
import net.ruixin.util.rule.SelfValidate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created with IntelliJ IDEA.
 * User: Administrator
 * Date: 15-10-28
 * Time: 下午1:26
 * 验证名字字段
 */
@Service
public class CheckName implements SelfValidate {

    /**
     * 验证名字字段
     */
    @Override
    public void validate(String propertyName, Object propertyValue, Map<String, Object> parameters, Object entity) throws RuleException {
        String ruleValue = parameters.containsKey("ruleValue") ? parameters.get("ruleValue").toString() : "false";
        if (!ruleValue.equals("false")) {
            if (propertyValue != null && !"".equals(propertyValue.toString().trim())) {
                Pattern pattern = Pattern.compile("^[a-zA-Z_]{1}[a-zA-Z0-9_]*");
                Matcher matcher = pattern.matcher(propertyValue.toString().toUpperCase().trim());
                if (!matcher.matches()) {
                    throw new RuleException(parameters.get("name") + "值:" + propertyValue + "不符合命名规范");
                }
            }
        }
    }
}
