package net.ruixin.enumerate.plat;

/**
 * 活动类型
 * Created by Jealous on 2015/10/15.
 */
public enum TransactType {
    PREEMPTION("抢占", 0), COUNTERSIGN("会签", 1);

    public final String name;

    public final int id;

    TransactType(String name, int id) {
        this.name = name;
        this.id = id;
    }

    public static String getName(int id) {
        for (TransactType c : TransactType.values()) {
            if (c.id == id) {
                return c.name;
            }
        }
        return null;
    }

    public static TransactType get(int id) {
        for (TransactType c : TransactType.values()) {
            if (c.id == id) {
                return c;
            }
        }
        return null;
    }
}
