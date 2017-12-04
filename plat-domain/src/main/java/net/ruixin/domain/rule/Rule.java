package net.ruixin.domain.rule;

import java.lang.annotation.*;

/**
 * 限制规则注解
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
public @interface Rule {

    String name() default "";

    String validateClass();

    String ruleValue() default "true";
}
