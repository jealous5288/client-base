package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysNodeVariableAssignDao;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.node.SysNodeVariableAssign;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 环节变量DAO接口实现
 * Created by Jealous on 2016-9-1.
 */
@SuppressWarnings("unused")
@Repository
public class SysNodeVariableAssignDao extends BaseDao<SysNodeVariableAssign> implements ISysNodeVariableAssignDao {
    @Override
    public SysNodeVariableAssign get(Long nodeVariableId) {
        return super.get(nodeVariableId);
    }

    @Override
    public void saveSysNodeVariableAssign(SysNodeVariableAssign nodeVariableAssign) {
        super.saveOrUpdate(nodeVariableAssign);
    }

    @Override
    public List<SysNodeVariableAssign> findNodeVariableAssignByWorkflow(SysWorkflow workflow) {
        return super.findListByHql("from SysNodeVariableAssign t where t.workflowVariable.workflow = ? and t.sfyx_st = '1'",workflow);
    }
}
