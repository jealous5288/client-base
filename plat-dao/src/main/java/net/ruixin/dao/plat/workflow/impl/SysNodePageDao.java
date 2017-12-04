package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysNodePageDao;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.page.SysNodePage;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 环节页面DAO接口实现
 * Created by Jealous on 2016-9-1.
 */
@SuppressWarnings("unused")
@Repository
public class SysNodePageDao extends BaseDao<SysNodePage> implements ISysNodePageDao {
    @Override
    public SysNodePage get(Long nodePageId) {
        return super.get(nodePageId);
    }

    @Override
    public void saveSysNodePage(SysNodePage nodePage) {
        super.saveOrUpdate(nodePage);
    }

    @Override
    public List<SysNodePage> findNodePagesByWorkflow(SysWorkflow workflow) {
        return super.findListByHql("from SysNodePage t where t.node.sysWorkflow = ? and t.sfyx_st = '1'",workflow);
    }
}
