package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysWorkflowPageDao;
import net.ruixin.domain.plat.workflow.structure.page.SysWorkflowPage;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 流程表单DAO接口实现
 * Created by Jealous on 2016-9-1.
 */
@Repository
public class SysWorkflowPageDao extends BaseDao<SysWorkflowPage> implements ISysWorkflowPageDao {
    @Override
    public SysWorkflowPage get(Long workflowPageId) {
        return super.get(workflowPageId);
    }

    @Override
    public void saveWorkflowPage(SysWorkflowPage workflowPage) {
        super.saveOrUpdate(workflowPage);
    }

    @Override
    public List<SysWorkflowPage> findWorkflowSheetsByWorkflow(Long wId) {
        return super.findListByHql("from SysWorkflowPage t where t.sysWorkflow.id = ? and t.sfyx_st = '1' order by sort",wId);
    }
}
