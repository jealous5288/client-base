package net.ruixin.service.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysNodeInstanceDao;
import net.ruixin.domain.plat.workflow.instance.SysNodeInstance;
import net.ruixin.service.plat.workflow.ISysNodeInstanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 环节实例类操作接口实现
 * Created by Jealous on 2016-9-12.
 */
@Service
public class SysNodeInstanceService implements ISysNodeInstanceService {

    @Autowired
    private ISysNodeInstanceDao sysNodeInstanceDao;

    @Override
    public List<SysNodeInstance> getTransactListByWorkflowInstanceId(Long id) {
        return sysNodeInstanceDao.getSysNodeInstanceListByWorkflowInstanceId(id);
    }

    @Override
    public List<SysNodeInstance> getTransactList(Long workflowInstanceId, Long transactNodeid) {
        return sysNodeInstanceDao.getTransactList(workflowInstanceId,transactNodeid);
    }
}
