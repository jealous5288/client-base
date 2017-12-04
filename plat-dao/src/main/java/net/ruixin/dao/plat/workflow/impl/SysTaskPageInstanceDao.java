package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysTaskPageInstanceDao;
import net.ruixin.domain.plat.workflow.instance.SysTaskPageInstance;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 任务表单实例DAO
 */
@SuppressWarnings("unused")
@Repository
public class SysTaskPageInstanceDao extends BaseDao<SysTaskPageInstance> implements ISysTaskPageInstanceDao {
    @Override
    public List<SysTaskPageInstance> findByTask(Long id) {
        return super.findListByHql("from SysTaskPageInstance t where t.sysTask.id = ? order by t.sysNodePage.sort", id);
    }

    @Override
    public void updateTaskPageInstanceData(Long dataId, Long taskId, Long nodePageId) {
        super.executeHqlUpdate("update SysTaskPageInstance t set data_id = ? where t.sysTask.id = ? and t.sysNodePage.id = ?", dataId, taskId, nodePageId);
    }

    @Override
    public void updateTmpData(Long taskId, Long nodePageId, String tmpData) {
        super.executeHqlUpdate("update SysTaskPageInstance t set tmp_data_json = ? where t.sysTask.id = ? and t.sysNodePage.id = ?", tmpData, taskId, nodePageId);
    }
}
