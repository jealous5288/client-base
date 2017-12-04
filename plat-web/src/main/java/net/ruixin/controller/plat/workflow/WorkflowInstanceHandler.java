package net.ruixin.controller.plat.workflow;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.workflow.instance.SysEntrust;
import net.ruixin.domain.plat.workflow.instance.SysTask;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.service.plat.workflow.*;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.resolver.FormModel;
import net.ruixin.util.resolver.SearchModel;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.*;

/**
 * Created by Jealous on 2016-8-11.
 * 工作流实例部分控制层
 */
@SuppressWarnings({"unused", "MismatchedQueryAndUpdateOfCollection"})
@Controller
@RequestMapping("/workflow/instance")
public class WorkflowInstanceHandler extends BaseController {
    @Autowired
    private IWorkflowInstanceService workflowInstanceService;
    @Autowired
    private IWorkflowService workflowService;
    @Autowired
    private ISysTaskService sysTaskService;
    @Autowired
    private ISysNodeService sysNodeService;
    @Autowired
    private ISysRouterService sysRouterService;
    @Autowired
    private ISysNodeInstanceService sysNodeInstanceService;
    @Autowired
    private ISysEntrustService sysEntrustService;

    /**
     * 根据流程编码启动流程
     *
     * @param flowCode   流程编码
     * @param dataId     业务数据id
     * @param title      流程实例标题
     * @param sourceData 源数据
     */
    @ResponseBody
    @RequestMapping(value = "/startWorkflow")
    public AjaxReturn startWorkflow(String flowCode, String dataId,
                                    String title, String sourceData) {
        Long userId = super.getCurrentUserId();
        SysWorkflow wf = workflowService.findWorkflowsByCode(flowCode);
        if (wf == null) {
            return ERROR.setMsg("流程不存在");
        }
        List<Object> param = new ArrayList<>();
        param.add(wf.getId());
        param.add(userId);
        //流程发起类型:0是人工，1是嵌套
        param.add(0);
        //业务数据ID
        param.add(dataId);
        //流程实例标题
        param.add(title);
        //流程源数据
        param.add(sourceData);
        //调用存储过程,启动流程
        String msg = workflowInstanceService.startup(param);
        //存储过程返回的参数
        String[] msgs = msg.split(",");
        Map<String, Object> map = new HashMap<>();
        AjaxReturn ar = new AjaxReturn();
        if (msgs[0].equals("流程启动成功")) {
            SysTask sysTask = sysTaskService.getTaskByWorkflowInstanceAndUser(Long.valueOf(msgs[1]), userId);
            map.put("url", "/workflow/instance/taskHandle");
            map.put("id", sysTask.getId());
            return SUCCESS.setData(map);
        } else {
            return ERROR.setMsg("流程启动失败");
        }
    }

    @ResponseBody
    @RequestMapping(value = "/startWorkflowAndSubmit")
    public AjaxReturn startWorkflowAndSubmit(String flowCode, String dataId, String opinion) {
        //启动工作流
        AjaxReturn ar = startWorkflow(flowCode, dataId, null, null);
        //提交第一办理环节任务
        if (ar.getSuccess())
            ar = handleTask(Long.parseLong(((Map) (ar.getData())).get("id").toString()),
                    String.valueOf(super.getCurrentUserId()),
                    null, opinion, null, true, null);
        if (ar.getSuccess())
            return SUCCESS;
        return ERROR.setMsg("办理失败");
    }

    /**
     * 签收任务
     *
     * @param id 任务id
     */
    @ResponseBody
    @RequestMapping(value = "/signTask")
    public String signTask(Long id) {
        return workflowInstanceService.signForTask(id);
    }

    /**
     * 办理任务：提交、退回
     *
     * @param id          任务id
     * @param userIds     指定的下一环节办理人ids，逗号分隔
     * @param branch      手动决策的分支条件
     * @param opinion     办理意见
     * @param fj_id       附件id
     * @param agree       操作标志
     * @param autoOpinion 自动办理的意见
     */
    @ResponseBody
    @RequestMapping(value = "/handleTask")
    public AjaxReturn handleTask(Long id, String userIds, String branch, String opinion,
                                 String fj_id, Boolean agree, String autoOpinion) {
        List<Object> param = new ArrayList<>();
        param.add(id);
        param.add(RxStringUtils.isNotEmpty(userIds) ? userIds : "");
        param.add(branch);
        param.add(opinion);
        param.add(fj_id);
        param.add(agree ? "1" : "0");
        String result;
        AjaxReturn ar = new AjaxReturn();
        result = workflowInstanceService.transact(param, autoOpinion);
        ar.setSuccess(false).setMsg(result);
        if (result.contains("提交成功")) {
            workflowInstanceService.processJava(id, branch, opinion, fj_id);
            ar.setSuccess(true);
        } else if (result.contains("退回成功")) {
            workflowInstanceService.processJava(id, branch, opinion, fj_id);
            ar.setSuccess(true);
        }
        return ar;
    }

    /**
     * 获取特送退回的环节树
     *
     * @param taskId 任务ID
     */
    @ResponseBody
    @RequestMapping(value = "/getSpecialBackTree", method = RequestMethod.POST)
    public List getSpecialBackTree(@RequestParam("taskId") Long taskId) {
        return workflowInstanceService.getSpecialBackTree(taskId);
    }

    /**
     * 特送退回
     *
     * @param taskId  任务实例id
     * @param nodeId  环节id
     * @param opinion 办理意见
     */
    @ResponseBody
    @RequestMapping("/specialBackTo")
    public AjaxReturn specialBackTo(Long taskId, Long nodeId, String opinion, String fj_id) {
        SysTask sysTask = sysTaskService.get(taskId);
        String result = workflowInstanceService.specialBack(sysTask.getNode_instance_id().getId(), nodeId, opinion, fj_id);
        if (RxStringUtils.isEmpty(result)) {
            workflowInstanceService.processJava(taskId, "", "特送退回", fj_id);
            return SUCCESS;
        } else {
            return ERROR.setMsg(result);
        }
    }

    /**
     * 退回
     *
     * @param id     任务实例ID
     * @param reason 意见
     * @param branch 决策分支
     * @param fj_id  附件ID
     */
    @ResponseBody
    @RequestMapping(value = "/backTask")
    public AjaxReturn backTask(Long id, String reason, String branch, String fj_id) {
        List<Object> param = new ArrayList<>();
        param.add(id);
        param.add(reason);
        param.add(branch);
        String result = workflowInstanceService.returned(param);
        if ("退回成功".equals(result)) {
            workflowInstanceService.processJava(id, branch, reason, fj_id);
            return SUCCESS.setMsg(result);
        }
        return ERROR.setMsg(result);
    }

    /**
     * 撤回
     *
     * @param id 任务实例ID
     */
    @ResponseBody
    @RequestMapping(value = "/withdraw")
    public AjaxReturn withdraw(Long id) {
        String result = workflowInstanceService.withdraw(id);
        if ("撤回成功".equals(result)) {
            workflowInstanceService.processJava(id, null, "撤回", null);
            return SUCCESS.setMsg(result);
        } else {
            return ERROR.setMsg(result);
        }
    }

    /**
     * 删除流程相关数据
     *
     * @param taskId 任务实例ID
     */
    @ResponseBody
    @RequestMapping(value = "/deleteWorkflowInstance")
    public AjaxReturn deleteWorkflowInstance(Long taskId) {
        workflowInstanceService.delWorkflowInstance(sysTaskService.get(taskId).getWorkflow_instance_id().getId());
        return SUCCESS;
    }

    /**
     * 获取最新的任务实例ID
     *
     * @param flowCode 流程编码
     * @param dataId   数据ID
     */
    @ResponseBody
    @RequestMapping(value = "/getNewestTaskId")
    public AjaxReturn getNewestTaskId(String flowCode, Long dataId) {
        AjaxReturn ajaxReturn = new AjaxReturn();
        //以流程编码获取流程，并填入id参数
        SysWorkflow wf = workflowService.findWorkflowsByCode(flowCode);
        if (wf == null) {
            return new AjaxReturn(false, null, "流程不存在");
        }
        Long taskId = workflowInstanceService.getNewestTaskId(wf.getId(), dataId, super.getCurrentUserId());
        if (taskId == null)
            ajaxReturn.setSuccess(true).setMsg("未找到最新的任务实例ID");
        else
            ajaxReturn.setSuccess(true).setData(taskId);
        return ajaxReturn;
    }

    /**
     * 通过流程实例获取最新的任务实例ID
     *
     * @param wiId 流程实例ID
     */
    @ResponseBody
    @RequestMapping(value = "/getNewestTaskIdByWiId")
    public AjaxReturn getNewestTaskIdByWiId(Long wiId) {
        AjaxReturn ajaxReturn = new AjaxReturn();
        Long taskId = workflowInstanceService.getNewestTaskIdByWiId(wiId, super.getCurrentUserId());
        if (taskId == null)
            ajaxReturn.setSuccess(true).setMsg("未找到最新的任务实例ID");
        else
            ajaxReturn.setSuccess(true).setData(taskId);
        return ajaxReturn;
    }

    /**
     * 获取工作流中的流程表单URL
     *
     * @param flowCode 流程编码
     * @param dataId   数据ID
     */
    @ResponseBody
    @RequestMapping(value = "/getWorkflowSheetUrl")
    public AjaxReturn getWorkflowSheetUrl(String flowCode, Long dataId) {
        return SUCCESS.setData(workflowInstanceService.getWorkflowSheetUrl(flowCode, dataId));
    }

    /**
     * 获取任务办理页面Json
     *
     * @param id      任务ID
     * @param manager 是否可以办理
     * @param isCheck 是否流程查看
     */
    @ResponseBody
    @RequestMapping(value = "/getTaskHandleJson")
    public AjaxReturn getTaskHandleJson(Long id, Boolean manager, Boolean isCheck) {
        return SUCCESS.setData(sysTaskService.generateTaskHandleJson(id, manager, isCheck, super.getCurrentUserId()));
    }

    @ResponseBody
    @RequestMapping(value = "/getTaskHandleByCode")
    public AjaxReturn getTaskHandleByCode(String flowCode) {
        return SUCCESS.setData(sysTaskService.generateTaskHandleJson(flowCode));
    }

    /**
     * 获取流程办理页面的数据
     *
     * @param id 任务ID
     */
    @SuppressWarnings("unchecked")
    @ResponseBody
    @RequestMapping(value = "/getHandleData")
    public AjaxReturn getHandleData(Long id, Boolean agree, String flowCode) {
        Map result = new HashMap();
        String info = "";
        String nodeName = "";
        List blrList = null;
        List tempList = workflowInstanceService.getBlrList(id, agree, "");
        if (tempList.size() > 0) {
            String r = tempList.get(1).toString();
            if (!"取出失败".equals(r)) {
                if ("下一环节是结束环节".equals(r)) {
                    info = "endNode";
                } else {
                    String[] rs = r.split(",");
                    nodeName = rs[1];
                    blrList = (List) tempList.get(0);
                    if (blrList == null || blrList.size() == 0) {
                        info = "noPeople";
                    }
                }
            }
        }
        //节点名称
        result.put("nodeName", nodeName);
        //办理人列表
        result.put("blrList", blrList);
        //页面信息标志
        result.put("info", info);
        //是否显示附件按钮
        result.put("sfbxscfj", Objects.equals(sysTaskService.get(id).getNode_instance_id().getNode_id().getSfbxscfj(), "1"));
        if (RxStringUtils.isNotEmpty(flowCode)) {
            //根据流程编码、业务数据id 查询sql维护的动态角色是否正常——wcy 17/2/22
            Long dataId = workflowInstanceService.getDataIdByTaskId(id);
            result.put("data_id", dataId);
            if (RxStringUtils.isNotEmpty(dataId)) {
                String s = workflowInstanceService.hasDynamicUser(flowCode, dataId);
                if (s.length() > 1) {
                    result.put("hasDynamicUser", false);
                    result.put("msg", s.substring(2));
                } else {
                    result.put("hasDynamicUser", true);
                }
            }
        }
        return SUCCESS.setData(result);
    }

    /**
     * 是否能退回任务
     *
     * @param id 任务ID
     */
    @ResponseBody
    @RequestMapping(value = "/isBackTask")
    public AjaxReturn isBackTask(Long id) {
        return SUCCESS.setData(sysTaskService.isReturned(sysTaskService.get(id)));
    }

    /**
     * 下一环节办理人
     *
     * @param rwid     任务ID
     * @param decision 意见
     */
    @SuppressWarnings("unchecked")
    @ResponseBody
    @RequestMapping(value = "/getBlrList")
    public AjaxReturn getBlrList(Long rwid, String decision) throws UnsupportedEncodingException {
        if (RxStringUtils.isNotEmpty(decision)) {
            decision = URLDecoder.decode(URLDecoder.decode(decision, "UTF-8"), "UTF-8");
        }
        FastPagination fastPagination = new FastPagination();
        String checkNextNode = "";
        List result = workflowInstanceService.getBlrList(rwid, true, decision);
        if (result.size() > 0) {
            List list = (List) result.get(0);
            fastPagination.setRows(list);
            if ("下一环节是结束环节".equals(result.get(1))) {
                checkNextNode = "endNode";
            } else if (list == null || list.size() == 0) {
                checkNextNode = "noPeople";
            }
        }
        return SUCCESS.setMsg(checkNextNode).setData(fastPagination);
    }

    /**
     * 获取环节实例列表数据
     *
     * @param id 流程实例ID
     * @return 环节实例列表
     */
    @ResponseBody
    @RequestMapping(value = "/getSimpleWorkflowJSON")
    public AjaxReturn getSimpleWorkflowJSON(Long id) {
        return new AjaxReturn().setSuccess(true).setData(workflowInstanceService.getSimpleWorkflowJSON(id));
    }

    /**
     * 任务列表
     *
     * @param wfiId  流程实例ID
     * @param nodeId 环节ID
     */
    @ResponseBody
    @RequestMapping(value = "/taskPage")
    public AjaxReturn taskPage(Long wfiId, Long nodeId) {
        return SUCCESS.setData(sysTaskService.taskPage(wfiId, nodeId));
    }

    //保存表单草稿数据
    @ResponseBody
    @RequestMapping(value = "/saveTmpData")
    public AjaxReturn saveTmpData(Long taskId, Long nodePageId, String tmpData) {
        workflowInstanceService.updateTmpData(taskId, nodePageId, tmpData);
        return SUCCESS;
    }

    //批量办理流程
    @ResponseBody
    @RequestMapping(value = "/batchProcessWf")
    public AjaxReturn batchProcessWf(String wfiIds, String opinion, String handleTag) {
        return SUCCESS.setData(workflowInstanceService.batchProcess(super.getCurrentUserId(), wfiIds, opinion, handleTag));
    }

    //获取流程意见
    @ResponseBody
    @RequestMapping(value = "/getNodePageOpinion")
    public AjaxReturn getNodePageOpinion(Long wiId, Long spId) {
        return SUCCESS.setData(sysTaskService.getNodePageOpinion(wiId, spId));
    }

    /**
     * 委办列表
     *
     * @param map 搜索条件
     */
    @ResponseBody
    @RequestMapping(value = "/getEntrustList")
    public AjaxReturn getEntrustList(@SearchModel Object map) {
        return SUCCESS.setData(sysEntrustService.getEntrustList((Map) map, super.getCurrentUserId()));
    }

    /*
    * 获取委办实体*/
    @ResponseBody
    @RequestMapping(value = "/getEntrustById")
    public AjaxReturn getEntrustById(Long id) {
        return SUCCESS.setData(sysEntrustService.getEntrustById(id));
    }

    /*
    * 保存委托
    */
    @ResponseBody
    @RequestMapping(value = "/saveEntrust")
    public AjaxReturn saveEntrust(@FormModel SysEntrust sysEntrust) {
        Boolean isCanSave = sysEntrustService.checkTime(sysEntrust, super.getCurrentUserId());
        if (isCanSave) {
            sysEntrust.setUserId(super.getCurrentUserId());
            return SUCCESS.setData(sysEntrustService.saveEntrust(sysEntrust));
        } else {
            return ERROR.setMsg("时间有误");
        }
    }

    /*
    * 停止委办
    */
    @ResponseBody
    @RequestMapping(value = "stopEntrust")
    public AjaxReturn stopEntrust(Long id) {
        sysEntrustService.stopEntrust(id);
        return SUCCESS;
    }

    /**
     * 获取流程意见
     *
     * @param wiId 流程实例ID
     */
    @ResponseBody
    @RequestMapping(value = "/getFlowOpinion")
    public AjaxReturn getFLowOpinion(Long wiId) {
        return SUCCESS.setData(workflowInstanceService.getPageOpinionWithCode(wiId));
    }

}
