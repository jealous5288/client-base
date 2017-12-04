package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.instance.SysTask;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;

import java.util.List;
import java.util.Map;

/**
 * 流程任务类操作接口
 * Created by Jealous on 2016-8-23.
 */
public interface ISysTaskDao {
    /**
     * 获取流程任务
     * @param id 流程任务id
     * @return 流程任务
     */
    SysTask get(Long id);

    /**
     * 获取流程任务，通过流程实例ID和用户ID
     * @param wId 流程实例ID
     * @param userId 用户ID
     * @return 流程任务
     */
    SysTask getTaskByWorkflowInstanceAndUser(Long wId, Long userId);

    /**
     * 根据流程实例查找任务
     * @param id 流程实例ID
     * @return 任务list
     */
    List<SysTask> findTasksByWorkflowInstance(Long id);

    /**
     * 通过环节实例获取任务列表
     * @param id 环节实例ID
     * @return 任务列表
     */
    List<SysTask> findTasksByNodeInstanceId(Long id);

    /**
     *  任务列表
     * @param wfiId 环节实例ID
     * @param nodeId 环节ID
     * @return 任务列表
     */
    List taskPage(Long wfiId, Long nodeId);

    /**
     * 获取动态流程意见
     * @param wiId 流程实例Id
     * @param spId 系统页面Id
     * @return 赋值结果
     */
    List getNodePageOpinion(Long wiId, Long spId);

    /**
     * 获取流程意见（暂为实现打印，包含页面编码）
     * @param wiId 流程实例Id
     * @return 赋值结果
     */
    List getPageOpinionWithCode(Long wiId);

    /**
     * 将流程意见存入临时表
     * @param autoOpinion 意见s
     */
    void saveTmpAutoOpinion(String autoOpinion);

    List<Map<String,Object>> getSheetByNodeId(Long nodeId);

    SysNode getFirstActivityNode(String flowCode);
}
