package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflowVariable;

import java.util.List;

/**
 * 流程变量dao
 * Created by Jealous on 2016-9-1.
 */
public interface ISysWorkflowVariableDao {
    /**
     * 获取流程变量
     * @param variableId 变量ID
     * @return 流程变量
     */
    SysWorkflowVariable get(Long variableId);

    /**
     * 保存流程变量
     * @param workflowVariable 流程变量实体
     */
    void saveVariable(SysWorkflowVariable workflowVariable);

    /**
     * 通过流程查找所有的流程变量
     * @param workflow 工作流
     * @return 流程变量list
     */
    List<SysWorkflowVariable> findVariableByWorkflow(SysWorkflow workflow);

    /**
     * 通过变量名称和流程获取变量
     * @param name 变量名称
     * @param workflow 流程
     * @return 变量
     */
    SysWorkflowVariable getByNameAndWfi(String name, SysWorkflow workflow);
}
