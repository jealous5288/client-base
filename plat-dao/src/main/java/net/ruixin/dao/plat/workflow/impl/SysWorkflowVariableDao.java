package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysWorkflowVariableDao;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflowVariable;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 流程变量dao实现
 * Created by Jealous on 2016-9-1.
 */
@SuppressWarnings("unused")
@Repository
public class SysWorkflowVariableDao extends BaseDao<SysWorkflowVariable> implements ISysWorkflowVariableDao {
    @Override
    public SysWorkflowVariable get(Long variableId) {
        return super.get(variableId);
    }

    @Override
    public void saveVariable(SysWorkflowVariable workflowVariable) {
        super.saveOrUpdate(workflowVariable);
    }

    @Override
    public List<SysWorkflowVariable> findVariableByWorkflow(SysWorkflow workflow) {
        return super.findListByHql("from SysWorkflowVariable t where t.workflow = ? and t.sfyx_st = '1'", workflow);
    }

    @Override
    public SysWorkflowVariable getByNameAndWfi(String name, SysWorkflow workflow) {
        return super.getByHql("from SysWorkflowVariable t where t.sfyx_st = '1'and t.name = ? and t.workflow = ?", name, workflow);
    }
}
