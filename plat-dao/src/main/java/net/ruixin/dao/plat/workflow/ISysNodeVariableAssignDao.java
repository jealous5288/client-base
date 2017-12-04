package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.node.SysNodeVariableAssign;

import java.util.List;

/**
 * 环节变量DAO接口
 * Created by Jealous on 2016-9-1.
 */
public interface ISysNodeVariableAssignDao {
    /**
     * 获取环节变量
     * @param nodeVariableId 环节变量ID
     * @return 环节变量实体
     */
    SysNodeVariableAssign get(Long nodeVariableId);

    /**
     * 保存环节变量
     * @param nodeVariableAssign 环节变量
     */
    void saveSysNodeVariableAssign(SysNodeVariableAssign nodeVariableAssign);

    /**
     * 通过流程查找所有的环节变量
     * @param workflow 流程实体
     * @return 环节变量list
     */
    List<SysNodeVariableAssign> findNodeVariableAssignByWorkflow(SysWorkflow workflow);
}
