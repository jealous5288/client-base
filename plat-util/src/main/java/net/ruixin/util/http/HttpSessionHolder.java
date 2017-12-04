package net.ruixin.util.http;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;

/**
 * 非Controller中获取当前session的工具类
 */
public class HttpSessionHolder {

    private static ThreadLocal<HttpSession> tl = new ThreadLocal<HttpSession>();

    public static void put(HttpSession s) {
        tl.set(s);
    }

    public static HttpSession get() {
        return tl.get();
    }
    public static void remove() {
        tl.remove();
    }

    public static ServletContext getServletContext(){
        return get().getServletContext();
    }

    public static String getContextPath(){
        return getServletContext().getRealPath("/");
    }
}
