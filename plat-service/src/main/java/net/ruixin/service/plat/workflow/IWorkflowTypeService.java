package net.ruixin.service.plat.workflow;


import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflowType;

import java.util.List;

/**
 * Created by Jealous on 2016-8-9.
 * 工作流：流程类别服务接口
 *
 */
public interface IWorkflowTypeService {
    /**
     * 根据上级ID获取下级流程类别
     * @param id 流程类别ID
     * @return 下级流程类别
     */
    List<SysWorkflowType> findWorkflowTypesByParent(Long id);

    /**
     * 获取顶级流程类别
     * @return 流程类别
     */
    List<SysWorkflowType> findTopWorkflowTypes();

    /**
     * 转化格式为ZeeTree格式的List
     * @param list 流程类别List
     * @param sysWorkflowList 流程List
     * @return 树格式的List
     */
    List parseTreeMap(List<SysWorkflowType> list, List<SysWorkflow> sysWorkflowList);

    /**
     * 删除流程类别
     * @param id ID
     * @return 成功否
     */
    boolean delWorkflowType(Long id);

    /**
     * 获取流程类别
     * @param id ID
     * @return 流程类别
     */
    SysWorkflowType getWorkflowType(Long id);

    /**
     * 保存修改流程类别
     * @param sysWorkflowType 流程类别
     * @return 成功否
     */
    boolean saveWorkflowType(SysWorkflowType sysWorkflowType);

    /**
     * 判断是否有下级流程类别或者流程
     * @param id 流程类别
     * @return 成功否
     */
    boolean hasChildren(Long id);
}
