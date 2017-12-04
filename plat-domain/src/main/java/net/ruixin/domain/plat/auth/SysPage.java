package net.ruixin.domain.plat.auth;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * Created by Jealous on 2016/9/15.
 * 实体：流程页面类
 */
@SuppressWarnings("unused")
@Table(name = "SYS_PAGE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysPage extends BaseDomain {
    //ID
    @Id
    @SequenceGenerator(name = "seq_page", sequenceName = "SEQ_SYS_PAGE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_page")
    private Long id;
    //名称
    @Column(name = "NAME")
    private String name;

    //编码
    @Column(name = "CODE")
    private String code;

    //页面类型
    @Column(name = "PAGE_TYPE")
    private String pageType;

    /* 表单地址 */
    @Column(name = "URL")
    private String url;

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

    //模块id
    @Column(name = "MODULE_ID")
    private Long moduleId;

    //模块名称
    @Formula("(SELECT MODULE.MODULE_NAME FROM SYS_MODULE MODULE WHERE MODULE.ID = MODULE_ID)")
    private String moduleName;

    //与功能权限的多对多
    @OneToMany(targetEntity = SysGlbPageAuthRole.class, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumns(@JoinColumn(name = "PAGE_ID", referencedColumnName = "ID"))
    @Where(clause = " SFYX_ST='1' ")
    private List<SysGlbPageAuthRole> sysGlbPageAuthRoleList;


    //有效标识
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

    public String getPageType() {
        return pageType;
    }

    public void setPageType(String pageType) {
        this.pageType = pageType;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
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

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public List<SysGlbPageAuthRole> getSysGlbPageAuthRoleList() {
        return sysGlbPageAuthRoleList;
    }

    public void setSysGlbPageAuthRoleList(List<SysGlbPageAuthRole> sysGlbPageAuthRoleList) {
        this.sysGlbPageAuthRoleList = sysGlbPageAuthRoleList;
    }
}
