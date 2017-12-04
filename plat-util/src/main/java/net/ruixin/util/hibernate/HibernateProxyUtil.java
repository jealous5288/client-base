package net.ruixin.util.hibernate;

import net.ruixin.util.tools.ReflectionUtils;
import org.hibernate.proxy.HibernateProxy;
import org.hibernate.proxy.LazyInitializer;
import org.hibernate.proxy.pojo.javassist.JavassistLazyInitializer;

/**
 * 获取lazy加载的对象
 * Created by Administrator on 2017/5/18 0018.
 */
public class HibernateProxyUtil {
    public static Object getTarget(Object proxy) {
        if (proxy instanceof HibernateProxy) {
            LazyInitializer li = ((HibernateProxy) proxy).getHibernateLazyInitializer();
            if (li instanceof JavassistLazyInitializer)
                return ReflectionUtils.invokeMethod(li, "getTarget", null, null);
        }
        return proxy;
    }
}
