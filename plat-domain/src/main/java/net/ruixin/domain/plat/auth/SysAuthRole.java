package net.ruixin.domain.plat.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
 * Created with IntelliJ IDEA.
 * 功能权限模块实体
 */
@SuppressWarnings("unused")
@Table(name = "SYS_ACTION_AUTH")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysAuthRole extends BaseDomain {
    /**
     * 主键id
     */
    @Id
    @SequenceGenerator(name = "seq_action_role", sequenceName = "SEQ_SYS_ACTION_AUTH", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_action_role")
    private Long id;
    /**
     * 权限名称
     */
    @Restrict(rules = {@Rule(validateClass = "CheckUnique", name = "权限名称")})
    @Column(name = "NAME")
    private String name;
    /**
     * 权限编码
     */
    @Restrict(rules = {@Rule(validateClass = "CheckUnique", name = "权限编码")})
    @Column(name = "CODE")
    private String code;
    /**
     * 描述
     */
    @Column(name = "DESCRIPTION")
    private String description;
    /**
     * 创建人
     */
    @Column(name = "CJR_ID")
    private Long cjr_id;
    /**
     * 创建时间
     */
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CJSJ")
    private Date cjsj;
    /**
     * 修改人
     */
    @Column(name = "XGR_ID")
    private Long xgr_id;
    /**
     * 修改时间
     */
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "XGSJ")
    private Date xgsj;
    /**
     * 有效状态，0：无效，1：有效
     */
    @Enumerated
    private Sfyx_st sfyx_st;

    //功能权限类型  1：系统权限   2：自定义权限
    @Column(name = "TYPE")
    private String type;

    @OneToMany(targetEntity = SysGlbPageAuthRole.class, fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumns(value = {@JoinColumn(name = "AUTHROLE_ID", referencedColumnName = "ID")})
    @Where(clause = " SFYX_ST='1' ")
    @JsonIgnore
    private List<SysGlbPageAuthRole> sysGlbPageAuthRoleList;

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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<SysGlbPageAuthRole> getSysGlbPageAuthRoleList() {
        return sysGlbPageAuthRoleList;
    }

    public void setSysGlbPageAuthRoleList(List<SysGlbPageAuthRole> sysGlbPageAuthRoleList) {
        this.sysGlbPageAuthRoleList = sysGlbPageAuthRoleList;
    }
}
