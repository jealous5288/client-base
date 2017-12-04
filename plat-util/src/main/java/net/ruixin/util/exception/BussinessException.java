package net.ruixin.util.exception;

public class BussinessException extends RuntimeException {

    //友好提示的code码
    protected int friendlyCode;

    //友好提示
    protected String friendlyMsg;

    //业务异常跳转的页面
    protected String urlPath;

    public BussinessException(int friendlyCode, String friendlyMsg, String urlPath) {
        this.setValues(friendlyCode, friendlyMsg, urlPath);
    }

    public BussinessException(BizExceptionEnum bizExceptionEnum) {
        this.setValues(bizExceptionEnum.getFriendlyCode(),
                bizExceptionEnum.getFriendlyMsg(),
                bizExceptionEnum.getUrlPath());
    }

    private void setValues(int friendlyCode, String friendlyMsg, String urlPath) {
        this.friendlyCode = friendlyCode;
        this.friendlyMsg = friendlyMsg;
        this.urlPath = urlPath;
    }

    public int getFriendlyCode() {
        return friendlyCode;
    }

    public void setFriendlyCode(int friendlyCode) {
        this.friendlyCode = friendlyCode;
    }

    public String getFriendlyMsg() {
        return friendlyMsg;
    }

    public void setFriendlyMsg(String friendlyMsg) {
        this.friendlyMsg = friendlyMsg;
    }

    public String getUrlPath() {
        return urlPath;
    }

    public void setUrlPath(String urlPath) {
        this.urlPath = urlPath;
    }
}
