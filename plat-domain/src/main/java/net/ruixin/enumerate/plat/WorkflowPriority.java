package net.ruixin.enumerate.plat;

/**
 * 优先级别
 * Created by Jealous on 2015/10/15.
 */
public enum WorkflowPriority {
    high("高", 0), medium("中", 1), low("低", 2);

    public final String name;

    public final int id;

    WorkflowPriority(String name, int id) {
        this.name = name;
        this.id = id;
    }

    public static String getName(int id) {
        for (WorkflowPriority c : WorkflowPriority.values()) {
            if (c.id == id) {
                return c.name;
            }
        }
        return null;
    }

    public static WorkflowPriority get(int id) {
        for (WorkflowPriority c : WorkflowPriority.values()) {
            if (c.id == id) {
                return c;
            }
        }
        return null;
    }
}
