package net.ruixin.domain.plat.workflow.instance;

import com.fasterxml.jackson.annotation.JsonBackReference;
import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.plat.organ.SysUser;
import net.ruixin.enumerate.plat.Sfyx_st;
import net.ruixin.enumerate.plat.TaskAction;
import net.ruixin.enumerate.plat.TaskStatus;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Jealous on 2016/03/02.
 * 实体：任务实例类
 */
@SuppressWarnings("unused")
@Table(name = "SYS_TASK_INSTANCE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysTask extends BaseDomain {
    // ID
    @Id
    @SequenceGenerator(name = "seq_sys_task_instance", sequenceName = "SEQ_SYS_TASK_INSTANCE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_task_instance")
    private Long id;
    // 办理人
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID")
    @JsonBackReference
    private SysUser user_id;
    // 环节实例
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "NODE_INSTANCE_ID")
    @JsonBackReference
    private SysNodeInstance node_instance_id;
    // 流程实例
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "WORKFLOW_INSTANCE_ID")
//    @JsonBackReference
    private SysWorkflowInstance workflow_instance_id;
    // 任务状态,0待办1在办2已办3抢占终止4会签终止5传阅终止6异步终止7被撤回8被退回
    @Enumerated
    private TaskStatus status;
    // 办理动作.1、无动作2、签收3、提交4、退回5、撤回6、转办
    @Enumerated
    private TaskAction action;
    // 环节意见
    @Column(name = "OPINION")
    private String opinion;
    // 决策条件
    @Column(name = "BRANCH")
    private String branch;
    // 是否完成：0未完成 ,1完成
    @Column(name = "IS_FINISH")
    private String is_finish;
    // 派发时间
    @Column(name = "CJSJ")
    private Date cjsj;
    // 签收时间
    @Column(name = "ACCEPT_DATE")
    private Date accept_date;
    // 结束时间
    @Column(name = "FINISH_DATE")
    private Date finish_date;
    //附件ID
    @Column(name = "FJ_ID")
    private String fj_id;
    //有效标识
    @Enumerated
    private Sfyx_st sfyx_st;
    //页面意见
    @Formula("(SELECT TP.TASK_PAGE_OPINION FROM SYS_TASK_WF_PAGE_INSTANCE TP WHERE TP.SFYX_ST = '1' " +
            "AND TP.TASK_PAGE_OPINION IS NOT NULL AND TP.TASK_INSTANCE_ID=ID AND ROWNUM < 2)")
    private String pageOpinion;
    //附件数
    @Formula("(SELECT COUNT(T1.ID) FROM SYS_ATTACHMENT T1 WHERE T1.SFYX_ST = '1' AND T1.uuid=fj_id)")
    private String fjs;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SysUser getUser_id() {
        return user_id;
    }

    public void setUser_id(SysUser user_id) {
        this.user_id = user_id;
    }

    public SysNodeInstance getNode_instance_id() {
        return node_instance_id;
    }

    public void setNode_instance_id(SysNodeInstance node_instance_id) {
        this.node_instance_id = node_instance_id;
    }

    public SysWorkflowInstance getWorkflow_instance_id() {
        return workflow_instance_id;
    }

    public void setWorkflow_instance_id(SysWorkflowInstance workflow_instance_id) {
        this.workflow_instance_id = workflow_instance_id;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public TaskAction getAction() {
        return action;
    }

    public void setAction(TaskAction action) {
        this.action = action;
    }

    public String getOpinion() {
        return opinion;
    }

    public void setOpinion(String opinion) {
        this.opinion = opinion;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getIs_finish() {
        return is_finish;
    }

    public void setIs_finish(String is_finish) {
        this.is_finish = is_finish;
    }

    public Date getAccept_date() {
        return accept_date;
    }

    public void setAccept_date(Date accept_date) {
        this.accept_date = accept_date;
    }

    public Date getFinish_date() {
        return finish_date;
    }

    public void setFinish_date(Date finish_date) {
        this.finish_date = finish_date;
    }

    public String getFj_id() {
        return fj_id;
    }

    public void setFj_id(String fj_id) {
        this.fj_id = fj_id;
    }

    public String getFjs() {
        return fjs;
    }

    public void setFjs(String fjs) {
        this.fjs = fjs;
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

    public String getPageOpinion() {
        return pageOpinion;
    }

    public void setPageOpinion(String pageOpinion) {
        this.pageOpinion = pageOpinion;
    }
}
