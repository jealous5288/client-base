package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflowType;

import java.util.List;

/**
 * Created by Jealous on 2016-8-10.
 * 流程类别Dao接口
 */
public interface IWorkflowTypeDao {

    /**
     * 获取工作流类型
     *
     * @param workflowTypeId 工作流类型类型
     * @return 工作流类型
     */
    SysWorkflowType get(Long workflowTypeId);

    /**
     * 获取下级工作流类型
     *
     * @param id 上级工作流类型id
     * @return 下级工作流类型List
     */
    List<SysWorkflowType> findByParent(Long id);

    /**
     * 获取顶层工作流类型
     *
     * @return 工作流类型List
     */
    List<SysWorkflowType> findTops();

    /**
     * 删除工作流类型
     *
     * @param id 工作流类型id
     * @return 操作结果
     */
    boolean del(Long id);

    /**
     * 保存工作流类型
     *
     * @param sysWorkflowType 工作流类型
     * @return 操作结果
     */
    boolean save(SysWorkflowType sysWorkflowType);

    /**
     * 是否有下级流程类型
     *
     * @param id 工作流类型id
     * @return 下级类型总数
     */
    Integer hasChildrenWorkflowTypes(Long id);
}
