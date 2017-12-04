package net.ruixin.domain.plat.workflow.structure.frame;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Jealous on 2015/10/15.
 * 实体：流程类别
 */
@SuppressWarnings("unused")
@Table(name = "SYS_WORKFLOW_TYPE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysWorkflowType extends BaseDomain {
    //ID
    @Id
    @SequenceGenerator(name = "seq_workflow_type", sequenceName = "SEQ_SYS_WORKFLOW_TYPE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_workflow_type")
    private Long id;
    //流程类别名称
    @Column(name = "NAME")
    private String name;
    //上级类别
    @Column(name = "PARENT_ID")
    private Long parent_id;
    //类别描述
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
    //有效标识
    @Enumerated
    private Sfyx_st sfyx_st;

    public SysWorkflowType() {

    }

    public SysWorkflowType(Long id, String name, String description, Long parent_id) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.parent_id = parent_id;
    }

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

    public Long getParent_id() {
        return parent_id;
    }

    public void setParent_id(Long parent_id) {
        this.parent_id = parent_id;
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
