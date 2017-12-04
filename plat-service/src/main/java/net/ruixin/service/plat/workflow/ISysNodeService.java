package net.ruixin.service.plat.workflow;

import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.node.SysDecisionNode;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.domain.plat.workflow.structure.node.SysTransactNode;

import java.util.List;

/**
 * Created by Jealous on 2016-8-8.
 * 工作流：环节服务接口
 */
@SuppressWarnings("unused")
public interface ISysNodeService {
    /**
     * 得到一个流程中的所有环节
     *
     * @param workflow 流程实体
     * @return 环节列表
     */
    List<SysNode> findNodesByWorkflow(SysWorkflow workflow);

    /**
     * 得到上一个环节是否是开始环节
     *
     * @param nodeId 环节ID
     * @return 判断结果
     */
    Boolean isStartNodeByPreviousNode(Long nodeId);

    /**
     * 查询环节的上一环节
     * @param nodeId 节点ID
     * @return 环节List
     */
    List<SysNode> findPreviousNodes(Long nodeId);

    /**
     * 得到某个环节的后续手工决策
     * @param node 环节
     * @return 如果不存在则返回null
     */
    SysDecisionNode getDecisionRouterByNode(SysNode node);

    /**
     * 得到某个环节依据分支条件的后续办理环节
     * @param node 环节
     * @param branch 如果没有决策条件则传入null
     * @param sysworkflowinstance 流程实例
     * @return List<TransactNode>
     */
    List<SysTransactNode> findNextTransactNodes(SysNode node, String branch, SysWorkflowInstance sysworkflowinstance);
}
