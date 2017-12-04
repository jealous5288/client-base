package net.ruixin.domain.rule;

import java.lang.annotation.*;

/**
 * Created by Jealous on 2017-3-8.
 * 逻辑删除，忽略级联
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
public @interface DelIgnore {
}
