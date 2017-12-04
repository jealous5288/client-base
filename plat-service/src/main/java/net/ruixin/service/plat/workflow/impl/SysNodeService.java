package net.ruixin.service.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysNodeDao;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.node.SysDecisionNode;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.domain.plat.workflow.structure.node.SysTransactNode;
import net.ruixin.domain.plat.workflow.structure.route.SysRouter;
import net.ruixin.enumerate.plat.DecisionType;
import net.ruixin.enumerate.plat.NodeType;
import net.ruixin.service.plat.workflow.ISysNodeService;
import net.ruixin.service.plat.workflow.ISysRouterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by Jealous on 2016-8-9.
 * 工作流：环节服务实现
 */
@Service
@Transactional
public class SysNodeService implements ISysNodeService {

    @Autowired
    private ISysNodeDao sysNodeDao;

    @Autowired
    private ISysRouterService sysRouterService;

    @Override
    public List<SysNode> findNodesByWorkflow(SysWorkflow workflow) {
        return sysNodeDao.findNodesByWorkflow(workflow);
    }

    @Override
    public Boolean isStartNodeByPreviousNode(Long nodeId) {
        List<SysNode> previousNodes = findPreviousNodes(nodeId);
        for (SysNode n : previousNodes) {
            if (n.getType() == NodeType.START_NODE) {
                return true;
            }
        }
        return false;
    }

    @Override
    public List<SysNode> findPreviousNodes(Long nodeId) {
        List<SysRouter> routers = sysRouterService.findFromRoutersByNode(nodeId);
        List<SysNode> nodes = new ArrayList<>();
        for (SysRouter r : routers) {
            nodes.add(r.getStartNode());
        }
        return nodes;
    }

    @Override
    public SysDecisionNode getDecisionRouterByNode(SysNode node) {
        List<SysNode> nextNodes = findNextNodes(node);
        for (SysNode n : nextNodes) {
            if (n.getType() == NodeType.DECISION_NODE) {
                SysDecisionNode decisionNode = (SysDecisionNode) n;
                if (decisionNode.getDecisionType() == DecisionType.MANUAL) {
                    return decisionNode;
                }
            }
        }
        return null;
    }

    @Override
    public List<SysTransactNode> findNextTransactNodes(SysNode node, String branch, SysWorkflowInstance sysworkflowinstance) {
        List<SysTransactNode> nextNodes = null;
        List list = sysNodeDao.findNextTransactNodes(node.getId(), branch, sysworkflowinstance.getId());
        if (list.size() > 0) {
            nextNodes = new ArrayList<>();
            List nodeList = (ArrayList) list.get(0);
            if(nodeList != null && nodeList.size() > 0){
                for (Object map : nodeList) {
                    nextNodes.add(sysNodeDao.getTransactNode(Long.valueOf(((Map)map).get("ID").toString())));
                }
            }

        }
        return nextNodes;
    }

    /**
     * 得到某个环节的后续环节
     *
     * @param node 环节
     * @return 后续环节
     */
    private List<SysNode> findNextNodes(SysNode node) {
        List<SysRouter> routers = sysRouterService.findToRoutersByNode(node.getId());
        List<SysNode> nodes = new ArrayList<>();
        for (SysRouter r : routers) {
            nodes.add(r.getEndNode());
        }
        return nodes;
    }
}
