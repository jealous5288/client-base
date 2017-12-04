package net.ruixin.domain.plat.workflow.structure.frame;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.rule.Restrict;
import net.ruixin.domain.rule.Rule;
import net.ruixin.enumerate.plat.Sfyx_st;
import net.ruixin.enumerate.plat.WorkflowPriority;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;

import javax.persistence.*;
import java.util.Date;

/**
 * 实体：流程模型
 */
@SuppressWarnings("unused")
@Table(name = "SYS_WORKFLOW")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysWorkflow extends BaseDomain {
    //ID
    @Id
    @SequenceGenerator(name = "seq_workflow", sequenceName = "SEQ_SYS_WORKFLOW", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_workflow")
    private Long id;
    //业务编码
    @Column(name = "CODE")
    @Restrict(rules = {@Rule(validateClass = "CheckUnique", name = "流程编码")})
    private String code;
    //流程名称
    @Column(name = "NAME")
    private String name;
    //流程类别
    @ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    @JoinColumn(name = "TYPE_ID")
    private SysWorkflowType type;
    //流程处理优先级别
    @Enumerated
    private WorkflowPriority priority;
    //前处理程序
    @Column(name = "STARTUP_PROCESS")
    private String startupProcessSql;
    //后处理程序
    @Column(name = "FINISH_PROCESS")
    private String finishProcessSql;
    //流程实例标题
    @Column(name = "INSTANCE_TITLE")
    private String instanceTitle;
    //流程版本号
    @Column(name = "VERSION")
    private Integer version;
    //原始版本流程id
    @Column(name = "WORKFLOW_ID")
    private Long workflow;
    //原始版本流程名称
    @Formula("(select flow.name from sys_workflow flow where flow.id = workflow_id and rownum < 2)")
    private String versionName;
    //描述
    @Column(name = "DESCRIPTION")
    private String description;
    //创建人
    @Column(name = "CJR_ID")
    private Long cjr_id;
    //创建时间
    @Column(name = "CJSJ")
    private Date cjsj;
    //有效标识
    @Enumerated
    private Sfyx_st sfyx_st;

    //业务状态字典code
    @Column(name = "WORKFLOWYWZTZD")
    private String workflowYwztZd;

    //业务状态字典名称
    @Formula("(SELECT ZD.DICT_NAME FROM SYS_DICT ZD WHERE ZD.DICT_CODE = WORKFLOWYWZTZD)")
    private String workflowYwztZdName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public SysWorkflowType getType() {
        return type;
    }

    public void setType(SysWorkflowType type) {
        this.type = type;
    }

    public WorkflowPriority getPriority() {
        return priority;
    }

    public void setPriority(WorkflowPriority priority) {
        this.priority = priority;
    }

    public String getStartupProcessSql() {
        return startupProcessSql;
    }

    public void setStartupProcessSql(String startupProcessSql) {
        this.startupProcessSql = startupProcessSql;
    }

    public String getFinishProcessSql() {
        return finishProcessSql;
    }

    public void setFinishProcessSql(String finishProcessSql) {
        this.finishProcessSql = finishProcessSql;
    }

    public String getInstanceTitle() {
        return instanceTitle;
    }

    public void setInstanceTitle(String instanceTitle) {
        this.instanceTitle = instanceTitle;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public String getVersionName() {
        return versionName;
    }

    public void setVersionName(String versionName) {
        this.versionName = versionName;
    }

    public Long getWorkflow() {
        return workflow;
    }

    public void setWorkflow(Long workflow) {
        this.workflow = workflow;
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

    public Sfyx_st getSfyx_st() {
        return sfyx_st;
    }

    public void setSfyx_st(Sfyx_st sfyx_st) {
        this.sfyx_st = sfyx_st;
    }

    public String getWorkflowYwztZd() { 
        return workflowYwztZd;
    }

    public void setWorkflowYwztZd(String workflowYwztZd) {
        this.workflowYwztZd = workflowYwztZd;
    }

    public String getWorkflowYwztZdName() {
        return workflowYwztZdName;
    }

    public void setWorkflowYwztZdName(String workflowYwztZdName) {
        this.workflowYwztZdName = workflowYwztZdName;
    }
}
