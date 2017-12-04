package net.ruixin.domain.plat.workflow.instance;

import com.fasterxml.jackson.annotation.JsonBackReference;
import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.plat.organ.SysUser;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Jealous on 2016/03/02.
 * 流程实例
 */
@SuppressWarnings("unused")
@Table(name = "SYS_WORKFLOW_INSTANCE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysWorkflowInstance extends BaseDomain {
    //ID
    @Id
    @SequenceGenerator(name = "seq_sys_workflow_instance", sequenceName = "SEQ_SYS_WORKFLOW_INSTANCE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_workflow_instance")
    private Long id;

    //流程
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "WORKFLOW_ID")
    @JsonBackReference
    private SysWorkflow workflow_id;

    //实例标题
    @Column(name = "TITLE")
    private String title;
    //初始值 ?
    @Column(name = "INITIAL_VALUE")
    private String initial_value;

    //状态  ：0完成（正常结束）、1挂起、2运行、3终止（异常结束）、4未正常启动、5待提交
    @Column(name = "STATUS")
    private String status;

    //启动人
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "STARTUP_USER_ID")
    @JsonBackReference
    private SysUser startup_user_id;

    //数据ID
    @Column(name = "DATA_ID")
    private Long data_id;

    //启动类型0:人工  1：嵌套
    @Column(name = "STARTUP_TYPE")
    private String startup_type;

    //启动时间
    @Column(name = "CJSJ")
    private Date cjsj;

    //结束时间 ?
    @Column(name = "FINISH_DATE")
    private Date finish_date;

    //有效标识
    @Enumerated
    private Sfyx_st sfyx_st;

    //源数据
    @Column(name = "SOURCE_DATA")
    private String sourceData;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SysWorkflow getWorkflow_id() {
        return workflow_id;
    }

    public void setWorkflow_id(SysWorkflow workflow_id) {
        this.workflow_id = workflow_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getInitial_value() {
        return initial_value;
    }

    public void setInitial_value(String initial_value) {
        this.initial_value = initial_value;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public SysUser getStartup_user_id() {
        return startup_user_id;
    }

    public void setStartup_user_id(SysUser startup_user_id) {
        this.startup_user_id = startup_user_id;
    }

    public Long getData_id() {
        return data_id;
    }

    public void setData_id(Long data_id) {
        this.data_id = data_id;
    }

    public String getStartup_type() {
        return startup_type;
    }

    public void setStartup_type(String startup_type) {
        this.startup_type = startup_type;
    }

    public Date getCjsj() {
        return cjsj;
    }

    public void setCjsj(Date cjsj) {
        this.cjsj = cjsj;
    }

    public Date getFinish_date() {
        return finish_date;
    }

    public void setFinish_date(Date finish_date) {
        this.finish_date = finish_date;
    }

    public Sfyx_st getSfyx_st() {
        return sfyx_st;
    }

    public void setSfyx_st(Sfyx_st sfyx_st) {
        this.sfyx_st = sfyx_st;
    }

    public String getSourceData() {
        return sourceData;
    }

    public void setSourceData(String sourceData) {
        this.sourceData = sourceData;
    }
}
