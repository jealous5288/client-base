package net.ruixin.domain.plat.auth;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by admin on 2016-8-31.
 * 角色规则关联实体
 */
@SuppressWarnings("unused")
@Table(name = "SYS_GLB_ROLE_AUTHRULE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysGlbRoleAuthRule extends BaseDomain {
    /**
     * 主键id
     */
    @Id
    @SequenceGenerator(name = "seq_glb_role_authrule", sequenceName = "SEQ_SYS_GLB_ROLE_AUTHRULE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_glb_role_authrule")
    private Long id;
    /**
     * 角色ID
     */
    @Column(name = "ROLE_ID")
    private Long roleId;

    /**
     * 规则ID
     */
    @Column(name = "RULE_ID")
    private Long ruleId;

    /*
   * 规则名称
   * */
    @Formula("(SELECT BR.RULE_NAME FROM SYS_AUTH_RULE AR,SYS_BASE_RULE BR WHERE \n" +
            " AR.GL_RULE_ID=BR.ID AND AR.SFYX_ST='1' AND BR.SFYX_ST='1' AND AR.ID = RULE_ID)")
    private String ruleName;

    /*
   * 规则修改时间
   * */

    @Formula("(SELECT BR.XGSJ FROM SYS_AUTH_RULE AR,SYS_BASE_RULE BR WHERE \n" +
            " AR.GL_RULE_ID=BR.ID AND AR.SFYX_ST='1' AND BR.SFYX_ST='1' AND AR.ID = RULE_ID)")
    private Date ruleXgsj;

    /**
     * 描述
     */
    @Formula("(SELECT BR.DESCRIPTION FROM SYS_AUTH_RULE AR,SYS_BASE_RULE BR WHERE \n" +
            " AR.GL_RULE_ID=BR.ID AND AR.SFYX_ST='1' AND BR.SFYX_ST='1' AND AR.ID = RULE_ID)")
    private String description;

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

    public Long getRuleId() {
        return ruleId;
    }

    public void setRuleId(Long ruleId) {
        this.ruleId = ruleId;
    }

    public Sfyx_st getSfyx_st() {
        return sfyx_st;
    }

    public void setSfyx_st(Sfyx_st sfyx_st) {
        this.sfyx_st = sfyx_st;
    }

    public String getRuleName() {
        return ruleName;
    }

    public void setRuleName(String ruleName) {
        this.ruleName = ruleName;
    }

    public Date getRuleXgsj() {
        return ruleXgsj;
    }

    public void setRuleXgsj(Date ruleXgsj) {
        this.ruleXgsj = ruleXgsj;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
