package net.ruixin.enumerate.plat;

/**
 * 警保流程数据枚举
 */
@Deprecated
public enum JbWfData {
    JE("je","金额"), SFDY("sfdy","是否打印"), SFGD("sfgd","是否归档");

    public final String code;
    public final String name;

    JbWfData(String code, String name) {
        this.code = code;
        this.name = name;
    }
}
