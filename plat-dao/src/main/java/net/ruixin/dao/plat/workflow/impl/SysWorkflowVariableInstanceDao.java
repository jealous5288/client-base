package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysWorkflowVariableInstanceDao;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowVariableInstance;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflowVariable;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

/**
 * 流程变量实例DAO接口
 * <p>
 * Created by Jealous on 2016-11-7.
 */
@Repository
public class SysWorkflowVariableInstanceDao extends BaseDao<SysWorkflowVariableInstance> implements ISysWorkflowVariableInstanceDao {
    @Override
    public SysWorkflowVariableInstance getByVariableAndWfi(SysWorkflowVariable workflowVariable, SysWorkflowInstance workflowInstance) {
        return super.getByHql("from SysWorkflowVariableInstance t where t.workflow_instance_id = ? and t.variable_id = ? and t.sfyx_st = '1'", workflowInstance, workflowVariable);
    }

    @Override
    public void save(SysWorkflowVariableInstance swvi) {
        super.getSession().saveOrUpdate(swvi);
    }
}
