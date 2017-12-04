package net.ruixin.service.plat.log.factory;

import org.springframework.beans.BeanUtils;

public class ObjectFactory {
    public static <T> T create(T o) {
        try {
            if(o == null){
                return null;
            }else {
                T t= (T) o.getClass().newInstance();
                BeanUtils.copyProperties(o,t);
                return t;
            }
        } catch (Exception e) {
            throw new RuntimeException("对象克隆失败",e);
        }
    }
}
