package net.ruixin.domain.plat.workflow.structure.node;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

/**
 * Created by Jealous on 2015/10/15.
 * 实体类：办理环节
 */
@SuppressWarnings("unused")
@Entity
@Table(name = "SYS_TRANSACT_NODE")
@Inheritance(strategy = InheritanceType.JOINED)
@PrimaryKeyJoinColumn(name="ID")
@DynamicInsert
@DynamicUpdate
public class SysTransactNode extends SysNode{
    //环节办理人
    @Column(name = "ROLE_ID")
    private Long roleId;
    //前处理程序
    @Column(name = "STARTUP_PROCESS")
    private String startupProcess;
    //后处理程序
    @Column(name = "FINISH_PROCESS")
    private String finishProcess;
    //自动处理逻辑
    @Column(name = "AUTO_PROCESS")
    private String autoProcess;

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public String getStartupProcess() {
        return startupProcess;
    }

    public void setStartupProcess(String startupProcess) {
        this.startupProcess = startupProcess;
    }

    public String getFinishProcess() {
        return finishProcess;
    }

    public void setFinishProcess(String finishProcess) {
        this.finishProcess = finishProcess;
    }

    public String getAutoProcess() {
        return autoProcess;
    }

    public void setAutoProcess(String autoProcess) {
        this.autoProcess = autoProcess;
    }
}
