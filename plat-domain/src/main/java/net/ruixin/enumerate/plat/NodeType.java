package net.ruixin.enumerate.plat;

/**
 * Created by Jealous on 2015/10/15.
 * 节点类型
 */
public enum NodeType {
    START_NODE("开始环节", 0),
    END_NODE("结束环节", 1),
    ACTIVITY_NODE("活动环节", 2),
    CIRCULATION_NODE("传阅环节", 3),
    DECISION_NODE("决策环节", 4),
    NESTED_NODE("嵌套环节", 5),
    COMPOSITE_NODE("复合环节", 6);

    public final String name;

    public final int id;

    NodeType(String name, int id) {
        this.name = name;
        this.id = id;
    }

    public static String getName(int id) {
        for (NodeType c : NodeType.values()) {
            if (c.id == id) {
                return c.name;
            }
        }
        return null;
    }

    public static NodeType get(int id) {
        for (NodeType c : NodeType.values()) {
            if (c.id == id) {
                return c;
            }
        }
        return null;
    }
}
