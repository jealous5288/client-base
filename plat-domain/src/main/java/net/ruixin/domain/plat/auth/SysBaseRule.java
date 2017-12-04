package net.ruixin.domain.plat.auth;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.rule.Restrict;
import net.ruixin.domain.rule.Rule;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by admin on 2016-9-28
 * 基本规则实体
 */
@SuppressWarnings("unused")
@Table(name = "SYS_BASE_RULE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysBaseRule extends BaseDomain {
    /**
     * 主键id
     */
    @Id
    @SequenceGenerator(name = "seq_base_rule", sequenceName = "SEQ_SYS_BASE_RULE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_base_rule")
    private Long id;
    /**
     * 规则名称
     */
    @Restrict(rules = {@Rule(validateClass = "CheckUnique", name = "规则名称")})
    @Column(name = "RULE_NAME")
    private String rule_name;
    /**
     * 规则实现方式，字典项{sql、存储过程、Java代码等}
     */
    @Column(name = "SXFS")
    private String sxfs;
    /**
     * 规则实现细节
     */
    @Column(name = "RULE_DETAIL")
    private String rule_detail;
    /**
     * 规则描述
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRule_name() {
        return rule_name;
    }

    public void setRule_name(String rule_name) {
        this.rule_name = rule_name;
    }

    public String getSxfs() {
        return sxfs;
    }

    public void setSxfs(String sxfs) {
        this.sxfs = sxfs;
    }

    public String getRule_detail() {
        return rule_detail;
    }

    public void setRule_detail(String rule_detail) {
        this.rule_detail = rule_detail;
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
}
