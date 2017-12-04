package net.ruixin.domain.plat.workflow.instance;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Administrator on 2016/12/12 0012.
 * 委托实体
 */
@SuppressWarnings("unused")
@Table(name = "SYS_ENTRUST")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysEntrust extends BaseDomain {
    @Id
    @SequenceGenerator(name = "seq_sys_entrust", sequenceName = "SEQ_SYS_ENTRUST", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_entrust")
    private Long id;

    //用户id
    @Column(name = "USER_ID")
    private Long userId;
    /**
     * 用户
     */
    @Formula("(SELECT SUSER.USER_NAME FROM SYS_USER SUSER WHERE SUSER.ID = USER_ID AND SFYX_ST='1')")
    private String username;

    //委办人id
    @Column(name = "ENTRUST_USER_ID")
    private Long entrustUserId;

    //委办人姓名
    @Formula("(SELECT SUSER.USER_NAME FROM SYS_USER SUSER WHERE SUSER.ID = ENTRUST_USER_ID AND SFYX_ST='1')")
    private String entrustUserName;

    //所属流程(多个流程用逗号分隔)
    @Column(name = "WORKFLOW_ID")
    private String  workFlow_Id;
    /**
     * 流程
     */
    @Transient
    private String workflow;
    //委办开始时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "START_DATE")
    private Date startDate;

    //委办结束时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "END_DATE")
    private Date endDate;

    //有效标识:0无效，1有效
    @Enumerated
    private Sfyx_st sfyx_st;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getEntrustUserId() {
        return entrustUserId;
    }

    public void setEntrustUserId(Long entrustUserId) {
        this.entrustUserId = entrustUserId;
    }

    public String getEntrustUserName() {
        return entrustUserName;
    }

    public void setEntrustUserName(String entrustUserName) {
        this.entrustUserName = entrustUserName;
    }

    public String getWorkFlow_Id() {
        return workFlow_Id;
    }

    public void setWorkFlow_Id(String workFlow_Id) {
        this.workFlow_Id = workFlow_Id;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Sfyx_st getSfyx_st() {
        return sfyx_st;
    }

    public void setSfyx_st(Sfyx_st sfyx_st) {
        this.sfyx_st = sfyx_st;
    }

    public String getUser() {
        return username;
    }

    public void setUser(String username) {
        this.username = username;
    }
     public String getWorkflow() {
        return workflow;
    }

    public void setWorkflow(String workflow) {
        this.workflow = workflow;
    }
}
