package net.ruixin.enumerate.plat;

/**
 * Created with IntelliJ IDEA.
 * User: Administrator
 * Date: 13-2-6
 * Time: 上午11:34
 * To change this template use File | Settings | File Templates.
 */
public enum SheetControlStatus {
    READONLY("只读", 0), EDIT("编辑", 1), HIDDEN("隐藏", 2);

    public final String name;

    public final int id;

    SheetControlStatus(String name, int id) {
        this.name = name;
        this.id = id;
    }

    public static String getName(int id) {
        for (SheetControlStatus c : SheetControlStatus.values()) {
            if (c.id == id) {
                return c.name;
            }
        }
        return null;
    }

    public static SheetControlStatus get(int id) {
        for (SheetControlStatus c : SheetControlStatus.values()) {
            if (c.id == id) {
                return c;
            }
        }
        return null;
    }
}
