package net.ruixin.enumerate.plat;

/**
 * 会签方式
 * Created by Jealous on 2015/10/15.
 */
public enum CountersignParameter {
    ALL("全部", 0), PROPORTION("比例", 1), FIXED("固定", 2);

    public final String name;

    public final int id;

    CountersignParameter(String name, int id) {
        this.name = name;
        this.id = id;
    }

    public static String getName(int id) {
        for (CountersignParameter c : CountersignParameter.values()) {
            if (c.id == id) {
                return c.name;
            }
        }
        return null;
    }

    public static CountersignParameter get(int id) {
        for (CountersignParameter c : CountersignParameter.values()) {
            if (c.id == id) {
                return c;
            }
        }
        return null;
    }
}
