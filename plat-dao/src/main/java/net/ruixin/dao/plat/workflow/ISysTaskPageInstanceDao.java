package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.instance.SysTaskPageInstance;

import java.util.List;

/**
 * 任务表单实例DAO接口
 */
public interface ISysTaskPageInstanceDao {
    /**
     * 根据任务查找任务表单
     * @param id 任务id
     * @return 任务表单
     */
    List<SysTaskPageInstance> findByTask(Long id);

    /**
     * 更新任务表单数据ID
     * @param dataId 数据ID
     * @param taskId 任务ID
     * @param nodePageId 环节表单ID
     */
    void updateTaskPageInstanceData(Long dataId, Long taskId, Long nodePageId);

    /**
     * 更新任务表单临时数据
     * @param taskId
     * @param nodePageId
     * @param tmpData
     */
    void updateTmpData(Long taskId, Long nodePageId, String tmpData);
}
