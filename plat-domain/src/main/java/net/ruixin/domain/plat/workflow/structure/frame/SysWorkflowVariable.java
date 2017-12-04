package net.ruixin.domain.plat.workflow.structure.frame;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Jealous on 2015/10/15.
 * 实体：流程变量
 */
@Table(name = "SYS_WORKFLOW_VARIABLE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysWorkflowVariable extends BaseDomain {
    //ID
    @Id
    @SequenceGenerator(name = "seq_workflow_variable", sequenceName = "SEQ_SYS_WORKFLOW_VARIABLE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_workflow_variable")
    private Long id;
    //变量名称
    @Column(name = "NAME")
    private String name;
    //初始值
    @Column(name = "INITIAL_VALUE")
    private String value;
    //所属流程
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "WORKFLOW_ID")
    private SysWorkflow workflow;
    //创建人
    @Column(name = "CJR_ID")
    private Long cjr_id;
    //创建时间
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public SysWorkflow getWorkflow() {
        return workflow;
    }

    public void setWorkflow(SysWorkflow workflow) {
        this.workflow = workflow;
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
}
