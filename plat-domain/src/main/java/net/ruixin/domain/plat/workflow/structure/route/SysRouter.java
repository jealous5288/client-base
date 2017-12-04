package net.ruixin.domain.plat.workflow.structure.route;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Jealous on 2015/10/15.
 * 实体：流向
 */
@SuppressWarnings("unused")
@Table(name = "SYS_ROUTER")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysRouter extends BaseDomain {
    //ID
    @Id
    @SequenceGenerator(name = "seq_router", sequenceName = "SEQ_SYS_ROUTER", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_router")
    private Long id;
    //名称
    @Column(name = "NAME")
    private String name;
    //决策条件分支
    @Column(name = "BRANCH")
    private String branch;
    //上一环节
    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name = "START_NODE_ID")
    private SysNode startNode;
    //下一环节
    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name = "END_NODE_ID")
    private SysNode endNode;
    //所属流程
    @ManyToOne(cascade = CascadeType.REFRESH)
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

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public SysNode getStartNode() {
        return startNode;
    }

    public void setStartNode(SysNode startNode) {
        this.startNode = startNode;
    }

    public SysNode getEndNode() {
        return endNode;
    }

    public void setEndNode(SysNode endNode) {
        this.endNode = endNode;
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
