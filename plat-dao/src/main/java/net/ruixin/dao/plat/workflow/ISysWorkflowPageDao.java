package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.structure.page.SysWorkflowPage;

import java.util.List;

/**
 * 流程表单DAO接口
 * Created by Jealous on 2016-9-1.
 */
public interface ISysWorkflowPageDao {
    /**
     * 获取流程表单
     * @param workflowPageId 流程表单ID
     * @return 流程表单
     */
    SysWorkflowPage get(Long workflowPageId);

    /**
     * 保存流程表单
     * @param workflowPage 流程表单实体
     */
    void saveWorkflowPage(SysWorkflowPage workflowPage);

    /**
     *通过流程查找所有的流程表单实体
     * @param wId 工作流ID
     * @return 流程表单list
     */
    List<SysWorkflowPage> findWorkflowSheetsByWorkflow(Long wId);
}
