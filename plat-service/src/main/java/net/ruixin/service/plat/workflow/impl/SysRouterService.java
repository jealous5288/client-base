package net.ruixin.service.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysRouterDao;
import net.ruixin.domain.plat.workflow.structure.route.SysRouter;
import net.ruixin.service.plat.workflow.ISysRouterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 流向类操作接口实现
 * Created by Jealous on 2016-9-12.
 */
@Service
public class SysRouterService implements ISysRouterService {
    @Autowired
    private ISysRouterDao sysRouterDao;

    @Override
    public List<SysRouter> findFromRoutersByNode(Long endNodeId) {
        return sysRouterDao.findFromRoutersByNode(endNodeId);
    }

    @Override
    public List<SysRouter> findToRoutersByNode(Long startNodeId) {
        return sysRouterDao.findToRoutersByNode(startNodeId);
    }
}
