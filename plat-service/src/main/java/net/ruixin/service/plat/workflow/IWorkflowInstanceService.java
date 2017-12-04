package net.ruixin.service.plat.workflow;

import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.util.data.FlowParam;

import java.util.List;

/**
 * Created by Jealous on 2016-8-16.
 * 流程实例接口
 */
@SuppressWarnings("unused")
public interface IWorkflowInstanceService {

    /**
     * 发起流程
     *
     * @param param 发起参数
     * @return 返回结果
     */
    String startup(List<Object> param);

    /**
     * 签收任务
     *
     * @param id 任务id
     * @return 操作结果
     */
    String signForTask(Long id);

    /**
     * 办理任务
     *
     * @param param 办理参数
     * @return 操作结果
     */
    String transact(List param, String autoOpinion);

    /**
     * 执行流程后置逻辑
     *
     * @param id      任务实例ID
     * @param branch  决策分支
     * @param opinion 办理意见
     * @param fj_id   附件ID
     */
    void processJava(Long id, String branch, String opinion, String fj_id);

    /**
     * 退回
     *
     * @param param 退回参数
     * @return 操作结果
     */
    String returned(List<Object> param);

    /**
     * 撤回
     *
     * @param id 任务实例ID
     * @return 操作结果
     */
    String withdraw(Long id);

    /**
     * 删除流程实例
     *
     * @param wiId    流程实例ID
     */
    String delWorkflowInstance(Long wiId);

    /**
     * 获取最新的任务ID
     *
     * @param wId    工作流实例ID
     * @param dataId 数据ID
     * @param userid 用户ID
     * @return 任务ID
     */
    Long getNewestTaskId(Long wId, Long dataId, Long userid);

    /**
     * 获取最新的任务ID
     *
     * @param wiId   工作流实例ID
     * @param userid 用户ID
     * @return 任务ID
     */
    Long getNewestTaskIdByWiId(Long wiId, Long userid);

    /**
     * 获取工作流表单地址
     *
     * @param flowCode 流程实例ID
     * @param dataId   数据ID
     * @return 表单地址
     */
    String getWorkflowSheetUrl(String flowCode, Long dataId);

    /**
     * 获取办理人列表
     *
     * @param rwid     任务ID
     * @param agree    是否同意
     * @param decision 决策调教
     * @return 办理人List
     */
    List getBlrList(Long rwid, Boolean agree, String decision);

    /**
     * 更新流程实例数据接口
     *
     * @param param  流程办理参数
     * @param dataId 数据ID
     * @param title  标题
     */
    void updateWorkflowInstanceData(FlowParam param, Long dataId, String title);

    /**
     * 更新业务流程关联表中data_id （首次保存业务数据、保存草稿时调用）
     *
     * @param dataId 业务数据id
     * @param wiId   流程实例id
     */
    void updateSysGlbBizWf(Long dataId, Long wiId);

    /**
     * 更新任务表单实例数据接口
     *
     * @param param  流程办理参数
     * @param dataId 数据ID
     */
    void updateTaskPageInstanceData(FlowParam param, Long dataId);

    /**
     * 更新任务表单tmpData
     *
     * @param taskId     任务ID
     * @param nodePageId 环节表单ID
     * @param tmpData    临时保存数据
     */
    void updateTmpData(Long taskId, Long nodePageId, String tmpData);

    /**
     * 获取特送退回的环节树
     *
     * @param taskId 任务ID
     */
    List getSpecialBackTree(Long taskId);

    /**
     * 获取环节实例列表数据
     *
     * @param id 流程实例ID
     * @return 环节实例列表
     */
    Object getSimpleWorkflowJSON(Long id);

    /**
     * 流程批量办理
     *
     * @param userId    用户ID
     * @param wfiIds    流程实例ID序列
     * @param opinion   批量办理意见
     * @param handleTag 办理结果标识
     */
    String batchProcess(Long userId, String wfiIds, String opinion, String handleTag);

    /**
     * 初始化一个环节中需要的变量
     *
     * @param param 流程办理参数
     * @param name  变量名称
     * @param value 变量的值
     * @return 赋值结果
     */
    boolean initVariable(FlowParam param, String name, String value);

    /**
     * 获取流程意见（暂为实现打印，包含页面编码）
     *
     * @param wiId 流程实例Id
     * @return 赋值结果
     */
    List getPageOpinionWithCode(Long wiId);

    /**
     * 插入流程涉及人员
     *
     * @param param 流程参数
     * @param ids   人员ids字符串，id以逗号隔开
     */
    void insertWorkflowAdditionUsers(FlowParam param, String ids);

    SysWorkflowInstance getById(Long id);

    /**
     * 根据流程实例查找运行中的环节
     *
     * @param win 流程实例
     * @return sysNode
     */
    SysNode findRunningNode(SysWorkflowInstance win);

    String hasDynamicUser(String flowCode, Long dataId);

    /**
     * 更新环节页面实例表中path
     *
     * @param path   文件名/路径
     * @param pageId 页面id
     * @param winId  流程实例id
     */
    void updateWordpath(String path, Long pageId, Long winId);

    /**
     * 根据任务id查找业务数据id
     *
     * @param id 任务id
     * @return 业务数据id
     */
    Long getDataIdByTaskId(Long id);

    /**
     * 特送退回
     *
     * @param nodeInstanceId 环节实例id
     * @param nodeId         环节id
     * @param opinion        办理意见
     * @return string
     */
    String specialBack(Long nodeInstanceId, Long nodeId, String opinion, String fj_id);
}
