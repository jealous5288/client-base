package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.IWorkflowTypeDao;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflowType;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Jealous on 2016-8-11.
 * 流程类别Dao实现
 */
@SuppressWarnings({"SqlDialectInspection", "unused", "SqlNoDataSourceInspection"})
@Repository
public class WorkflowTypeDao extends BaseDao<SysWorkflowType> implements IWorkflowTypeDao {
    @Override
    public SysWorkflowType get(Long workflowTypeId) {
        return super.get(workflowTypeId);
    }

    @Override
    public List<SysWorkflowType> findByParent(Long id) {
        return super.findListByHql("from SysWorkflowType t where t.parent_id = ? and t.sfyx_st = '1'", id);
    }

    @Override
    public List<SysWorkflowType> findTops() {
        return super.findListByHql("from SysWorkflowType t where (t.parent_id is null or t.parent_id = 1) and t.sfyx_st = '1' order by id asc");
    }

    @Override
    public boolean del(Long id) {
        super.delete(id);
        return true;
    }

    @Override
    public boolean save(SysWorkflowType sysWorkflowType) {
        super.saveOrUpdate(sysWorkflowType);
        return true;
    }

    @Override
    public Integer hasChildrenWorkflowTypes(Long id) {
        String sql = "select count(1) from SYS_WORKFLOW_TYPE t where t.sfyx_st = '1' and t.PARENT_ID = ?";
        return super.getJdbcTemplate().queryForObject(sql, Integer.class, id);
    }
}
