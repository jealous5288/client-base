package net.ruixin.util.rule.matchingRules;

import net.ruixin.util.exception.RuleException;
import net.ruixin.util.rule.SelfValidate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 邮件地址验证
 */
@Service
public class CheckEmail implements SelfValidate {

    /**
     * 邮件地址验证
     *
     * @param propertyName 属性名
     * @param propertyValue 属性值
     * @param parameters 参数
     * @param entity 实体
     */
    @Override
    public void validate(String propertyName, Object propertyValue, Map<String, Object> parameters, Object entity) throws RuleException {
        if (propertyValue == null || propertyValue.toString().trim().equals("")) {
            return;    //这里不处理为空值的情况，为空直接返回
        }
        Pattern pattern = Pattern.compile("^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$");
        Matcher matcher = pattern.matcher(propertyValue.toString());
        if (!matcher.matches()) {
            throw new RuleException(parameters.get("name") + "值：" + propertyValue + "不符合电子邮箱表达式规范");
        }
    }
}
