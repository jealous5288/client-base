package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.enumerate.plat.JbWfData;

import java.util.List;
import java.util.Map;

/**
 * Created by Jealous on 2016-8-16.
 * 流程实例类DAO接口
 */
public interface IWorkflowInstanceDao {
    /**
     * 签收任务
     *
     * @param id 任务ID
     * @return 签收结果
     */
    String signForTask(Long id);

    /**
     * 办理任务
     *
     * @param param 参数
     * @return 办理结果
     */
    String transact(List param);

    /**
     * 启动流程
     *
     * @param param 启动参数
     * @return 返回结果
     */
    String startup(List<Object> param);

    /**
     * 退回
     *
     * @param param 退回参数
     * @return 返回结果
     */
    String returned(List<Object> param);

    /**
     * 撤回
     *
     * @param id 任务实例ID
     * @return 返回结果
     */
    String withdraw(Long id);

    /**
     * 删除
     *
     * @param wiId 流程实例ID
     */
    String delWorkflowInstance(Long wiId);

    /**
     * 通过流程ID获取环节表单数
     *
     * @param wid 流程ID
     * @return 环节表单数
     */
    int getNodeSheetcount(Long wid);

    /**
     * 获取最新的任务ID
     *
     * @param wId    流程ID
     * @param dataId 数据ID
     * @param userid 用户ID
     * @return 任务ID
     */
    Long getNewestTaskId(Long wId, Long dataId, Long userid);

    Long getNewestTaskIdByWiId(Long wiId, Long userid);

    /**
     * 获取办理人
     *
     * @param rwid     任务ID
     * @param agree    是否同意
     * @param decision 决策条件
     * @return 办理人list
     */
    List getBlrList(Long rwid, Boolean agree, String decision);

    /**
     * 更新流程数据
     *
     * @param dataId 数据ID
     * @param wiId   流程实例ID
     * @param title  标题
     */
    void updateWorkflowInstanceData(Long dataId, Long wiId, String title);

    List<Map<String, Object>> getSpecialBackTree(Long taskId);

    /**
     * 获取流程实例对象
     *
     * @param id 流程实例ID
     * @return 流程实例对象
     */
    SysWorkflowInstance get(Long id);

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
     * 更新流程业务数据
     *
     * @param em    业务枚举
     * @param value 值D
     */
    void updateWfiBd(JbWfData em, Object value, Long wiId);

    /**
     * 插入流程涉及人员
     *
     * @param wiId 流程实例Id
     * @param nId  流程环节Id
     * @param ids  人员ids字符串，id以逗号隔开
     */
    void insertWorkflowAdditionUsers(Long wiId, Long nId, String ids);

    SysWorkflowInstance getById(Long id);

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

    void updateSysGlbBizWf(Long dataId, Long wiId);
}
