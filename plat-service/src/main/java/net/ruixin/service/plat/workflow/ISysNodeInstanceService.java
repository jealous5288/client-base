package net.ruixin.service.plat.workflow;

import net.ruixin.domain.plat.workflow.instance.SysNodeInstance;

import java.util.List;

/**
 * 环节实例类操作接口
 * Created by Jealous on 2016-9-12.
 */
public interface ISysNodeInstanceService {

    /**
     * 根据流程实例ID获取环节实例
     * @param id 流程实例ID
     * @return 环节实例
     */
    List<SysNodeInstance> getTransactListByWorkflowInstanceId(Long id);

    /**
     * 根据流程实例ID和环节ID获取环节实例列表
     * @param workflowInstanceId 流程实例ID
     * @param transactNodeid 环节ID
     * @return 环节实例列表
     */
    List<SysNodeInstance> getTransactList(Long workflowInstanceId, Long transactNodeid);
}
