package net.ruixin.util.tools;

import com.fasterxml.jackson.databind.JsonNode;
import net.ruixin.domain.plat.BaseDomain;
import org.hibernate.Session;
import org.hibernate.proxy.pojo.javassist.JavassistLazyInitializer;
import org.springframework.beans.BeansException;
import org.springframework.beans.FatalBeanException;

import java.beans.PropertyDescriptor;
import java.io.Serializable;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * bean工具类
 */
public abstract class RxBeanUtils extends org.springframework.beans.BeanUtils {

    /**
     * 复制属性，忽略空值
     *
     * @param source  源对象
     * @param target  目标对象
     * @param session hibernate session
     * @throws BeansException BeanCopy异常
     */
    @SuppressWarnings("unchecked")
    public static void copyPropertiesIgnoreNull(Object source, Object target, Session session) throws BeansException {
        if (target != null && session != null) {
            Class<?> actualEditable = source.getClass();
            PropertyDescriptor[] sourcePds = getPropertyDescriptors(actualEditable);
            if (source instanceof JavassistLazyInitializer)
                source = ReflectionUtils.invokeMethod(source, "getTarget", null, null);
            if (target instanceof JavassistLazyInitializer)
                target = ReflectionUtils.invokeMethod(target, "getTarget", null, null);
            JsonNode interactionFields = ((BaseDomain) source).getInteractionFields();
            try {
                //循环属性的wrapper
                for (PropertyDescriptor sourcePd : sourcePds) {
                    //没有读属性的方法即无法操作
                    if (sourcePd.getWriteMethod() != null && !sourcePd.getName().equals("id") && !sourcePd.getName().equals("interactionFields")) {
                        //判断是否为基础类型如：String、Date、基础类型封装类、枚举
                        if (ObjectUtils.isBaseClass(sourcePd.getPropertyType())) {
                            if (sourcePd.getReadMethod() != null) {
                                Method readMethod = sourcePd.getReadMethod();
                                if (!Modifier.isPublic(readMethod.getDeclaringClass().getModifiers())) {
                                    readMethod.setAccessible(true);
                                }
                                Object value = readMethod.invoke(source);
                                // 这里判断以下value是否为空 当然这里也能进行一些特殊要求的处理 例如绑定时格式转换等等
                                if (value != null) {
                                    PropertyDescriptor targetPd = getPropertyDescriptor(target.getClass(), sourcePd.getName());
                                    Method writeMethod = targetPd.getWriteMethod();
                                    if (!Modifier.isPublic(writeMethod.getDeclaringClass().getModifiers())) {
                                        writeMethod.setAccessible(true);
                                    }
                                    writeMethod.invoke(target, value);
                                } else {
                                    if (interactionFields != null && interactionFields.has(sourcePd.getName())) {
                                        PropertyDescriptor targetPd = getPropertyDescriptor(target.getClass(), sourcePd.getName());
                                        Method writeMethod = targetPd.getWriteMethod();
                                        if (!Modifier.isPublic(writeMethod.getDeclaringClass().getModifiers())) {
                                            writeMethod.setAccessible(true);
                                        }
                                        writeMethod.invoke(target, (Object) null);
                                    }
                                }
                            }
                        } else if (Collection.class.isAssignableFrom(sourcePd.getPropertyType())) {
                            //判断是否为集合类对象，若是，则执行递归逻辑
                            Object sourcePdValue = getValue(sourcePd.getName(), source);
                            Object targetPdValue = getValue(sourcePd.getName(), target);
                            if (sourcePdValue != null && ((Collection) sourcePdValue).size() > 0) {
//                                for (Object o : ((Collection) sourcePdValue)) {
                                for (int i = 0; i < ((Collection) sourcePdValue).size(); i++) {
                                    Object o = null;
                                    if (sourcePdValue instanceof List) {
                                        o = ((List) sourcePdValue).get(i);
                                    }
                                    Object id = ObjectUtils.ifIdExist(o);
                                    if (id != null) {
                                        Object persistent = session.get(o.getClass(), (Serializable) id);
                                        if (o instanceof JavassistLazyInitializer)
                                            o = ReflectionUtils.invokeMethod(o, "getTarget", null, null);
                                        ((BaseDomain) o).setInteractionFields(interactionFields.get(sourcePd.getName()).get(i));
                                        copyPropertiesIgnoreNull(o, persistent, session);
                                    } else {
                                        //新增对象，给系统属性符初值
                                        if (targetPdValue != null) {
                                            ((Collection) targetPdValue).add(o);
                                        } else {
                                            //默认集合对象的实现容器都是ArrayList
                                            Collection c = new ArrayList();
                                            c.add(o);
                                            setValue(sourcePd.getName(), target, c);
                                        }
                                    }
                                }
                            }
                        } else {
                            //其他情况直接递归调用(对象不为空)
                            Object sourcePdValue = getValue(sourcePd.getName(), source);
                            Object targetPdValue = getValue(sourcePd.getName(), target);
                            if (sourcePdValue != null) {
                                if (sourcePdValue instanceof JavassistLazyInitializer)
                                    sourcePdValue = ReflectionUtils.invokeMethod(sourcePdValue, "getTarget", null, null);
                                if (targetPdValue != null) {
                                    ((BaseDomain) sourcePdValue).setInteractionFields(interactionFields.get(sourcePd.getName()));
                                    copyPropertiesIgnoreNull(sourcePdValue, getValue(sourcePd.getName(), target), session);
                                } else {
                                    setValue(sourcePd.getName(), target, sourcePdValue);
                                }
                            }
                        }
                    }
                }
            } catch (Throwable ex) {
                throw new FatalBeanException("Could not copy properties from source to target", ex);
            }
        }
    }

    private static Object getValue(String propertyName, Object o) throws InvocationTargetException, IllegalAccessException {
        PropertyDescriptor sourcePd = getPropertyDescriptor(o.getClass(), propertyName);
        if (sourcePd != null && sourcePd.getReadMethod() != null) {
            Method readMethod = sourcePd.getReadMethod();
            if (!Modifier.isPublic(readMethod.getDeclaringClass().getModifiers())) {
                readMethod.setAccessible(true);
            }
            return readMethod.invoke(o);
        } else {
            return null;
        }
    }

    private static void setValue(String propertyName, Object o, Object value) throws InvocationTargetException, IllegalAccessException {
        PropertyDescriptor sourcePd = getPropertyDescriptor(o.getClass(), propertyName);
        if (sourcePd != null && sourcePd.getWriteMethod() != null) {
            Method writeMethod = sourcePd.getWriteMethod();
            if (!Modifier.isPublic(writeMethod.getDeclaringClass().getModifiers())) {
                writeMethod.setAccessible(true);
            }
            writeMethod.invoke(o, value);
        }
    }
}


