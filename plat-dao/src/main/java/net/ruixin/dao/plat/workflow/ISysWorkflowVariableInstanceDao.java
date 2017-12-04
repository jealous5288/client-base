package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowVariableInstance;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflowVariable;

/**
 * 变量环节赋值类操作接口
 * Created by Jealous on 2016-11-7.
 */
public interface ISysWorkflowVariableInstanceDao {
    SysWorkflowVariableInstance getByVariableAndWfi(SysWorkflowVariable workflowVariable, SysWorkflowInstance workflowInstance);

    void save(SysWorkflowVariableInstance swvi);
}
