package net.ruixin.domain.plat.auth;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.rule.Restrict;
import net.ruixin.domain.rule.Rule;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * Created by admin on 2016-8-24.
 * 角色实体
 */
@SuppressWarnings("unused")
@Table(name = "SYS_ROLE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysRole extends BaseDomain {

    //ID
    @Id
    @SequenceGenerator(name = "seq_sys_role", sequenceName = "SEQ_SYS_ROLE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_role")
    private Long id;

    //角色代码
    @Restrict(rules = {@Rule(validateClass = "CheckUnique", name = "角色编码")})
    @Column(name = "ROLE_CODE")
    private String roleCode;

    //角色名称
    @Restrict(rules = {@Rule(validateClass = "CheckUnique", name = "角色名称")})
    @Column(name = "ROLE_NAME")
    private String roleName;

    //角色类型   字典项 1:系统角色 2:业务角色 3:动态角色
    @Column(name = "ROLE_TYPE")
    private String roleType;

    //备注
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

    //权限类型
    @Column(name = "AUTH_TYPE")
    private String authType;

    @Enumerated
    private Sfyx_st sfyx_st;

    @OneToMany(cascade = {CascadeType.ALL})
    @JoinColumn(name = "ROLE_ID", referencedColumnName = "ID")
    @Where(clause = " SFYX_ST='1' ")
    private List<SysGlbRole> sysGlbRoleList;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "ROLE_ID", referencedColumnName = "ID")
    @Where(clause = " SFYX_ST='1' ")
    private List<SysGlbRoleAuthRule> sysGlbRoleAuthRuleList;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "ROLE_ID", referencedColumnName = "ID")
    @Where(clause = " SFYX_ST='1' ")
    private List<SysGlbRolePageAuthRole> sysGlbRolePageAuthRoleList;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoleCode() {
        return roleCode;
    }

    public void setRoleCode(String roleCode) {
        this.roleCode = roleCode;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleType() {
        return roleType;
    }

    public void setRoleType(String roleType) {
        this.roleType = roleType;
    }

    public String getAuthType() {
        return authType;
    }

    public void setAuthType(String authType) {
        this.authType = authType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public List<SysGlbRole> getSysGlbRoleList() {
        return sysGlbRoleList;
    }

    public void setSysGlbRoleList(List<SysGlbRole> sysGlbRoleList) {
        this.sysGlbRoleList = sysGlbRoleList;
    }

    public List<SysGlbRoleAuthRule> getSysGlbRoleAuthRuleList() {
        return sysGlbRoleAuthRuleList;
    }

    public void setSysGlbRoleAuthRuleList(List<SysGlbRoleAuthRule> sysGlbRoleAuthRuleList) {
        this.sysGlbRoleAuthRuleList = sysGlbRoleAuthRuleList;
    }

    public List<SysGlbRolePageAuthRole> getSysGlbRolePageAuthRoleList() {
        return sysGlbRolePageAuthRoleList;
    }

    public void setSysGlbRolePageAuthRoleList(List<SysGlbRolePageAuthRole> sysGlbRolePageAuthRoleList) {
        this.sysGlbRolePageAuthRoleList = sysGlbRolePageAuthRoleList;
    }

}
