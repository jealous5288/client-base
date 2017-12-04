package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.instance.SysNodeInstance;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;

import java.util.List;

/**
 * Created by Jealous on 2016-10-25.
 * 环节实例DAO接口
 */
public interface ISysNodeInstanceDao {
    /**
     * 根据流程实例ID获取环节实例
     * @param id 流程实例ID
     * @return 环节实例
     */
    List<SysNodeInstance> getSysNodeInstanceListByWorkflowInstanceId(Long id);

//    /**
//     * 根据流程实例获得环节实例
//     * @param workflowInstance 流程实例
//     * @return 环节实例List
//     */
//    List<SysNodeInstance> findNodeInstancesByWorkflowInstance(SysWorkflowInstance workflowInstance);

    /**
     * 找到运行中的环节
     * @param workflowInstance 流程实例
     * @return 环节实例
     */
    SysNodeInstance findRunningNode(SysWorkflowInstance workflowInstance);

    /**
     * 根据流程实例ID和环节ID获取环节实例列表
     * @param workflowInstanceId 流程实例ID
     * @param transactNodeid 环节ID
     * @return 环节实例列表
     */
    List<SysNodeInstance> getTransactList(Long workflowInstanceId, Long transactNodeid);
}
