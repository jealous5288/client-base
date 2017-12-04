package net.ruixin.domain.plat.workflow.instance;

import com.fasterxml.jackson.annotation.JsonBackReference;
import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.plat.workflow.structure.route.SysRouter;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Jealous on 2016/03/02.
 * 实体：流向实例类
 */
@SuppressWarnings("unused")
@Table(name = "SYS_ROUTER_INSTANCE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysRouterInstance extends BaseDomain {
    // ID
    @Id
    @SequenceGenerator(name = "seq_sys_router_instance", sequenceName = "SEQ_SYS_ROUTER_INSTANCE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_router_instance")
    private Long id;

    // 流向
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "ROUTER_ID")
    @JsonBackReference
    private SysRouter router_id;

    // 开始环节实例
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "START_NODE_INSTANCE_ID")
    @JsonBackReference
    private SysNodeInstance start_node_instance_id;

    // 结束环节实例
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "END_NODE_INSTANCE_ID")
    @JsonBackReference
    private SysNodeInstance end_node_instance_id;

    // 流程实例
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "WORKFLOW_INSTANCE_ID")
    @JsonBackReference
    private SysWorkflowInstance workflow_instance_id;

    // 创建时间
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

    public SysRouter getRouter_id() {
        return router_id;
    }

    public void setRouter_id(SysRouter router_id) {
        this.router_id = router_id;
    }

    public SysNodeInstance getStart_node_instance_id() {
        return start_node_instance_id;
    }

    public void setStart_node_instance_id(SysNodeInstance start_node_instance_id) {
        this.start_node_instance_id = start_node_instance_id;
    }

    public SysNodeInstance getEnd_node_instance_id() {
        return end_node_instance_id;
    }

    public void setEnd_node_instance_id(SysNodeInstance end_node_instance_id) {
        this.end_node_instance_id = end_node_instance_id;
    }

    public SysWorkflowInstance getWorkflow_instance_id() {
        return workflow_instance_id;
    }

    public void setWorkflow_instance_id(SysWorkflowInstance workflow_instance_id) {
        this.workflow_instance_id = workflow_instance_id;
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
