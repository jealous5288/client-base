package net.ruixin.domain.plat.organ;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.plat.auth.SysGlbRole;
import net.ruixin.domain.rule.Restrict;
import net.ruixin.domain.rule.Rule;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * 组织机构实体
 */
@SuppressWarnings("unused")
@Table(name = "SYS_ORGAN")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysOrgan extends BaseDomain {

    @Id
    @SequenceGenerator(name = "seq_sysorgan", sequenceName = "SEQ_SYS_ORGAN", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sysorgan")
    private Long id;
    //组织编码
    @Restrict(rules = {@Rule(validateClass = "CheckUnique", name = "机构编码")})
    @Column(name = "ORGAN_CODE")
    private String organCode;
    //组织简称
    @Column(name = "ORGAN_NAME")
    private String organName;
    //组织全称
    @Restrict(rules = {@Rule(validateClass = "CheckUnique", name = "机构全称")})
    @Column(name = "FULL_NAME")
    private String fullName;
    //上级组织
    @Column(name = "PARENT_ORG")
    private Long parentOrg;

    //上级组织名称
    @Formula("(SELECT ORGAN.ORGAN_NAME FROM SYS_ORGAN ORGAN WHERE ORGAN.ID=PARENT_ORG AND ORGAN.SFYX_ST='1')")
    private String parentName;

    //显示顺序
    @Column(name = "SORT_NUM")
    private Integer sortNum;
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
    //有效标识:0无效，1有效
    @Enumerated
    private Sfyx_st sfyx_st;

    //与角色的一对多关系
    @OneToMany(targetEntity = SysGlbRole.class, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumns(@JoinColumn(name = "GL_ID", referencedColumnName = "ID"))
    @Where(clause = " SFYX_ST='1' AND GL_TYPE='2' ")
    private List<SysGlbRole> sysGlbRoleList;

    //角色是否可恢复  1：是  0：否
    @Column(name = "SFKHF")
    private String sfkhf;

//    //主管领导id
//    @Column(name = "ZG_LEADER")
//    private Long zgLeader;
//
//    //主管领导名称
//    @Formula("(SELECT SUSER.USER_NAME FROM SYS_USER SUSER WHERE SUSER.ID = ZG_LEADER)")
//    private String zgLeaderMc;

    //分管领导id
    @Column(name = "FG_LEADER")
    private Long fgLeader;

    //分管领导名称
    @Formula("(SELECT SUSER.USER_NAME FROM SYS_USER SUSER WHERE SUSER.ID = FG_LEADER)")
    private String fgLeaderMc;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrganCode() {
        return organCode;
    }

    public void setOrganCode(String organCode) {
        this.organCode = organCode;
    }

    public String getOrganName() {
        return organName;
    }

    public void setOrganName(String organName) {
        this.organName = organName;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Long getParentOrg() {
        return parentOrg;
    }

    public void setParentOrg(Long parentOrg) {
        this.parentOrg = parentOrg;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public Integer getSortNum() {
        return sortNum;
    }

    public void setSortNum(Integer sortNum) {
        this.sortNum = sortNum;
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

    public String getSfkhf() {
        return sfkhf;
    }

    public void setSfkhf(String sfkhf) {
        this.sfkhf = sfkhf;
    }

//    public Long getZgLeader() {
//        return zgLeader;
//    }
//
//    public void setZgLeader(Long zgLeader) {
//        this.zgLeader = zgLeader;
//    }
//
//    public String getZgLeaderMc() {
//        return zgLeaderMc;
//    }
//
//    public void setZgLeaderMc(String zgLeaderMc) {
//        this.zgLeaderMc = zgLeaderMc;
//    }

    public Long getFgLeader() {
        return fgLeader;
    }

    public void setFgLeader(Long fgLeader) {
        this.fgLeader = fgLeader;
    }

    public String getFgLeaderMc() {
        return fgLeaderMc;
    }

    public void setFgLeaderMc(String fgLeaderMc) {
        this.fgLeaderMc = fgLeaderMc;
    }
}
