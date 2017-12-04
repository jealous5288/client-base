package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysNodeInstanceDao;
import net.ruixin.domain.plat.workflow.instance.SysNodeInstance;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 环节实例Dao实现
 * Created by Jealous on 2016-10-25.
 */
@Repository
public class SysNodeInstanceDao extends BaseDao<SysNodeInstance> implements ISysNodeInstanceDao{
    @Override
    public List<SysNodeInstance> getSysNodeInstanceListByWorkflowInstanceId(Long id) {
        return super.findListByHql("from SysNodeInstance t where t.workflow_instance_id.id=? order by t.id desc",id);
    }

//    @Override
//    public List<SysNodeInstance> findNodeInstancesByWorkflowInstance(SysWorkflowInstance workflowInstance) {
//        return super.findListByHql("from SysNodeInstance t where t.workflow_instance_id=? order by t.id desc",workflowInstance);
//    }

    @Override
    public SysNodeInstance findRunningNode(SysWorkflowInstance workflowInstance) {
        return super.getByHql("from SysNodeInstance t where t.status='1' and t.workflow_instance_id=?",workflowInstance);
    }

    @Override
    public List<SysNodeInstance> getTransactList(Long workflowInstanceId, Long transactNodeid) {
        return super.findListByHql("from SysNodeInstance t where t.workflow_instance_id.id=? and t.node_id.id=? order by t.id desc",workflowInstanceId,transactNodeid);
    }
}
