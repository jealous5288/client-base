package net.ruixin.service.plat.workflow.impl;

import net.ruixin.domain.plat.workflow.instance.SysNodeInstance;
import net.ruixin.domain.plat.workflow.instance.SysTask;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.service.plat.workflow.ISupportProgram;

/**
 * 工作流后置程序接口抽象实现
 * Created by Jealous on 2016-8-22.
 */
@SuppressWarnings({"unused", "WeakerAccess"})
public abstract class SupportProgram implements ISupportProgram {

    public SysNodeInstance nodeInstance;
    public SysWorkflowInstance workflowInstance;
    public SysTask sysTask;

    @Override
    public abstract void run(String opinion, String branch, String fj_id);

    @Override
    public SysNodeInstance getNodeInstance() {
        return nodeInstance;
    }

    @Override
    public void setNodeInstance(SysNodeInstance nodeInstance) {
        this.nodeInstance = nodeInstance;
    }

    @Override
    public SysWorkflowInstance getWorkflowInstance() {
        return workflowInstance;
    }

    @Override
    public void setWorkflowInstance(SysWorkflowInstance workflowInstance) {
        this.workflowInstance = workflowInstance;
    }

    @Override
    public SysTask getSysTask() {
        return sysTask;
    }

    @Override
    public void setSysTask(SysTask sysTask) {
        this.sysTask = sysTask;
    }
}
