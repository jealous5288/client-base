package net.ruixin.enumerate.plat;

/**
 * 决策方式
 * Created by Jealous on 2015/10/15.
 */
public enum DecisionType {
    MANUAL("手动", 0), AUTOMATIC("自动", 1);

    public final String name;

    public final int id;

    DecisionType(String name, int id) {
        this.name = name;
        this.id = id;
    }

    public static String getName(int id) {
        for (DecisionType c : DecisionType.values()) {
            if (c.id == id) {
                return c.name;
            }
        }
        return null;
    }

    public static DecisionType get(int id) {
        for (DecisionType c : DecisionType.values()) {
            if (c.id == id) {
                return c;
            }
        }
        return null;
    }
}
