package net.ruixin.domain.plat.organ;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.plat.auth.SysGlbRole;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * 岗位实体
 * Created by Jealous on 2016-8-15.
 */
@SuppressWarnings("unused")
@Table(name = "SYS_POST")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysPost extends BaseDomain {
    @Id
    @SequenceGenerator(name = "seq_syspost", sequenceName = "SEQ_SYS_POST", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_syspost")
    private Long id;
    //岗位名称
    @Column(name = "POST_NAME")
    private String postName;
    //所属组织
    @Column(name = "ORGAN")
    private Long organ;

    //所属组织名称
    @Formula("(SELECT ORGAN.ORGAN_NAME FROM SYS_ORGAN ORGAN WHERE ORGAN.ID = ORGAN AND ORGAN.SFYX_ST='1')")
    private String organName;

    //上层岗位
    @Column(name = "PARENT_POST")
    private Long parent_post;

    //上层岗位名称
    @Formula("(SELECT POST.POST_NAME FROM SYS_POST POST WHERE POST.ID = PARENT_POST AND POST.SFYX_ST='1')")
    private String parentPostName;

    //显示顺序
    @Column(name = "SORT_NUM")
    private Integer sortNum;
    //备注
    @Column(name = "DESCRIPTION")
    private String description;
    //有效标识
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
    //与角色的一对多关系
    @OneToMany(targetEntity = SysGlbRole.class, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumns(@JoinColumn(name = "GL_ID", referencedColumnName = "ID"))
    @Where(clause = " SFYX_ST='1' AND GL_TYPE='1' ")
    private List<SysGlbRole> sysGlbRoleList;

    //角色是否可恢复  1：是  0：否
    @Column(name = "SFKHF")
    private String sfkhf;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPostName() {
        return postName;
    }

    public void setPostName(String postName) {
        this.postName = postName;
    }

    public Long getOrgan() {
        return organ;
    }

    public void setOrgan(Long organ) {
        this.organ = organ;
    }

    public String getOrganName() {
        return organName;
    }

    public void setOrganName(String organName) {
        this.organName = organName;
    }

    public Long getParent_post() {
        return parent_post;
    }

    public void setParent_post(Long parent_post) {
        this.parent_post = parent_post;
    }

    public String getParentPostName() {
        return parentPostName;
    }

    public void setParentPostName(String parentPostName) {
        this.parentPostName = parentPostName;
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
}
