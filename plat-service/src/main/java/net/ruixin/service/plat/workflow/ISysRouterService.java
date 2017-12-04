package net.ruixin.service.plat.workflow;

import net.ruixin.domain.plat.workflow.structure.route.SysRouter;

import java.util.List;

/**
 * 流向类操作接口
 * Created by Jealous on 2016-9-12.
 */
public interface ISysRouterService {
    /**
     * 根据结束节点查找所有流向
     * @param endNodeId 结束节点ID
     * @return 流向List
     */
    List<SysRouter> findFromRoutersByNode(Long endNodeId);

    /**
     * 根据开始节点查找所有流向
     * @param startNodeId 开始节点ID
     * @return 流向List
     */
    List<SysRouter> findToRoutersByNode(Long startNodeId);
}
