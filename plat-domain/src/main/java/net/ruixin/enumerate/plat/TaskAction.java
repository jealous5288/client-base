package net.ruixin.enumerate.plat;

/**
 * 任务操作
 * Created by Jealous on 2016-8-9.
 */
public enum TaskAction {
    NULL("", 0), NONE("无动作", 1), SIGNFOR("签收", 2), TRANSACT("提交", 3), RETURN("退回", 4), WITHDRAW("撤回", 5), TRUN("转办", 6);

    public final String name;

    public final int id;

    TaskAction(String name, int id) {
        this.name = name;
        this.id = id;
    }

    public static String getName(int id) {
        for (TaskAction c : TaskAction.values()) {
            if (c.id == id) {
                return c.name;
            }
        }
        return null;
    }

    public static TaskAction get(int id) {
        for (TaskAction c : TaskAction.values()) {
            if (c.id == id) {
                return c;
            }
        }
        return null;
    }
}
