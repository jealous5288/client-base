package net.ruixin.service.plat.workflow;

import net.ruixin.domain.plat.workflow.instance.SysNodeInstance;
import net.ruixin.domain.plat.workflow.instance.SysTask;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;

/**
 * 工作流后置程序接口
 * Created by Jealous on 2016-8-22.
 */
@SuppressWarnings("unused")
public interface ISupportProgram {

    void run(String opinion, String branch, String fj_id);

    SysNodeInstance getNodeInstance();

    void setNodeInstance(SysNodeInstance nodeInstance);

    SysWorkflowInstance getWorkflowInstance();

    void setWorkflowInstance(SysWorkflowInstance workflowInstance);

    SysTask getSysTask();

    void setSysTask(SysTask sysTask);
}
