package net.ruixin.domain.plat.auth;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

/**
 * Created with IntelliJ IDEA.
 * User: Administrator
 * Date: 16-9-22
 */
@SuppressWarnings("unused")
@Table(name = "SYS_GLB_ROLE_PAGEAUTHROLE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysGlbRolePageAuthRole extends BaseDomain {

    /**
     * 主键id
     */
    @Id
    @SequenceGenerator(name = "seq_glb_role_moduleauthrole", sequenceName = "SEQ_SYS_GLB_ROLE_PAGEAUTHROLE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_glb_role_moduleauthrole")
    private Long id;
    /**
     * 角色ID
     */
    @Column(name = "ROLE_ID")
    private Long roleId;
    /**
     * 权限角色ID
     */
    @Column(name = "PAGEAUTHROLE_ID")
    private Long pageAuthroleId;
    /**
     * 有效状态，0：无效，1：有效
     */
    @Enumerated
    private Sfyx_st sfyx_st;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public Long getPageAuthroleId() {
        return pageAuthroleId;
    }

    public void setPageAuthroleId(Long pageAuthroleId) {
        this.pageAuthroleId = pageAuthroleId;
    }

    public Sfyx_st getSfyx_st() {
        return sfyx_st;
    }

    public void setSfyx_st(Sfyx_st sfyx_st) {
        this.sfyx_st = sfyx_st;
    }
}
