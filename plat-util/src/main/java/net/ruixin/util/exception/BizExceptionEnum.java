package net.ruixin.util.exception;

public enum BizExceptionEnum {
    /**
     * 权限和数据问题
     */
    DB_RESOURCE_NULL(400, "数据库中没有该资源"),
    NO_PERMITION(405, "权限异常"),
    REQUEST_INVALIDATE(400, "请求数据格式不正确"),
    INVALID_KAPTCHA(400, "验证码不正确"),
    CANT_DELETE_ADMIN(600, "不能删除超级管理员"),
    CANT_FREEZE_ADMIN(600, "不能冻结超级管理员"),
    CANT_CHANGE_ADMIN(600, "不能修改超级管理员角色"),

    /**
     * 字典
     */
    DICT_EXISTED(400, "字典已经存在"),
    ERROR_CREATE_DICT(500, "创建字典失败"),
    ERROR_WRAPPER_FIELD(500, "包装字典属性失败"),

    /**
     * 其他
     */
    WRITE_ERROR(500, "渲染界面错误"),

    /**
     * 文件上传下载
     */
    File_CODING_ERROR(400,"编码错误"),
    FILE_READING_ERROR(400, "文件读取错误"),
    FILE_NOT_FOUND(400, "文件未找到错误"),

    /**
     * 错误的请求
     */
    REQUEST_NULL(400, "请求有错误"),
    SERVER_ERROR(500, "服务器异常");

    private int friendlyCode;

    private String friendlyMsg;

    private String urlPath;

    BizExceptionEnum(int friendlyCode, String friendlyMsg) {
        this.friendlyCode = friendlyCode;
        this.friendlyMsg = friendlyMsg;
    }

    BizExceptionEnum(int friendlyCode, String friendlyMsg, String urlPath) {
        this.friendlyCode = friendlyCode;
        this.friendlyMsg = friendlyMsg;
        this.urlPath = urlPath;
    }

    public int getFriendlyCode() {
        return friendlyCode;
    }

    public String getFriendlyMsg() {
        return friendlyMsg;
    }

    public String getUrlPath() {
        return urlPath;
    }
}
