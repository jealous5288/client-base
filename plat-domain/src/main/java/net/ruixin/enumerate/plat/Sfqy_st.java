package net.ruixin.enumerate.plat;

/**
 * Created with IntelliJ IDEA.
 * User: Administrator
 * Date: 16-2-29
 * Time: 上午8:06
 * To change this template use File | Settings | File Templates.
 */
public enum Sfqy_st {
    UNVALID("禁用", 0), VALID("启用", 1);

    public final String name;

    public final int id;

    Sfqy_st(String name, int id) {
        this.name = name;
        this.id = id;
    }

    public static String getName(int id) {
        for (Sfqy_st c : Sfqy_st.values()) {
            if (c.id == id) {
                return c.name;
            }
        }
        return null;
    }

    public static Sfqy_st get(int id) {
        for (Sfqy_st c : Sfqy_st.values()) {
            if (c.id == id) {
                return c;
            }
        }
        return null;
    }
}
