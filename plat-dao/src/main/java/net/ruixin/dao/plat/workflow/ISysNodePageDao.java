package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.page.SysNodePage;

import java.util.List;

/**
 * 环节页面DAO接口
 * Created by Jealous on 2016-9-1.
 */
public interface ISysNodePageDao {
    /**
     * 获取环节表单
     *
     * @param nodePageId 环节表单ID
     * @return 环节表单
     */
    SysNodePage get(Long nodePageId);

    /**
     * 保存环节表单
     * @param nodePage 环节表单
     */
    void saveSysNodePage(SysNodePage nodePage);

    /**
     * 获取流程中的所有环节表单
     * @param workflow 工作流
     * @return 环节表单List
     */
    List<SysNodePage> findNodePagesByWorkflow(SysWorkflow workflow);
}
