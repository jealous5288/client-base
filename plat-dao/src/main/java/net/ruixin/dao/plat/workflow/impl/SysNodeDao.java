package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysNodeDao;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.node.SysActivityNode;
import net.ruixin.domain.plat.workflow.structure.node.SysDecisionNode;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.domain.plat.workflow.structure.node.SysTransactNode;
import net.ruixin.util.hibernate.BaseDao;
import oracle.jdbc.OracleTypes;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Jealous on 2016-8-10.
 * 环节Dao实现
 */
@SuppressWarnings({"unused", "SqlDialectInspection", "SqlNoDataSourceInspection"})
@Repository
public class SysNodeDao extends BaseDao<SysNode> implements ISysNodeDao {
    @Override
    public List<SysNode> findNodesByWorkflow(SysWorkflow workflow) {
        return super.findListByHql("from SysNode t where t.sysWorkflow = ? and t.sfyx_st = '1'", workflow);
    }

    @Override
    public SysTransactNode getTransactNode(Long id) {
        return (SysTransactNode) super.getByHql("from SysTransactNode s where s.id = ? and s.sfyx_st = '1'", id);
    }


    @Override
    public void save(SysNode node) {
        super.saveOrUpdate(node);
    }

    @Override
    public SysActivityNode getActivityNode(Long id) {
        return (SysActivityNode) super.getByHql("from SysActivityNode s where id = ?", id);
    }

    @Override
    public SysDecisionNode getDecisionNode(Long id) {
        return (SysDecisionNode) super.getByHql("from SysDecisionNode s where id = ?", id);
    }

    @Override
    public SysNode get(Long id) {
        return super.get(id);
    }

    @Override
    public List findNextTransactNodes(Long nodeId, String branch, Long wid) {
        List<Object> param = new ArrayList<>();
        param.add(nodeId);
        param.add(branch);
        param.add(wid);
        List<Integer> data = new ArrayList<>();
        data.add(OracleTypes.CURSOR);
        data.add(OracleTypes.VARCHAR);
        return super.prepareCallAndReturnCustom("{call PKG_WF.USP_WORKFLOW_NEXT_NODE(?,?,?,?,?,?)}", param, data);
    }


}
