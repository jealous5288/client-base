package net.ruixin.domain.rule;

import java.lang.annotation.*;

/**
 * 限制规则注解容器
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
public @interface Restrict {
    Rule[] rules();
}
