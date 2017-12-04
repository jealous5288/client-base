package net.ruixin.service.plat.workflow.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.ruixin.dao.plat.workflow.*;
import net.ruixin.domain.plat.auth.SysPage;
import net.ruixin.domain.plat.organ.SysOrgan;
import net.ruixin.domain.plat.workflow.instance.SysNodeInstance;
import net.ruixin.domain.plat.workflow.instance.SysTask;
import net.ruixin.domain.plat.workflow.instance.SysTaskPageInstance;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.domain.plat.workflow.structure.node.SysActivityNode;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.domain.plat.workflow.structure.page.SysNodePage;
import net.ruixin.enumerate.plat.NodeType;
import net.ruixin.enumerate.plat.SheetMode;
import net.ruixin.enumerate.plat.TaskAction;
import net.ruixin.service.plat.organ.IOrganService;
import net.ruixin.service.plat.workflow.ISysNodeInstanceService;
import net.ruixin.service.plat.workflow.ISysNodeService;
import net.ruixin.service.plat.workflow.ISysTaskService;
import net.ruixin.util.hibernate.HibernateProxyUtil;
import net.ruixin.util.json.JacksonMapper;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 任务实例类操作接口实现
 * Created by Jealous on 2016-8-23.
 */
@SuppressWarnings("unused")
@Service
@Transactional
public class SysTaskService implements ISysTaskService {
    @Autowired
    private ISysTaskDao sysTaskDao;

    @Autowired
    private ISysTaskPageInstanceDao sysTaskPageInstanceDao;

    @Autowired
    private ISysNodeService sysNodeService;

    @Autowired
    private ISysNodeInstanceService sysNodeInstanceService;

    @Autowired
    private ISysNodeInstanceDao sysNodeInstanceDao;

    @Autowired
    private IOrganService organService;

    @Autowired
    public ISysWorkflowVariableDao sysWorkflowVariableDao;

    @Autowired
    public ISysWorkflowVariableInstanceDao sysWorkflowVariableInstanceDao;

    @Autowired
    private ISysNodeButtonDao buttonDao;

    @Autowired
    private IWorkflowDao workflowDao;

    @Override
    public SysTask get(Long id) {
        return sysTaskDao.get(id);
    }

    @Override
    @SuppressWarnings("unchecked")
    public Map generateTaskHandleJson(Long id, Boolean manager, Boolean isCheck, Long userId) {
        SysTask task = get(id);//获取任务实例
        String status = "已办";
        //标识用户不可以循环打开流程监控和任务办理页面
        Boolean cycleFlag = false;
        //当为空时，表示初始化
        if (isCheck == null) {
            isCheck = false;
        }
        //如果节点任务已完成，则已签收
        if ("2".equals(task.getNode_instance_id().getStatus())) {
            isCheck = true;
        }
        //为空时，默认为可编辑表单状态
        if (manager == null) {
            manager = true;
        }
        //任务办理人与当前登录用户相同
        Boolean isMe = task.getUser_id().getId().equals(userId);

        //当登录用户和任务用户相同时，默认为可编辑状态  is_finish-是否完成：0未完成 ,1完成
        if (isCheck && isMe && "0".equals(task.getIs_finish())) {
            isCheck = false;
            cycleFlag = true;
            manager = true;
        }

        if (isMe) { //任务状态,0待办1在办2已办3抢占终止4会签终止5传阅终止6异步终止7被撤回8被退回
            status = task.getStatus().name;
        }
        Boolean isFirstNode = isFristNode(task); //是否开始环节
        //按时间升序排列 任务实例list
        List<SysTask> list = findTasksByWorkflowInstance(task.getWorkflow_instance_id().getId());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        List taskList = new ArrayList();
        for (SysTask it : list) {
            if (it.getFinish_date() != null && it.getOpinion() != null) {
                Map taskMap = new HashMap();
                SysOrgan organ = it.getUser_id().getDefault_organ_id() != null ? organService.getOrganById(it.getUser_id().getDefault_organ_id()) : null;
                String name = (organ != null ? organ.getOrganName() : "无组织") + "：" + it.getUser_id().getUserName();
                taskMap.put("id", it.getId()); //任务id
                taskMap.put("handler", name);
                taskMap.put("handleDate", sdf.format(it.getFinish_date())); //结束时间
                taskMap.put("opinion", it.getOpinion().replace("\n", "")); // 环节意见
                taskMap.put("pageOpinion", RxStringUtils.isNotEmpty(it.getPageOpinion()) ? it.getPageOpinion().replace("\n", "") : ""); //页面意见
                taskMap.put("fjs", it.getFjs()); //附件数
                taskMap.put("fj_id", it.getFj_id()); //附件ID
                taskList.add(taskMap);
            }
        }
        if (isFirstNode) { //是否开始环节
            // 判断是否有环节表单
            Boolean isSheetDrive = isSheetDrive(task); //判断是否有环节表单
            if (isSheetDrive) {
                isFirstNode = false;
            }
        }
        // 任务是否能退回
        Boolean canBackTask = isMe ? isReturned(task) : isMe;

        Boolean flg; //??
        flg = !isCheck && !status.equals("已办");
        if ("0".equals(task.getWorkflow_instance_id().getStatus())) { //流程实例状态：0完成
            flg = false;
        }
        // 获取流程环节表单
        List<Map<String, Object>> sheetList = findSheetByTask(task, flg, task.getWorkflow_instance_id().getStatus());
        String handleType = "EDIT"; //环节页面的办理状态 编辑
        for (Map sheet : sheetList) {
            if (sheet.get("sheetMode").equals(1)) {
                handleType = "EXAMINE"; //审批
                break;
            }
        }
        // 显示撤回
        Boolean showCancel = false;
        if (isMe && isCheck && task.getNode_instance_id().getNode_id().getType() == NodeType.ACTIVITY_NODE
                && "2".equals(task.getWorkflow_instance_id().getStatus())) //流程实例状态 运行
            showCancel = true;
        if (showCancel) {
            List<SysNodeInstance> transactList = sysNodeInstanceService.getTransactListByWorkflowInstanceId(task.getWorkflow_instance_id().getId());
            if (transactList.size() > 1) {
                SysNodeInstance submitNodeInstance = transactList.get(1);
                if (Objects.equals(submitNodeInstance.getNode_id().getId(), task.getNode_instance_id().getNode_id().getId())) {
                    SysNodeInstance nodeInstance = transactList.get(0);
                    List<SysTask> sysTaskList = findTasksByNodeInstanceId(nodeInstance.getId());
                    for (SysTask sysTask : sysTaskList) {
                        if (!sysTask.getAction().name.equals(TaskAction.NONE.name)) {
                            showCancel = false;
                            break;
                        }
                    }
                } else {
                    showCancel = false;
                }
            }
        }
        // 环节实例
        SysNode node = task.getNode_instance_id().getNode_id();
        Map result = new HashMap();
        result.put("WdataId", task.getWorkflow_instance_id().getData_id());  //获取流程主对象数据id
        result.put("flowName", task.getWorkflow_instance_id().getWorkflow_id().getName());  //获取流程名称
        result.put("sort", task.getNode_instance_id().getNode_id().getSort()); //环节序号
        result.put("list", sheetList); //环节页面list
        result.put("taskList", taskList); //任务实例list
        result.put("taskStatus", status); //任务状态
        result.put("taskId", id); //任务id
        result.put("taskNum", list.size()); //流程实例下的任务数量
        result.put("wiId", task.getWorkflow_instance_id().getId()); //流程实例id
        result.put("isCheck", isCheck); //
        result.put("isFirstNode", isFirstNode); //是否开始环节
        result.put("cycleFlag", cycleFlag); //是否可以循环打开流程监控和任务办理页面
        result.put("canBackTask", canBackTask); //任务是否能退回
        result.put("winstatus", task.getWorkflow_instance_id().getStatus()); //流程实例状态
        result.put("manager", manager); //
        result.put("handleType", handleType); //环节页面的办理状态
        result.put("sfxsbc", node.getSfxsbc()); //是否显示保存
        result.put("sfbxscfj", node.getSfbxscfj()); //是否必须上传附件
        result.put("showCancel", showCancel); //显示撤回
        result.put("isMe", isMe); //当前登录用户是否为任务办理人
        if (node.getType() == NodeType.ACTIVITY_NODE) {
            SysActivityNode activityNode = ((SysActivityNode) HibernateProxyUtil.getTarget(node));
            if (!"".equals(activityNode.getSaveName())) {
                result.put("saveName", activityNode.getSaveName());
            }
            if (!"".equals(activityNode.getSubmitName())) {
                result.put("submitName", activityNode.getSubmitName());
            }
            result.put("buttons", buttonDao.findNodeButtonByNode(node));
        }
        return result;
    }

    @Override
    public List<SysTask> findTasksByNodeInstanceId(Long id) {
        return sysTaskDao.findTasksByNodeInstanceId(id);
    }

    @Override
    public List taskPage(Long wfiId, Long nodeId) {
        return sysTaskDao.taskPage(wfiId, nodeId);
    }

    @Override
    public SysTask getTaskByWorkflowInstanceAndUser(Long wId, Long userId) {
        return sysTaskDao.getTaskByWorkflowInstanceAndUser(wId, userId);
    }

    @Override
    public Boolean isFristNode(SysTask task) {
        if (task != null) {
            SysNodeInstance sni = task.getNode_instance_id();
            if (sni != null) {
                SysNode sn = sni.getNode_id();
                return sysNodeService.isStartNodeByPreviousNode(sn.getId());
            }
        }
        return false;
    }

    @Override
    public List<SysTask> findTasksByWorkflowInstance(Long id) {
        return sysTaskDao.findTasksByWorkflowInstance(id);
    }

    @Override
    public Boolean isSheetDrive(SysTask task) {
        List<SysTaskPageInstance> taskPageInstanceList = sysTaskPageInstanceDao.findByTask(task.getId());
        for (SysTaskPageInstance sysTaskPageInstance : taskPageInstanceList) {
            SysNodePage nodeSheet = sysTaskPageInstance.getSysNodePage();
            if (nodeSheet == null) {
                return true;
            }
        }
        return false;
    }

    @Override
    public Boolean isReturned(SysTask task) {
        // 环节实例
        SysNodeInstance nodeInstance = task.getNode_instance_id();
        SysNode node = nodeInstance.getNode_id();
        Boolean b = sysNodeService.isStartNodeByPreviousNode(node.getId());
        return !b && ("WAITING".equals(task.getStatus().name()) || "ACCEPTING".equals(task.getStatus().name()));
    }

//    @Deprecated
//    public List<Map<String, Object>> findSheetByTask2(SysTask task, Boolean flag, String status) {
//        // 环节实例
//        SysNodeInstance nodeInstance = task.getNode_instance_id();
//        // 流程实例
//        SysWorkflowInstance workflowInstance = task.getWorkflow_instance_id();
//
//        List<Map<String, Object>> sheets = new ArrayList<>();
//        // 根据环节实例ID获取环节页面
//        List<SysNodePageInstance> nodeSheetInstances = sysNodeInstanceService.findNodeSheetInstancesByNodeInstance(nodeInstance.getId());
//        for (SysNodePageInstance nodeSheetInstance : nodeSheetInstances) {
//            SysPage sheet = nodeSheetInstance.getPage_id();
//            Map<String, Object> result = new HashMap<>();
//            StringBuilder url = new StringBuilder(sheet.getUrl());
//            //处理环节表单数据id，放入url中以id键，放入map中以WdataId键
//            result.put("WdataId", workflowInstance.getData_id());
//            result.put("PdataId", nodeSheetInstance.getData_id());
//            Integer id = nodeSheetInstance.getData_id() != null ? nodeSheetInstance.getData_id() : workflowInstance.getData_id();
//            url.append("?id=").append(id != null ? id : "");
//            //将sourceData（String）转换为json，再将json数据拼接到url中
//            if (workflowInstance.getSourceData() != null && !"".equals(workflowInstance.getSourceData())) {
//                ObjectMapper mapper = JacksonMapper.getInstance();
//                try {
//                    JsonNode sourceJson = mapper.readTree(workflowInstance.getSourceData());
//                    Iterator iter = sourceJson.fields();
//                    while (iter.hasNext()) {
//                        Map.Entry property = (Map.Entry) iter.next();
//                        url.append("&").append(property.getKey()).append("=").append(property.getValue());
//                    }
//                } catch (IOException e) {
//                    e.printStackTrace();
//                    return null;
//                }
//            }
//            // 编辑
//            result.put("edit", (nodeSheetInstance.getNode_page_id().getControl() == SheetMode.EDIT ||
//                    nodeSheetInstance.getNode_page_id().getControl() == SheetMode.SEAL));
//            result.put("lookflg", flag);
//            result.put("Wstatus", status);
//            SysNodePage nodeSheet = nodeSheetInstance.getNode_page_id();
//            result.put("name", nodeSheet != null ? nodeSheet.getTitle() : sheet.getName());
//            result.put("url", url.toString());
//            result.put("sId", nodeSheetInstance.getId());
//            result.put("wId", workflowInstance.getId());
//            result.put("nodeName", nodeSheetInstance.getNode_instance_id().getNode_id().getName());
//            result.put("sort", nodeSheetInstance.getNode_instance_id().getNode_id().getSort());
//            result.put("path", nodeSheetInstance.getPath());
//            result.put("rwId", task.getId());
//            result.put("lcId", workflowInstance.getWorkflow_id().getWorkflow());
//            result.put("WdataId", workflowInstance.getData_id());
//            result.put("sheetId", sheet.getId());
//            sheets.add(result);
//        }
//        return sheets;
//    }

    @Override
    public List<Map<String, Object>> findSheetByTask(SysTask task, Boolean flag, String status) {
        // 环节实例
        SysNodeInstance nodeInstance = task.getNode_instance_id();
        // 流程实例
        SysWorkflowInstance workflowInstance = task.getWorkflow_instance_id();
        //查找运行中的环节
        SysNodeInstance runNodeInstance = sysNodeInstanceDao.findRunningNode(workflowInstance);
        int runNodeSort = runNodeInstance != null ? nodeInstance.getNode_id().getSort() : 0; //运行中的环节序号
        // 根据任务实例ID获取任务页面实例list
        List<SysTaskPageInstance> taskPageInstanceList = sysTaskPageInstanceDao.findByTask(task.getId());
        List<Map<String, Object>> sheets = new ArrayList<>();
        for (SysTaskPageInstance sysTaskPageInstance : taskPageInstanceList) {
            Map<String, Object> result = new HashMap<>();
            SysPage sysPage = sysTaskPageInstance.getSysPage();
            StringBuilder url = new StringBuilder(sysPage.getUrl()); //获取页面url
            //获取数据id
            Long id = sysTaskPageInstance.getData_id() != null ? sysTaskPageInstance.getData_id() : workflowInstance.getData_id();
            url.append("?id=").append(id != null ? id : "");
            Map sourceData = new HashMap();
            if (workflowInstance.getSourceData() != null && !"".equals(workflowInstance.getSourceData())) {
                ObjectMapper mapper = JacksonMapper.getInstance();
                try {
                    JsonNode sourceJson = mapper.readTree(workflowInstance.getSourceData());
                    Iterator iter = sourceJson.fields();
                    while (iter.hasNext()) {
                        Map.Entry property = (Map.Entry) iter.next();
                        String key = property.getKey().toString();
                        String value = "";
                        if (property.getValue() != null) {
                            value = mapper.readValue(property.getValue().toString(), String.class);
                        }
                        url.append("&").append(key).append("=").append(value);
                        sourceData.put(key, value);
                    }
                } catch (IOException e) {
                    throw new RuntimeException("流程实例对象ID集合解析出错", e);
                }
            }
            // 编辑
            SysNodePage nodeSheet = sysTaskPageInstance.getSysNodePage();
            if (nodeSheet != null) {
                SheetMode sm = nodeSheet.getControl();
                if (sm != null) {
                    result.put("edit", (sm == SheetMode.EDIT || sm == SheetMode.SEAL)); //环节页面控制状态
                    result.put("sheetMode", sm.id);
                }
            }
            result.put("name", nodeSheet != null ? nodeSheet.getTitle() : sysPage.getName()); //环节页面标题或页面名称
            result.put("lookflg", flag); //是否在办
            result.put("Wstatus", status); //流程实例状态

            result.put("url", url.toString()); //页面url
            result.put("sId", sysTaskPageInstance.getId()); //任务页面实例id
            result.put("wId", workflowInstance.getId()); //流程实例id
            result.put("code", workflowInstance.getWorkflow_id().getCode()); //流程编码
            result.put("nodeName", nodeInstance.getNode_id().getName()); //环节名称
            result.put("nId", nodeInstance.getNode_id().getId()); //环节id
            result.put("sort", nodeInstance.getNode_id().getSort()); //环节序号
            result.put("runNodeSort", runNodeSort); //运行中的环节序号
            result.put("rwId", task.getId()); //任务实例id
            result.put("lcId", workflowInstance.getWorkflow_id().getWorkflow()); //原始版本流程id

            result.put("WdataId", workflowInstance.getData_id()); //流程实例数据id
            result.put("PdataId", sysTaskPageInstance.getData_id()); //任务页面实例数据id
            result.put("tmpData", sysTaskPageInstance.getTmp_data_json()); //任务页面实例临时数据json

            result.put("wpId", sysTaskPageInstance.getSysWorkflowPage().getId()); //流程页面id
            result.put("npId", sysTaskPageInstance.getSysNodePage().getId()); //环节页面id
            result.put("spId", sysPage.getId()); //页面id
            result.put("sourceData", sourceData); //流程实例初始源数据
            sheets.add(result);
        }
        return sheets;
    }

    public List getNodePageOpinion(Long wiId, Long spId) {
        return sysTaskDao.getNodePageOpinion(wiId, spId);
    }

    public void saveTmpAutoOpinion(String autoOpinion) {
        sysTaskDao.saveTmpAutoOpinion(autoOpinion);
    }

    @Override
    public Map generateTaskHandleJson(String flowCode) {
        SysNode node = sysTaskDao.getFirstActivityNode(flowCode);
        List<Map<String, Object>> sheets = sysTaskDao.getSheetByNodeId(node.getId());
        Map<String, Object> result = new HashMap<>();
        result.put("list", sheets);
        result.put("sfbxscfj", node.getSfbxscfj()); //是否必须上传附件
        if (node.getType() == NodeType.ACTIVITY_NODE) {
            SysActivityNode activityNode = (SysActivityNode) node;
            if (RxStringUtils.isNotEmpty(activityNode.getSaveName())) {
                result.put("saveName", activityNode.getSaveName());
            }
            if (RxStringUtils.isNotEmpty(activityNode.getSubmitName())) {
                result.put("submitName", activityNode.getSubmitName());
            }
            result.put("buttons", buttonDao.findNodeButtonByNode(node));
        }
        return result;
    }
}
