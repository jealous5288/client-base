package net.ruixin.dao.plat.workflow;


import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.node.SysActivityNode;
import net.ruixin.domain.plat.workflow.structure.node.SysDecisionNode;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.domain.plat.workflow.structure.node.SysTransactNode;

import java.util.List;

/**
 * Created by Jealous on 2016-8-9.
 * 环节DAO接口
 */
public interface ISysNodeDao {
    /**
     * 获取工作流的所有环节
     *
     * @param workflow 工作流
     * @return 环节List
     */
    List<SysNode> findNodesByWorkflow(SysWorkflow workflow);

    /**
     * 获取活动环节
     *
     * @param id 活动环节id
     * @return 活动环节
     */
    SysTransactNode getTransactNode(Long id);


    /**
     * 保存环节
     *
     * @param node 环节对象
     */
    void save(SysNode node);

    /**
     * 获取活动环节
     *
     * @param id 活动环节ID
     * @return 活动环节
     */
    SysActivityNode getActivityNode(Long id);

    /**
     * 获取决策环节
     *
     * @param id 决策环节ID
     * @return 决策环节
     */
    SysDecisionNode getDecisionNode(Long id);

    /**
     * 获得环节
     *
     * @param id 环节ID
     * @return 环节
     */
    SysNode get(Long id);

    /**
     * 获取后面的活动环节
     *
     * @param nodeId 节点ID
     * @param branch 决策条件
     * @param wid    流程实例ID
     * @return 活动环节List
     */
    List findNextTransactNodes(Long nodeId, String branch, Long wid);


}
