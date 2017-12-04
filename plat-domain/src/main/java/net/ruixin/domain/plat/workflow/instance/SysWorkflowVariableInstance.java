package net.ruixin.domain.plat.workflow.instance;

import com.fasterxml.jackson.annotation.JsonBackReference;
import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflowVariable;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Jealous on 2016/03/02.
 * 实体：流程变量实例类
 */
@SuppressWarnings("unused")
@Table(name = "SYS_WORKFLOW_VARIABLE_INSTANCE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysWorkflowVariableInstance extends BaseDomain {
    // ID
    @Id
    @SequenceGenerator(name = "seq_sys_workflow_variable_instance", sequenceName = "SEQ_SYS_WORKFLOW_VARIABLE_INST", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_workflow_variable_instance")
    private Long id;

    // 流程实例
    @ManyToOne(cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JoinColumn(name = "WORKFLOW_INSTANCE_ID")
    @JsonBackReference
    private SysWorkflowInstance workflow_instance_id;

    // 变量
    @ManyToOne(cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JoinColumn(name = "VARIABLE_ID")
    @JsonBackReference
    private SysWorkflowVariable variable_id;

    // 变量值
    @Column(name = "VALUE")
    private String value;

    // 创建时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CJSJ")
    private Date cjsj;

    //有效标识
    @Enumerated
    private Sfyx_st sfyx_st;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SysWorkflowInstance getWorkflow_instance_id() {
        return workflow_instance_id;
    }

    public void setWorkflow_instance_id(SysWorkflowInstance workflow_instance_id) {
        this.workflow_instance_id = workflow_instance_id;
    }

    public SysWorkflowVariable getVariable_id() {
        return variable_id;
    }

    public void setVariable_id(SysWorkflowVariable variable_id) {
        this.variable_id = variable_id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Date getCjsj() {
        return cjsj;
    }

    public void setCjsj(Date cjsj) {
        this.cjsj = cjsj;
    }

    public Sfyx_st getSfyx_st() {
        return sfyx_st;
    }

    public void setSfyx_st(Sfyx_st sfyx_st) {
        this.sfyx_st = sfyx_st;
    }
}
