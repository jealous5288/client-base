package net.ruixin.enumerate.plat;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: Administrator
 * Date: 16-2-29
 * Time: 上午8:06
 * To change this template use File | Settings | File Templates.
 */
public enum Sfyx_st {
    UNVALID("无效", 0), VALID("有效", 1), XXX("dfsd", 2);

    public final String name;
    public final int id;

    Sfyx_st(String name, int id) {
        this.name = name;
        this.id = id;
    }

    public static String getName(int id) {
        for (Sfyx_st c : Sfyx_st.values()) {
            if (c.id == id) {
                return c.name;
            }
        }
        return null;
    }

    public static Sfyx_st get(int id) {
        for (Sfyx_st c : Sfyx_st.values()) {
            if (c.id == id) {
                return c;
            }
        }
        return null;
    }

    public static Map getMap() {
        Map<Object, Object> enumMap = new LinkedHashMap<>();
        for (Sfyx_st c : Sfyx_st.values()) {
            enumMap.put(c.id, c.name);
        }
        return enumMap;
    }
}
