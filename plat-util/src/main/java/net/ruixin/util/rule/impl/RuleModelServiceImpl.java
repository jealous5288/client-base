package net.ruixin.util.rule.impl;

import net.ruixin.domain.rule.Restrict;
import net.ruixin.domain.rule.Rule;
import net.ruixin.util.exception.RuleException;
import net.ruixin.util.rule.SelfValidate;
import net.ruixin.util.tools.RxStringUtils;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.*;

/**
 * 验证方法接口类实现
 */
@Service
@Aspect
@Transactional
public class RuleModelServiceImpl implements ApplicationContextAware {
    private ApplicationContext applicationContext;

    @Pointcut(value = "execution(* net.ruixin.util.hibernate.BaseDao+.save*(..)) && args(entity)", argNames = "entity")
    public void aspect(Object entity) {
    }

    @Before(value = "aspect(entity)", argNames = "entity")
    public void executeValidate(Object entity) throws Exception {
        Class clazz = entity.getClass();  //实体类型
        List<Field> fieldList = new ArrayList<>(); //保存反射属性对象
        Annotation[] annotations;
        //对实体进行反射操作，获取属性对象
        while (!clazz.getName().equals("java.lang.Object")) {
            Field[] superFields = clazz.getDeclaredFields();
            fieldList.addAll(Arrays.asList(superFields));
            clazz = clazz.getSuperclass();
        }

        //循环实体全部的属性，获取属性注解
        for (Field aFieldList : fieldList) {
            String propertyName = aFieldList.getName();    //属性名
            Object propertyValue;                         //属性值
            annotations = aFieldList.getAnnotations();    //属性注解

            //循环属性注解获取规则注解部分
            for (Annotation annotation : annotations) {
                if (annotation instanceof Restrict) {
                    propertyValue = getFieldValueByName(propertyName, entity);
                    Restrict rules = (Restrict) annotation;
                    //通过规则注解部分获取多条验证规则
                    Rule[] ruleList = rules.rules();
                    //对验证规则做拆分，拆分成组合规则和单属性规则，同时按单属性规则有限级排序
                    List<Rule> simRule = new ArrayList<>();
                    Collections.addAll(simRule, ruleList);
                    //对单属性规则提取验证类
                    for (Rule rule : simRule) {
                        SelfValidate validate;
                        try {
                            validate = (SelfValidate) applicationContext.getBean(RxStringUtils.toLowerCaseFirstOne(rule.validateClass()));
                        } catch (Exception e) {
                            throw new RuleException("实例化验证类：" + rule.validateClass() + "时发生异常:" + e.getMessage());
                        }
                        Map<String, Object> params = getAllRuleProperties(rule);
                        validate.validate(propertyName, propertyValue, params, entity);
                    }
                }
            }
        }
    }

    private static Object getFieldValueByName(String fieldName, Object o) throws RuleException {
        try {
            StringBuilder sb = new StringBuilder(fieldName);
            sb.setCharAt(0, Character.toUpperCase(sb.charAt(0)));
            String getter = String.valueOf(new StringBuilder("get").append(sb.toString()));
            Method method = o.getClass().getMethod(getter);
            return method.invoke(o);
        } catch (Throwable e) {
            throw new RuleException("属性" + fieldName + "值获取异常");
        }
    }

    private static Map<String, Object> getAllRuleProperties(Rule rule) {
        Map<String, Object> map = new HashMap<>();
        map.put("name", rule.name());
        map.put("ruleValue", rule.ruleValue());
        return map;
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }
}
