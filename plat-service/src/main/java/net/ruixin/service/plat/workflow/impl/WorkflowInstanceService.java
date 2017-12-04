package net.ruixin.service.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.*;
import net.ruixin.domain.plat.workflow.instance.SysNodeInstance;
import net.ruixin.domain.plat.workflow.instance.SysTask;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowVariableInstance;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflowVariable;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.domain.plat.workflow.structure.node.SysTransactNode;
import net.ruixin.domain.plat.workflow.structure.page.SysWorkflowPage;
import net.ruixin.domain.plat.workflow.structure.route.SysRouter;
import net.ruixin.enumerate.plat.Sfyx_st;
import net.ruixin.service.plat.workflow.ISysTaskService;
import net.ruixin.service.plat.workflow.IWorkflowInstanceService;
import net.ruixin.service.plat.workflow.IWorkflowService;
import net.ruixin.util.data.FlowParam;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Jealous on 2016-8-16.
 * 流程实例接口实现
 */
@SuppressWarnings("unused")
@Service
@Transactional
public class WorkflowInstanceService implements IWorkflowInstanceService, ApplicationContextAware {
    private ApplicationContext applicationContext;

    @Autowired
    private ISysTaskDao sysTaskDao;

    @Autowired
    private ISysWorkflowVariableDao sysWorkflowVariableDao;

    @Autowired
    private ISysWorkflowVariableInstanceDao sysWorkflowVariableInstanceDao;

    @Autowired
    private IWorkflowInstanceDao workflowInstanceDao;

    @Autowired
    private ISysNodeDao sysNodeDao;

    @Autowired
    private ISysWorkflowPageDao sysWorkflowPageDao;

    @Autowired
    private ISysTaskService sysTaskService;

    @Autowired
    private ISysRouterDao routerDao;

    @Autowired
    private ISysNodeInstanceDao sysNodeInstanceDao;

    @Autowired
    private ISysTaskPageInstanceDao sysTaskPageInstanceDao;

    @Autowired
    private IWorkflowService workflowService;

    @Override
    public String startup(List<Object> param) {
        return workflowInstanceDao.startup(param);
    }

    @Override
    public String signForTask(Long id) {
        return workflowInstanceDao.signForTask(id);
    }

    @Transactional
    @Override
    public String transact(List param, String autoOpinion) {
        if (RxStringUtils.isNotEmpty(autoOpinion)) {
            sysTaskService.saveTmpAutoOpinion(autoOpinion);
        }
        return workflowInstanceDao.transact(param);
    }

    @Override
    public void processJava(Long id, String branch, String opinion, String fj_id) {
        SysTask task = sysTaskService.get(id);
        SysTransactNode transactNode = sysNodeDao.getTransactNode(task.getNode_instance_id().getNode_id().getId());
        String processSql;
        if ("撤回".equals(opinion)) { //撤回后进入前置程序 wcy 17/2/27
            processSql = transactNode.getStartupProcess();
        } else { //进入后置程序
            processSql = transactNode.getFinishProcess();
            if (processSql == null) {
                if (task.getWorkflow_instance_id().getStatus().equals("0")) { //流程实例状态 已完成
                    processSql = task.getWorkflow_instance_id().getWorkflow_id().getFinishProcessSql();
                }
            }
        }
        if (processSql != null) {
            String[] ps = processSql.split("JAVA:");
            if (ps.length > 1) {
                for (int i = 1; i < ps.length; i++) {
                    String pName = ps[i].trim();
                    SupportProgram supportProgram = (SupportProgram) applicationContext.getBean(pName);
                    supportProgram.setNodeInstance(task.getNode_instance_id());
                    supportProgram.setWorkflowInstance(task.getWorkflow_instance_id());
                    supportProgram.setSysTask(task);
                    supportProgram.run(opinion, branch, fj_id);
                }
            }
        }
    }

    @Override
    public String returned(List<Object> param) {
        return workflowInstanceDao.returned(param);
    }

    @Override
    public String withdraw(Long id) {
        return workflowInstanceDao.withdraw(id);
    }

    @Transactional
    @Override
    public String delWorkflowInstance(Long wiId) {
        return workflowInstanceDao.delWorkflowInstance(wiId);
    }

    @Override
    public Long getNewestTaskId(Long wId, Long dataId, Long userid) {
        Long taskId = workflowInstanceDao.getNewestTaskId(wId, dataId, userid);
        if (taskId == null)
            taskId = workflowInstanceDao.getNewestTaskId(wId, dataId, null);
        return taskId;
    }

    @Override
    public Long getNewestTaskIdByWiId(Long wiId, Long userid) {
        Long taskId = workflowInstanceDao.getNewestTaskIdByWiId(wiId, userid);
        if (taskId == null)
            taskId = workflowInstanceDao.getNewestTaskIdByWiId(wiId, null);
        return taskId;
    }

    @Override
    public String getWorkflowSheetUrl(String flowCode, Long dataId) {
        SysWorkflow wf = workflowService.findWorkflowsByCode(flowCode);
        if (wf != null && wf.getId() != null) {
            List<SysWorkflowPage> list = sysWorkflowPageDao.findWorkflowSheetsByWorkflow(wf.getId());
            if (list.size() > 0) {
                return list.get(0).getSysPage().getUrl() + "?edit=false&id=" + dataId;
            }
        }
        return null;
    }

    @Override
    public List getBlrList(Long rwid, Boolean agree, String decision) {
        return workflowInstanceDao.getBlrList(rwid, agree, decision);
    }

    @Override
    public void updateWorkflowInstanceData(FlowParam param, Long dataId, String title) {
        workflowInstanceDao.updateWorkflowInstanceData(dataId, param.getwId(), title);
    }

    @Override
    public void updateSysGlbBizWf(Long dataId, Long wiId) {
        workflowInstanceDao.updateSysGlbBizWf(dataId, wiId);
    }

    @Override
    public void updateTaskPageInstanceData(FlowParam param, Long dataId) {
        sysTaskPageInstanceDao.updateTaskPageInstanceData(dataId, param.getRwId(), param.getNpId());
    }

    @Override
    public void updateTmpData(Long taskId, Long nodePageId, String tmpData) {
        sysTaskPageInstanceDao.updateTmpData(taskId, nodePageId, tmpData);
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    /**
     * 获取特送退回的环节树
     *
     * @param taskId 任务ID
     */
    public List getSpecialBackTree(Long taskId) {
        List<Map<String, Object>> specialBackTreeList = new ArrayList<>();
        List<Map<String, Object>> getSpecialBackTreeList = workflowInstanceDao.getSpecialBackTree(taskId);
        for (Map map : getSpecialBackTreeList) {
            Map<String, Object> result = new HashMap<>();
            result.put("id", map.get("NODE_ID").toString());
            result.put("pId", 0);
            result.put("name", map.get("NAME").toString());
            result.put("isParent", false);
            result.put("open", false);
            specialBackTreeList.add(result);
        }
        return specialBackTreeList;
    }

    @Override
    public Object getSimpleWorkflowJSON(Long id) {
        // 获取流程实例表数据
        SysWorkflowInstance workflowInstance = workflowInstanceDao.get(id);
        Map<String, Object> result = new HashMap<>();
        if (null != workflowInstance) {
            // 所属流程
            SysWorkflow workflow = workflowInstance.getWorkflow_id();
            if (null != workflow) {
                //环节
                List<SysNode> nodes = sysNodeDao.findNodesByWorkflow(workflow);
                // 实体：流向
                List<SysRouter> routers = routerDao.findRoutersByWorkflow(workflow);
                Map<String, Object> workflowStructure = new HashMap<>();
                workflowStructure.put("workflow", workflow);
                workflowStructure.put("nodes", nodes);
                workflowStructure.put("routers", routers);
                result.put("Workflow", workflowStructure);
            }
            // 根据流程实例获得环节实例
            List<SysNodeInstance> nodeInstances = sysNodeInstanceDao.getSysNodeInstanceListByWorkflowInstanceId(workflowInstance.getId());
            result.put("WorkflowInstance", nodeInstances);
            result.put("instance", workflowInstance);
            // 找到运行中的环节ID
            SysNodeInstance node = sysNodeInstanceDao.findRunningNode(workflowInstance);
            if (node != null && node.getNode_id() != null) {
                result.put("nodeId", node.getNode_id().getId());
            }
        }
        return result;
    }

    @Override
    public String batchProcess(Long userId, String wfiIds, String opinion, String handleTag) {
        return workflowInstanceDao.batchProcess(userId, wfiIds, opinion, handleTag);
    }

    @Override
    public boolean initVariable(FlowParam param, String name, String value) {
        // 通过任务获得流程实例
        SysTask task = sysTaskDao.get(param.getRwId());
        SysWorkflowInstance workflowInstance = task.getWorkflow_instance_id();
        SysWorkflowVariable workflowVariable = sysWorkflowVariableDao.getByNameAndWfi(name, workflowInstance.getWorkflow_id());
        SysWorkflowVariableInstance swvi = sysWorkflowVariableInstanceDao.getByVariableAndWfi(workflowVariable, workflowInstance);
        if (swvi == null)
            swvi = new SysWorkflowVariableInstance();
        swvi.setWorkflow_instance_id(workflowInstance);
        swvi.setVariable_id(workflowVariable);
        swvi.setValue(value);
        swvi.setSfyx_st(Sfyx_st.VALID);
        try {
            sysWorkflowVariableInstanceDao.save(swvi);
        } catch (Throwable t) {
            t.printStackTrace();
            return false;
        }
        return true;
    }

    @Override
    public List getPageOpinionWithCode(Long wiId) {
        return sysTaskDao.getPageOpinionWithCode(wiId);
    }

    @Override
    public void insertWorkflowAdditionUsers(FlowParam param, String ids) {
        workflowInstanceDao.insertWorkflowAdditionUsers(param.getwId(), param.getnId(), ids);
    }

    @Override
    public SysWorkflowInstance getById(Long id) {
        return workflowInstanceDao.getById(id);
    }

    @Override
    public SysNode findRunningNode(SysWorkflowInstance win) {
        // 找到运行中的环节ID
        SysNodeInstance node = sysNodeInstanceDao.findRunningNode(win);
        if (null != node) {
            return node.getNode_id();
        } else {
            return null;
        }
    }

    @Override
    public String hasDynamicUser(String flowCode, Long dataId) {
        return workflowInstanceDao.hasDynamicUser(flowCode, dataId);
    }

    @Override
    public void updateWordpath(String path, Long pageId, Long winId) {
        workflowInstanceDao.updateWordpath(path, pageId, winId);
    }

    @Override
    public Long getDataIdByTaskId(Long id) {
        return workflowInstanceDao.getDataIdByTaskId(id);
    }

    @Override
    public String specialBack(Long nodeInstanceId, Long nodeId, String opinion, String fj_id) {
        return workflowInstanceDao.specialBack(nodeInstanceId, nodeId, opinion, fj_id);
    }
}
