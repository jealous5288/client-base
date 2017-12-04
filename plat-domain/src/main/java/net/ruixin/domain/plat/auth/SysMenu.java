package net.ruixin.domain.plat.auth;

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
 * Created by Jealous on 2016/10/12.
 * 菜单实体
 */
@SuppressWarnings("unused")
@Table(name = "SYS_MENU")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysMenu extends BaseDomain {
    @Id
    @SequenceGenerator(name = "seq_sysmenu", sequenceName = "SEQ_SYS_MENU", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sysmenu")
    private Long id;

    //菜单名称
    @Restrict(rules = {@Rule(validateClass = "CheckUnique", name = "菜单名称")})
    @Column(name = "NAME")
    private String name;

    //菜单名称
    @Restrict(rules = {@Rule(validateClass = "CheckUnique", name = "菜单编码")})
    @Column(name = "CODE")
    private String code;

    //图标地址
    @Column(name = "ICON")
    private String icon;

    //上级菜单
    @Column(name = "PARENT")
    private Long parent;

    //上级菜单名称
    @Formula("(SELECT MENU.NAME FROM SYS_MENU MENU WHERE MENU.ID = PARENT AND MENU.SFYX_ST='1')")
    private String parentName;

    //关联模块id
    @Column(name = "PAGE_ID")
    private Long pageId;

    //关联模块名称
    @Formula("(SELECT P.NAME FROM SYS_PAGE P WHERE P.ID = PAGE_ID AND P.SFYX_ST='1')")
    private String pageName;

    //显示顺序
    @Column(name = "SORT")
    private Integer sort;

    //系统标识
    @Enumerated
    private Sfyx_st sfyx_st;

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

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Long getParent() {
        return parent;
    }

    public void setParent(Long parent) {
        this.parent = parent;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public Long getPageId() {
        return pageId;
    }

    public void setPageId(Long pageId) {
        this.pageId = pageId;
    }

    public String getPageName() {
        return pageName;
    }

    public void setPageName(String pageName) {
        this.pageName = pageName;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public Sfyx_st getSfyx_st() {
        return sfyx_st;
    }

    public void setSfyx_st(Sfyx_st sfyx_st) {
        this.sfyx_st = sfyx_st;
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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
