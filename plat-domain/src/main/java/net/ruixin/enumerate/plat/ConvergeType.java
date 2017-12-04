package net.ruixin.enumerate.plat;

/**
 * 聚合方式
 * Created by Jealous on 2015/10/15.
 */
public enum ConvergeType {
    SYNC_CONVERGE("同步聚合", 0), ASYNC_CONVERGE("异步聚合", 1), NO_CONVERGE("无聚合", 2);

    public final String name;

    public final int id;

    ConvergeType(String name, int id) {
        this.name = name;
        this.id = id;
    }

    public static String getName(int id) {
        for (ConvergeType c : ConvergeType.values()) {
            if (c.id == id) {
                return c.name;
            }
        }
        return null;
    }

    public static ConvergeType get(int id) {
        for (ConvergeType c : ConvergeType.values()) {
            if (c.id == id) {
                return c;
            }
        }
        return null;
    }
}
