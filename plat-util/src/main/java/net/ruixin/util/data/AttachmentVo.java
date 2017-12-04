package net.ruixin.util.data;

import java.io.Serializable;

//附加vo
public class AttachmentVo implements Serializable {
    private static final long serialVersionUID = 1L;

//    别名
    String alias;
//    描述
    String description;
//    uuid
    String uuid;
//    附件类别分类
    String fjlbNo;
//    缩略图是否生成标志
    boolean thumbFlag;
//    是否无效
    boolean ifUnValid;

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getFjlbNo() {
        return fjlbNo;
    }

    public void setFjlbNo(String fjlbNo) {
        this.fjlbNo = fjlbNo;
    }

    public boolean isThumbFlag() {
        return thumbFlag;
    }

    public void setThumbFlag(boolean thumbFlag) {
        this.thumbFlag = thumbFlag;
    }

    public boolean isIfUnValid() {
        return ifUnValid;
    }

    public void setIfUnValid(boolean ifUnValid) {
        this.ifUnValid = ifUnValid;
    }
}
