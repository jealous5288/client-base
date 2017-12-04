package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysNodeButtonDao;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.domain.plat.workflow.structure.node.SysNodeButton;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 环节button
 */

@Repository
public class SysNodeButtonDao extends BaseDao<SysNodeButton> implements ISysNodeButtonDao {

    @Override
    public List<SysNodeButton> findNodeButtonByWorkflow(SysWorkflow workflow) {
        return super.findListByHql("from SysNodeButton t where t.node.sysWorkflow = ? and t.sfyx_st = '1'",workflow);
    }

    @Override
    public SysNodeButton get(Long nodeButtonId) {
        return super.get(nodeButtonId);
    }

    @Override
    public void saveSysNodeButton(SysNodeButton nodeButton) {
        super.saveOrUpdate(nodeButton);
    }

    @Override
    public List<SysNodeButton> findNodeButtonByNode(SysNode sysNode) {
        return super.findListByHql("from SysNodeButton t where t.node = ? and t.sfyx_st = '1' order by t.sort",sysNode);
    }
}
