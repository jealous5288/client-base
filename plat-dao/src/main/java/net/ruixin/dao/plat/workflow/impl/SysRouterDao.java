package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysRouterDao;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.route.SysRouter;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 流向dao实现
 * Created by Jealous on 2016-9-1.
 */
@SuppressWarnings("unused")
@Repository
public class SysRouterDao extends BaseDao<SysRouter> implements ISysRouterDao {
    @Override
    public void saveSysRouterDao(SysRouter router) {
        super.saveOrUpdate(router);
    }

    @Override
    public SysRouter get(Long routerId) {
        return super.get(routerId);
    }

    @Override
    public List<SysRouter> findRoutersByWorkflow(SysWorkflow workflow) {
        return super.findListByHql("from SysRouter t where t.workflow = ? and t.sfyx_st = '1'", workflow);
    }

    @Override
    public List<SysRouter> findFromRoutersByNode(Long endNodeId) {
        return super.findListByHql("from SysRouter t where t.endNode.id = ? and t.sfyx_st = '1'", endNodeId);
    }

    @Override
    public List<SysRouter> findToRoutersByNode(Long startNodeId) {
        return super.findListByHql("from SysRouter t where t.startNode.id = ? and t.sfyx_st = '1'", startNodeId);
    }
}
