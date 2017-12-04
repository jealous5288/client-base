package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

/**
 * Created by Jealous on 2016-8-10.
 * 工作流Dao接口
 */
public interface IWorkflowDao {

    /**
     * 获取工作流版本号
     *
     * @param workflow_id 工作流ID
     * @return 版本号
     */
    Integer getVersion(Long workflow_id);

    /**
     * 保存工作流
     *
     * @param workflow 工作流
     */
    void save(SysWorkflow workflow);

    /**
     * 获取工作流
     *
     * @param id 工作流ID
     * @return 工作流
     */
    SysWorkflow get(Long id);

    /**
     * 通过类型获取工作流
     *
     * @param workfolwTypeId 工作流类型ID
     * @return 工作流List
     */
    List<SysWorkflow> findByType(Long workfolwTypeId);

    /**
     * 通过编码获取工作流
     *
     * @param flowCode 工作流编码
     * @return 工作流List
     */
    SysWorkflow findByCode(String flowCode);

    /**
     * 查询所有工作流
     *
     * @return 工作流List
     */
    List<SysWorkflow> findAll();

    /**
     * 删除工作流
     *
     * @param id 工作流ID
     * @return 操作结果
     */
    boolean del(Long id);

    /**
     * 判断流程类别下是否有工作流
     *
     * @param workflowTypeId 流程类别ID
     * @return 工作流总数
     */
    Integer hasChildrenWorkflow(Long workflowTypeId);

    /**
     * 获取工作流的名称
     */
    String getWName(String workflow_ids);

    FastPagination getPageList(Map map);
}
