package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.route.SysRouter;

import java.util.List;

/**
 * 流向dao
 * Created by Jealous on 2016-9-1.
 */
public interface ISysRouterDao {
    /**
     * 保存流向
     * @param router 流向
     */
    void saveSysRouterDao(SysRouter router);

    /**
     * 获取流向
     * @param routerId 流向ID
     * @return 流向实体
     */
    SysRouter get(Long routerId);

    /**
     * 通过流程找流向
     * @param workflow 工作流
     * @return 流向list
     */
    List<SysRouter> findRoutersByWorkflow(SysWorkflow workflow);

    /**
     * 通过流出节点查流向
     * @param endNodeId 流出节点ID
     * @return 流向list
     */
    List<SysRouter> findFromRoutersByNode(Long endNodeId);

    /**
     * 通过流入节点查流向
     * @param startNodeId 流入节点ID
     * @return 流向list
     */
    List<SysRouter> findToRoutersByNode(Long startNodeId);
}
