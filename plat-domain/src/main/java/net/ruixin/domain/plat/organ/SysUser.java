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
 * 用户实体
 * Created by Jealous on 2016-8-3.
 */
@SuppressWarnings("unused")
@Table(name = "SYS_USER")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysUser extends BaseDomain {
    @Id
    @SequenceGenerator(name = "seq_sysuser", sequenceName = "SEQ_SYS_USER", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sysuser")
    private Long id;
    //登录名
    @Restrict(rules = {@Rule(validateClass = "CheckUnique", name = "登录账号")})
    @Column(name = "LOGIN_NAME")
    private String loginName;
    //登录密码
    @Column(name = "LOGIN_PWD")
    private String loginPwd;
    //姓名
    @Column(name = "USER_NAME")
    private String userName;
    //默认组织id
    @Column(name = "DEFAULT_ORGAN_ID")
    private Long default_organ_id;
    //默认组织名称
    @Formula("(SELECT ORGAN.ORGAN_NAME FROM SYS_ORGAN ORGAN WHERE ORGAN.ID = DEFAULT_ORGAN_ID AND ORGAN.SFYX_ST='1')")
    private String dftOrganName;
    //默认组织代码
    @Formula("(SELECT ORGAN.ORGAN_CODE FROM SYS_ORGAN ORGAN WHERE ORGAN.ID = DEFAULT_ORGAN_ID AND ORGAN.SFYX_ST='1')")
    private String dftOrganCode;
    //显示顺序
    @Column(name = "SORT")
    private Integer sortNum;
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
    //是否维护个性菜单  0：否  1：是
    @Column(name = "SFWHGXCD")
    private String sfwhgxcd;

    //与机构、岗位关联关系
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumns(@JoinColumn(name = "USER_ID", referencedColumnName = "ID"))
    @Where(clause = " SFYX_ST='1' ")
    @OrderBy(" organId asc ")
    private List<SysGlbOrganUserPost> sysGlbOrganUserPostList;

    //与角色的一对多关系
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumns(@JoinColumn(name = "GL_ID", referencedColumnName = "ID"))
    @Where(clause = " SFYX_ST='1' AND GL_TYPE='3' ")
    private List<SysGlbRole> sysGlbRoleList;

    //角色是否可恢复  1：是  0：否
    @Column(name = "SFKHF")
    private String sfkhf;
    //辅助字段
    @Column(name = "IS_BLOCKED")
    private String is_Blocked;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getLoginPwd() {
        return loginPwd;
    }

    public void setLoginPwd(String loginPwd) {
        this.loginPwd = loginPwd;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getDefault_organ_id() {
        return default_organ_id;
    }

    public void setDefault_organ_id(Long default_organ_id) {
        this.default_organ_id = default_organ_id;
    }

    public String getDftOrganName() {
        return dftOrganName;
    }

    public void setDftOrganName(String dftOrganName) {
        this.dftOrganName = dftOrganName;
    }

    public Integer getSortNum() {
        return sortNum;
    }

    public void setSortNum(Integer sortNum) {
        this.sortNum = sortNum;
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

    public String getSfwhgxcd() {
        return sfwhgxcd;
    }

    public void setSfwhgxcd(String sfwhgxcd) {
        this.sfwhgxcd = sfwhgxcd;
    }

    public List<SysGlbOrganUserPost> getSysGlbOrganUserPostList() {
        return sysGlbOrganUserPostList;
    }

    public void setSysGlbOrganUserPostList(List<SysGlbOrganUserPost> sysGlbOrganUserPostList) {
        this.sysGlbOrganUserPostList = sysGlbOrganUserPostList;
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

    public String getDftOrganCode() {
        return dftOrganCode;
    }

    public void setDftOrganCode(String dftOrganCode) {
        this.dftOrganCode = dftOrganCode;
    }

    public String getIs_Blocked() {
        return is_Blocked;
    }

    public void setIs_Blocked(String is_Blocked) {
        this.is_Blocked = is_Blocked;
    }

    public SysUser(String loginName, String loginPwd, String userName) {
        this.loginName = loginName;
        this.loginPwd = loginPwd;
        this.userName = userName;
        this.sfyx_st = Sfyx_st.VALID;
    }

    public SysUser() {
    }
}
