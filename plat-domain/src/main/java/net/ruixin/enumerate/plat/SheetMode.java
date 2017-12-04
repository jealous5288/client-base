package net.ruixin.enumerate.plat;

/**
 * 页面状态
 * Created by Jealous on 2015/10/15.
 */
public enum SheetMode {
    EDIT("办理", 0), EXAMINE("审批", 1), VIEW("查看", 2),SEAL("签章", 3);

    public final String name;

    public final int id;

    SheetMode(String name, int id) {
        this.name = name;
        this.id = id;
    }

    public static String getName(int id) {
        for (SheetMode c : SheetMode.values()) {
            if (c.id == id) {
                return c.name;
            }
        }
        return null;
    }

    public String getName() {
        for (SheetMode c : SheetMode.values()) {
            if (c.id == this.id) {
                return c.name;
            }
        }
        return null;
    }

    public static SheetMode get(int id) {
        for (SheetMode c : SheetMode.values()) {
            if (c.id == id) {
                return c;
            }
        }
        return null;
    }
}
