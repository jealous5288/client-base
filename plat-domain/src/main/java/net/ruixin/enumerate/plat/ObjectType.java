package net.ruixin.enumerate.plat;

/**
 * Created by Jealous on 2015/10/13.
 * 对象类型枚举
 */
public enum ObjectType {
    Base("基础对象", 0), Biz("业务对象", 1), Interface("接口对象", 2), Implement("实现对象", 3), Enum("枚举对象", 4), Other("其他", 5);

    public final String name;

    public final int id;

    ObjectType(String name, int id) {
        this.name = name;
        this.id = id;
    }

    public static String getName(int id) {
        for (ObjectType c : ObjectType.values()) {
            if (c.id == id) {
                return c.name;
            }
        }
        return null;
    }

    public static ObjectType get(int id) {
        for (ObjectType c : ObjectType.values()) {
            if (c.id == id) {
                return c;
            }
        }
        return null;
    }
}
