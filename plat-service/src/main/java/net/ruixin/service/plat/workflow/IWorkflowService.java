package net.ruixin.service.plat.workflow;

import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

/**
 * Created by Jealous on 2016-8-8.
 * 工作流：服务接口
 */
public interface IWorkflowService {

    /**
     * 获取工作流
     *
     * @param id 工作流ID
     * @return SysWorkflow
     */
    SysWorkflow get(Long id);

    /**
     * 获取工作流List
     *
     * @param workfolwTypeId 工作流类型ID
     * @return List
     */
    List<SysWorkflow> findWorkflowsByType(Long workfolwTypeId);

    SysWorkflow findWorkflowsByCode(String flowCode);

    /**
     * 查询所有的流程
     *
     * @return List
     */
    List<SysWorkflow> findAllWorkflow();

    /**
     * 删除工作流
     *
     * @param id 工作流ID
     * @return 成功否
     */
    boolean delWorkflow(Long id);

    /**
     * 保存工作流
     *
     * @param json json格式工作流内容
     * @return 成功否
     */
    Long saveWorkflow(String json);

    /**
     * 判断某流程类别下是否有流程
     *
     * @param id 流程类别ID
     * @return 是否
     */
    boolean hasWorkflow(Long id);

    /**
     * 获取工作流的JSON数据
     *
     * @param id 流程ID
     * @return JSON数据
     */
    Map getWorkflowJSON(Long id);

    /**
     * 获取工作流最大版本号
     *
     * @param workflowId 流程ID
     * @return 最大版本号
     */
    Integer getWorkflowVersion(Long workflowId);

    FastPagination getPageList(Map map);
}
