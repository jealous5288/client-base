package net.ruixin.domain.plat.message;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

@SuppressWarnings("unused")
@Table(name = "SYS_MESSAGE_TYPE")
@Entity
@DynamicInsert
@DynamicUpdate
public class MessageType extends BaseDomain {

    @Id
    @SequenceGenerator(name = "seq_sys_message_type", sequenceName = "SEQ_SYS_MESSAGE_TYPE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_message_type")
    private Long id;

    //名称
    @Column(name = "NAME")
    private String name;
    //编码
    @Column(name = "CODE")
    private String code;
    //紧急程度
    @Column(name = "URGENT_LEVEL")
    private String urgentLevel;
    //有效时间
    @Column(name = "VALID_TIME")
    private Integer validTime;
    //操作类型
    @Column(name = "OPERATE_TYPE")
    private String operateType;
    //跳转类型
    @Column(name = "SKIP_TYPE")
    private String skipType;
    //备注
    @Column(name = "DESCRIPTION")
    private String description;

    //窗口尺寸
    @Column(name="WIN_SIZE")
    private String winSize;
    //跳转路径
    @Column(name="SKIP_PATH")
    private String skipPath;

    //是否有效
    @Enumerated
    private Sfyx_st sfyx_st;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getUrgentLevel() {
        return urgentLevel;
    }

    public void setUrgentLevel(String urgentLevel) {
        this.urgentLevel = urgentLevel;
    }

    public Integer getValidTime() {
        return validTime;
    }

    public void setValidTime(Integer validTime) {
        this.validTime = validTime;
    }

    public String getOperateType() {
        return operateType;
    }

    public void setOperateType(String operateType) {
        this.operateType = operateType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getWinSize() {
        return winSize;
    }

    public void setWinSize(String winSize) {
        this.winSize = winSize;
    }

    public String getSkipPath() {
        return skipPath;
    }

    public void setSkipPath(String skipPath) {
        this.skipPath = skipPath;
    }

    public Sfyx_st getSfyx_st() {
        return sfyx_st;
    }

    public void setSfyx_st(Sfyx_st sfyx_st) {
        this.sfyx_st = sfyx_st;
    }

    public String getSkipType() {
        return skipType;
    }

    public void setSkipType(String skipType) {
        this.skipType = skipType;
    }
}
