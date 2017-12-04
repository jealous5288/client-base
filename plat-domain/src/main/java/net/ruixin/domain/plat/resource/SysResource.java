package net.ruixin.domain.plat.resource;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.rule.Restrict;
import net.ruixin.domain.rule.Rule;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Zp on 2017/10/17.
 * 资源实体
 */
@SuppressWarnings("unused")
@Table(name = "SYS_RESOURCE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysResource extends BaseDomain {
    @Id
    @SequenceGenerator(name = "seq_sys_resource", sequenceName = "SEQ_SYS_RESOURCE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_resource")
    private Long id;

    //资源名称
    @Restrict(rules = {@Rule(validateClass = "CheckUnique", name = "资源名称")})
    @Column(name = "NAME")
    private String name;

    //资源编码
    @Restrict(rules = {@Rule(validateClass = "CheckUnique", name = "资源编码")})
    @Column(name = "CODE")
    private String code;

    //资源类型，已有：app应用，menu菜单，page页面，func功能
    @Column(name = "TYPE")
    private String type;

    //上级资源id
    @Column(name = "PARENT_ID")
    private Long parentId;

    //上级资源名称
    @Formula("(SELECT RES.NAME FROM SYS_RESOURCE RES WHERE RES.ID = PARENT_ID AND RES.SFYX_ST='1')")
    private String parentName;

    //上级资源类型
    @Column(name = "PARENT_TYPE")
    private String parentType;

    //排序
    @Column(name = "SORT")
    private Integer sort;

    //个性字段：URL
    @Column(name = "URL")
    private String url;

    //个性字段：图标
    @Column(name = "ICON")
    private String icon;

    //个性字段：业务类型
    @Column(name = "BIZ_TYPE")
    private String bizType;

    //描述
    @Column(name = "DESCRIPTION")
    private String description;

    //创建人
    @Column(name = "CJR_ID")
    private Long cjr_id;

    //创建时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CJSJ")
    private Date cjsj;

    //修改人
    @Column(name = "XGR_ID")
    private Long xgr_id;

    //修改时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "XGSJ")
    private Date xgsj;

    //有效状态
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public String getParentType() {
        return parentType;
    }

    public void setParentType(String parentType) {
        this.parentType = parentType;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getBizType() {
        return bizType;
    }

    public void setBizType(String bizType) {
        this.bizType = bizType;
    }

    public Long getCjr_id() {
        return cjr_id;
    }

    public void setCjr_id(Long cjr_id) {
        this.cjr_id = cjr_id;
    }

    public Date getCjsj() {
        return cjsj;
    }

    public void setCjsj(Date cjsj) {
        this.cjsj = cjsj;
    }

    public Long getXgr_id() {
        return xgr_id;
    }

    public void setXgr_id(Long xgr_id) {
        this.xgr_id = xgr_id;
    }

    public Date getXgsj() {
        return xgsj;
    }

    public void setXgsj(Date xgsj) {
        this.xgsj = xgsj;
    }

    public Sfyx_st getSfyx_st() {
        return sfyx_st;
    }

    public void setSfyx_st(Sfyx_st sfyx_st) {
        this.sfyx_st = sfyx_st;
    }
}
