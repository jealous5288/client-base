package net.ruixin.service.plat.workflow.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.ruixin.dao.plat.workflow.*;
import net.ruixin.domain.plat.auth.SysPage;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflowType;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflowVariable;
import net.ruixin.domain.plat.workflow.structure.node.*;
import net.ruixin.domain.plat.workflow.structure.page.SysNodePage;
import net.ruixin.domain.plat.workflow.structure.page.SysWorkflowPage;
import net.ruixin.domain.plat.workflow.structure.route.SysRouter;
import net.ruixin.enumerate.plat.*;
import net.ruixin.service.plat.workflow.IWorkflowService;
import net.ruixin.util.json.JacksonMapper;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Jealous on 2016-8-9.
 * 工作流：流程服务接口实现
 */
@SuppressWarnings("unused")
@Service
@Transactional
public class WorkflowService implements IWorkflowService {

    @Autowired
    private IWorkflowDao workflowDao;

    @Autowired
    private IWorkflowTypeDao workflowTypeDao;

    @Autowired
    private ISysPageDao sysPageDao;

    @Autowired
    private ISysNodeDao sysNodeDao;

    @Autowired
    private ISysRouterDao sysRouterDao;

    @Autowired
    private ISysWorkflowVariableDao workflowVariableDao;

    @Autowired
    private ISysWorkflowPageDao workflowPageDao;

    @Autowired
    private ISysNodeVariableAssignDao nodeVariableAssignDao;

    @Autowired
    private ISysNodePageDao sysNodePageDao;

    @Autowired
    private ISysNodeButtonDao nodeButtonDao;

    @Override
    public SysWorkflow get(Long id) {
        return workflowDao.get(id);
    }

    @Override
    public List<SysWorkflow> findWorkflowsByType(Long workfolwTypeId) {
        return workflowDao.findByType(workfolwTypeId);
    }

    @Override
    public SysWorkflow findWorkflowsByCode(String flowCode) {
        return RxStringUtils.isNotEmpty(flowCode) ? workflowDao.findByCode(flowCode) : null;
    }

    @Override
    public List<SysWorkflow> findAllWorkflow() {
        return workflowDao.findAll();
    }

    @Override
    public boolean delWorkflow(Long id) {
        return workflowDao.del(id);
    }

    @Override
    public Long saveWorkflow(String json) {
        SysWorkflow workflow;
        ObjectMapper mapper = JacksonMapper.getInstance();
        try {
            JsonNode workflowJson = mapper.readTree(json);
            if (workflowJson != null) {
                //提取流程基本信息保存
                workflow = initWorkflowByJson(workflowJson);
                if (workflow != null) {
                    //保存工作流关联信息
                    Map<String, SysWorkflowVariable> workflowVariables = new HashMap<>();
                    //1：保存流程变量信息
                    if (workflowJson.has("variables")) {
                        JsonNode variablesNodes = workflowJson.get("variables");
                        for (int i = 0; i < variablesNodes.size(); i++) {
                            JsonNode variablesNode = variablesNodes.get(i);
                            SysWorkflowVariable workflowVariable = initVariableByJson(variablesNodes.get(i), workflow);
                            workflowVariables.put(variablesNode.get("name").asText(), workflowVariable);
                        }
                    }
                    //2：保存流程表单
                    if (workflowJson.has("sheets")) {
                        JsonNode pagesNodes = workflowJson.get("sheets");
                        for (int i = 0; i < pagesNodes.size(); i++) {
                            initWorkflowPageByJson(pagesNodes.get(i), workflow);
                        }
                    }
                    Map<String, SysNode> nodes = new HashMap<>();
                    //3：保存环节信息
                    if (workflowJson.has("nodes")) {
                        JsonNode nodesJson = workflowJson.get("nodes");
                        for (int i = 0; i < nodesJson.size(); i++) {
                            JsonNode nodeJson = nodesJson.get(i);
                            SysNode node = initNodeByJson(nodeJson, workflow, workflowVariables);
                            nodes.put(nodeJson.get("domid").asText(), node);
                        }
                        for (Map.Entry<String, SysNode> entry : nodes.entrySet()) {
                            SysNode node = entry.getValue();
                            if (node.getType() == NodeType.ACTIVITY_NODE) {
                                String domid = ((SysActivityNode) node).getDisagree_nodedom_id();
                                if (RxStringUtils.isNotEmpty(domid)) {
                                    ((SysActivityNode) node).setDisagree_node_id(nodes.get(domid).getId());
                                } else {
                                    ((SysActivityNode) node).setDisagree_node_id(null);
                                }
                            }
                        }
                    }
                    //4：保存流向信息
                    if (workflowJson.has("routers")) {
                        JsonNode routersJson = workflowJson.get("routers");
                        for (int i = 0; i < routersJson.size(); i++) {
                            initRouterByJson(routersJson.get(i), nodes, workflow);
                        }
                    }
                    //返回工作流id
                    return workflow.getId();
                }
            }
            return null;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 私有方法:保存流向
     *
     * @param routerJson 流向json
     * @param nodes      节点
     * @param workflow   流程
     */
    private void initRouterByJson(JsonNode routerJson, Map<String, SysNode> nodes, SysWorkflow workflow) {
        SysRouter router;
        Long routerId = routerJson.get("id").asLong();
        if (routerId != 0)
            router = sysRouterDao.get(routerId);
        else
            router = new SysRouter();
        //名称
        router.setName(routerJson.get("name").asText());
        //分支条件
        router.setBranch(routerJson.get("branch").asText());
        //流出环节
        router.setStartNode(nodes.get(routerJson.get("startNodeId").asText()));
        //流入环节
        router.setEndNode(nodes.get(routerJson.get("endNodeId").asText()));
        //所在流程
        router.setWorkflow(workflow);
        //有效状态
        if (routerJson.get("sfyx_st").asText().equals("VALID"))
            router.setSfyx_st(Sfyx_st.VALID);
        else
            router.setSfyx_st(Sfyx_st.UNVALID);
        sysRouterDao.saveSysRouterDao(router);
    }

    @SuppressWarnings("ConstantConditions")
    private SysNode initNodeByJson(JsonNode nodeJson, SysWorkflow workflow, Map<String, SysWorkflowVariable> workflowVariables) {
        Long nodeId = nodeJson.get("id").asLong();
        NodeType nodeType = NodeType.get(nodeJson.get("type").asInt());
        SysNode node = null;
        if (nodeId != 0) {
            String getMethodStr;
            switch (nodeType) {
                case ACTIVITY_NODE:
                    node = sysNodeDao.getActivityNode(nodeId);
                    break;
                case DECISION_NODE:
                    node = sysNodeDao.getDecisionNode(nodeId);
                    break;
                default:
                    node = sysNodeDao.get(nodeId);
                    break;
            }
        }
        if (node == null) {
            switch (nodeType) {
                case ACTIVITY_NODE:
                    node = new SysActivityNode();
                    break;
                case DECISION_NODE:
                    node = new SysDecisionNode();
                    break;
                default:
                    node = new SysNode();
                    break;
            }
            //指定环节类型
            node.setType(nodeType);
            //所属流程
            node.setSysWorkflow(workflow);
        }
        switch (nodeType) {
            // 活动环节
            case ACTIVITY_NODE:
                //多人办理方式
                ((SysActivityNode) node).setTransactType(TransactType.get(nodeJson.get("transactType").asInt()));
                //会签处理参数
                ((SysActivityNode) node).setCountersignParameter(CountersignParameter.get(nodeJson.get("countersignParameter").asInt()));
                //会签处理参数值
                String countersignValue = nodeJson.get("countersignValue").asText();
                if (RxStringUtils.isNotEmpty(countersignValue))
                    ((SysActivityNode) node).setCountersignValue(Integer.valueOf(countersignValue));
                //聚合方式
                ((SysActivityNode) node).setConvergeType(ConvergeType.get(nodeJson.get("convergeType").asInt()));
                //环节办理人
                String roleId = nodeJson.get("roleId").asText();
                if (RxStringUtils.isNotEmpty(roleId))
                    ((SysActivityNode) node).setRoleId(Long.valueOf(roleId));
                //前处理程序
                ((SysActivityNode) node).setStartupProcess(nodeJson.get("startupProcessSql").asText());
                //后处理程序
                ((SysActivityNode) node).setFinishProcess(nodeJson.get("finishProcessSql").asText());
                //11月29日扩展 --- 退回节点domid
                if (RxStringUtils.isNotEmpty(nodeJson.get("disagreeNodeDomid")))
                    ((SysActivityNode) node).setDisagree_nodedom_id(nodeJson.get("disagreeNodeDomid").asText());
                //12月8日扩展 --- 自动处理逻辑 SYS_TRANSACT_NODE(AUTO_PROCESS)
                if (RxStringUtils.isNotEmpty(nodeJson.get("autoHandleSql")))
                    ((SysActivityNode) node).setAutoProcess(nodeJson.get("autoHandleSql").asText());
                if (RxStringUtils.isNotEmpty(nodeJson.get("submitName"))) {
                    ((SysActivityNode) node).setSubmitName(nodeJson.get("submitName").asText());
                }
                if (RxStringUtils.isNotEmpty(nodeJson.get("saveName"))) {
                    ((SysActivityNode) node).setSaveName(nodeJson.get("saveName").asText());
                }
                break;
            //决策环节
            case DECISION_NODE:
                //决策类型
                ((SysDecisionNode) node).setDecisionType(DecisionType.get(nodeJson.get("decisionType").asInt()));
                break;
            default:
                break;
        }
        //名称
        node.setName(nodeJson.get("name").asText());
        //x坐标
        node.setX(nodeJson.get("x").asInt());
        //y坐标
        node.setY(nodeJson.get("y").asInt());
        //环节序号
        node.setSort(nodeJson.get("nodeSort").asInt());
        //是否显示保存按钮？？？若为空的话，有无默认值
        node.setSfxsbc(nodeJson.get("sfxsbc").isNull() ? null : nodeJson.get("sfxsbc").asText());
        //是否上传附件
        node.setSfbxscfj(nodeJson.get("sfbxscfj").isNull() ? null : nodeJson.get("sfbxscfj").asText());
        //环节业务状态
        node.setYwzt(nodeJson.get("ywzt") == null ? null : nodeJson.get("ywzt").asText());
        //有效状态
        if (nodeJson.get("sfyx_st").asText().equals("VALID"))
            node.setSfyx_st(Sfyx_st.VALID);
        else
            node.setSfyx_st(Sfyx_st.UNVALID);
        sysNodeDao.save(node);
        //环节变量赋值
        JsonNode nodeVariables = nodeJson.get("variables");
        for (int i = 0; i < nodeVariables.size(); i++) {
            JsonNode nodeVariable = nodeVariables.get(i);
            initNodeVariable(nodeVariable, node, workflowVariables);
        }
        //环节表单
        JsonNode nodePages = nodeJson.get("sheets");
        for (int i = 0; i < nodePages.size(); i++) {
            JsonNode nodePage = nodePages.get(i);
            initNodePage(nodePage, node);
        }
        //环节按钮
        JsonNode nodeButtons = nodeJson.get("buttons");
        for (int i = 0; i < nodeButtons.size(); i++) {
            JsonNode nodeButton = nodeButtons.get(i);
            initNodeButton(nodeButton, node);
        }
        return node;
    }

    /**
     * 私有方法:保存环节按钮
     */
    private void initNodeButton(JsonNode nodeButtonJson, SysNode node) {
        SysNodeButton nodeButton;
        Long nodeButtonId = nodeButtonJson.get("id").asLong();
        if (nodeButtonId != 0)
            nodeButton = nodeButtonDao.get(nodeButtonId);
        else
            nodeButton = new SysNodeButton();
        //名称
        nodeButton.setName(nodeButtonJson.get("name").asText());
        //环节
        nodeButton.setNode(node);
        nodeButton.setCode(nodeButtonJson.get("code").asText());
        nodeButton.setFlag(nodeButtonJson.get("flag").asText());
        nodeButton.setSort(nodeButtonJson.get("sort").asInt());
        nodeButton.setIcon(nodeButtonJson.get("icon").asText());
        nodeButton.setIsShowInHandle(nodeButtonJson.get("isShowInHandle").asText());
        //有效状态
        if (nodeButtonJson.get("sfyx_st").asText().equals("VALID"))
            nodeButton.setSfyx_st(Sfyx_st.VALID);
        else
            nodeButton.setSfyx_st(Sfyx_st.UNVALID);
        nodeButton.setFuncName(nodeButtonJson.get("funcName").asText());
        //保存
        nodeButtonDao.saveSysNodeButton(nodeButton);
    }


    /**
     * 私有方法:保存环节表单
     *
     * @param nodePageJson 环节表单json
     * @param node         环节
     */
    private void initNodePage(JsonNode nodePageJson, SysNode node) {
        SysNodePage nodePage;
        Long nodePageId = nodePageJson.get("id").asLong();
        if (nodePageId != 0)
            nodePage = sysNodePageDao.get(nodePageId);
        else
            nodePage = new SysNodePage();
        //标题
        nodePage.setTitle(nodePageJson.get("title").asText());
        //环节
        nodePage.setNode(node);
        //关联流程表单
        nodePage.setPage_id(nodePageJson.get("sheet_id").asLong());
        //排序
        nodePage.setSort(nodePageJson.get("sort").asInt());
        //有效状态
        if (nodePageJson.get("sfyx_st").asText().equals("VALID"))
            nodePage.setSfyx_st(Sfyx_st.VALID);
        else
            nodePage.setSfyx_st(Sfyx_st.UNVALID);
        //控制标记
        SheetMode control;
        switch (nodePageJson.get("control").asText()) {
            case "EDIT":
                control = SheetMode.EDIT;
                break;
            case "SEAL":
                control = SheetMode.SEAL;
                break;
            case "VIEW":
                control = SheetMode.VIEW;
                break;
            default:
                control = SheetMode.EXAMINE;
                break;
        }
        nodePage.setControl(control);
        //12月9日：新增逻辑，添加环节表单（审批项名称和序号）

        if (control.equals(SheetMode.EXAMINE)) {
            if (RxStringUtils.isNotEmpty(nodePageJson.get("spxName")) && !nodePageJson.get("spxName").asText().equals("null")) {
                nodePage.setSpxName(nodePageJson.get("spxName").asText());
                if (RxStringUtils.isNotEmpty(nodePageJson.get("spxPrint"))) {
                    nodePage.setSpxPrint(nodePageJson.get("spxPrint").asText());
                } else {
                    nodePage.setSpxPrint("0");
                }
            } else {
                nodePage.setSpxName("");
                nodePage.setSpxPrint("0");
            }
            if (RxStringUtils.isNotEmpty(nodePageJson.get("spxSort")) && !"0".equals(nodePageJson.get("spxSort").toString())) {
                nodePage.setSpxSort(nodePageJson.get("spxSort").asInt());
            } else {
                nodePage.setSpxSort(null);
            }
        } else {
            nodePage.setSpxName(null);
            nodePage.setSpxSort(null);
            nodePage.setSpxPrint("0");
        }

        //保存
        sysNodePageDao.saveSysNodePage(nodePage);
    }

    /**
     * 私有方法:保存环节变量
     *
     * @param nodeVariable      环节变量json
     * @param node              环节
     * @param workflowVariables 流程变量map
     */
    private void initNodeVariable(JsonNode nodeVariable, SysNode node, Map<String, SysWorkflowVariable> workflowVariables) {
        SysNodeVariableAssign nodeVariableAssign;
        Long nodeVariableId = nodeVariable.get("id").asLong();
        if (nodeVariableId != 0)
            nodeVariableAssign = nodeVariableAssignDao.get(nodeVariableId);
        else
            nodeVariableAssign = new SysNodeVariableAssign();
        //流程变量，从map中获取变量
        nodeVariableAssign.setWorkflowVariable(workflowVariables.get(nodeVariable.get("name").asText()));
        //初始值
        nodeVariableAssign.setExpression(nodeVariable.get("value").asText());
        //有效状态
        if (nodeVariable.get("sfyx_st").asText().equals("VALID"))
            nodeVariableAssign.setSfyx_st(Sfyx_st.VALID);
        else
            nodeVariableAssign.setSfyx_st(Sfyx_st.UNVALID);
        //设置环节
        nodeVariableAssign.setNode(node);
        //保存
        nodeVariableAssignDao.saveSysNodeVariableAssign(nodeVariableAssign);
    }

    /**
     * 私有方法：从json中保存工作流表单数据
     *
     * @param pagesNodes 变量json
     * @param workflow   工作流对象
     */
    private void initWorkflowPageByJson(JsonNode pagesNodes, SysWorkflow workflow) {
        SysWorkflowPage workflowPage;
        Long workflowPageId = pagesNodes.get("id").asLong();
        if (workflowPageId != 0) {
            workflowPage = workflowPageDao.get(workflowPageId);
        } else {
            workflowPage = new SysWorkflowPage();
            //所属流程
            workflowPage.setSysWorkflow(workflow);
        }
        //标题
        workflowPage.setName(pagesNodes.get("name").asText());
        //排序
        workflowPage.setSort(pagesNodes.get("sort").asInt());
        //是否有效
        if (pagesNodes.get("sfyx_st").asText().equals("VALID"))
            workflowPage.setSfyx_st(Sfyx_st.VALID);
        else
            workflowPage.setSfyx_st(Sfyx_st.UNVALID);
        //所属表单页
        Long pageId = pagesNodes.get("sheet_id").asLong();
        if (pageId != 0) {
            SysPage page = sysPageDao.get(pageId);
            workflowPage.setSysPage(page);
        }
        //保存
        workflowPageDao.saveWorkflowPage(workflowPage);
    }

    /**
     * 私有方法：从json中保存工作流变量数据
     *
     * @param variablesNode 变量json
     * @param workflow      工作流对象
     * @return 工作流变量
     */
    private SysWorkflowVariable initVariableByJson(JsonNode variablesNode, SysWorkflow workflow) {
        SysWorkflowVariable workflowVariable;
        Long variableId = variablesNode.get("id").asLong();
        if (variableId != 0) {
            workflowVariable = workflowVariableDao.get(variableId);
        } else {
            workflowVariable = new SysWorkflowVariable();
            //变量所属流程
            workflowVariable.setWorkflow(workflow);
        }
        //变量名称
        workflowVariable.setName(variablesNode.get("name").asText());
        //初始值
        workflowVariable.setValue(variablesNode.get("value").asText());
        //是否有效
        if (variablesNode.get("sfyx_st").asText().equals("VALID"))
            workflowVariable.setSfyx_st(Sfyx_st.VALID);
        else
            workflowVariable.setSfyx_st(Sfyx_st.UNVALID);
        //保存
        workflowVariableDao.saveVariable(workflowVariable);
        return workflowVariable;
    }

    /**
     * 私有方法：从json中保存工作流本体数据
     *
     * @param workflowJson 工作流json数据
     * @return SysWorkflow
     */
    private SysWorkflow initWorkflowByJson(JsonNode workflowJson) {
        SysWorkflow workflow;
        Long workflowId = workflowJson.get("id").asLong();
        if (workflowId != 0) {
            workflow = get(workflowId);
        } else {
            workflow = new SysWorkflow();
        }
        workflow.setSfyx_st(Sfyx_st.VALID);
        //业务编号
        workflow.setCode(workflowJson.get("code").asText());
        //流程名称
        workflow.setName(workflowJson.get("name").asText());
        //描述
        workflow.setDescription(workflowJson.get("description").asText());
        //原始流程
        if (workflowJson.has("workflow") && !("").equals(workflowJson.get("workflow").asText())) {
            Long workflow_id = workflowJson.get("workflow").asLong();
            workflow.setWorkflow(workflow_id);
        }
        //版本号
        Integer version = workflowJson.get("version").asInt();
        workflow.setVersion(version);
        //类别
        Long workflowTypeId = workflowJson.get("type").asLong();
        SysWorkflowType workflowType = workflowTypeDao.get(workflowTypeId);
        workflow.setType(workflowType);
        //优先级别
        WorkflowPriority priority;
        switch (workflowJson.get("priority").asText()) {
            case "high":
                priority = WorkflowPriority.high;
                break;
            case "mediun":
                priority = WorkflowPriority.medium;
                break;
            default:
                priority = WorkflowPriority.low;
                break;
        }
        workflow.setPriority(priority);
        //前处理程序
        workflow.setStartupProcessSql(workflowJson.get("startupProcessSql").asText());
        //后处理程序
        workflow.setFinishProcessSql(workflowJson.get("finishProcessSql").asText());
        //实例标题配置
        workflow.setInstanceTitle(workflowJson.get("instanceTitle").asText());
        //业务状态字典  必须判空
        workflow.setWorkflowYwztZd(workflowJson.get("workflowYwztZd").isNull() ? null : workflowJson.get("workflowYwztZd").asText());
        workflowDao.save(workflow);
        if (workflow.getWorkflow() == null)
            workflow.setWorkflow(workflow.getId());
        return workflow;
    }

    private Integer getVersion(Long workflow_id) {
        return workflowDao.getVersion(workflow_id);
    }

    @Override
    public boolean hasWorkflow(Long workflowTypeId) {
        Integer wfCount = workflowDao.hasChildrenWorkflow(workflowTypeId);
        return wfCount != null && wfCount > 0;
    }

    @Override
    public Map getWorkflowJSON(Long id) {
        Map<String, Object> map = new HashMap<>();
        if (id != null) {
            SysWorkflow workflow = get(id);
            if (workflow != null) {
                //环节
                List<SysNode> nodes = sysNodeDao.findNodesByWorkflow(workflow);
                //流程表单 ？
                List<SysWorkflowPage> workflowPages = workflowPageDao.findWorkflowSheetsByWorkflow(workflow.getId());
                Map<String, String> wfn = new HashMap<>();
                for (SysWorkflowPage w : workflowPages) {
                    wfn.put(w.getId().toString(), w.getSysPage() != null ? w.getName() : null);
                }
                //环节表单
                List<SysNodePage> nodePages = sysNodePageDao.findNodePagesByWorkflow(workflow);
                //流向
                List<SysRouter> routers = sysRouterDao.findRoutersByWorkflow(workflow);
                //流程变量
                List<SysWorkflowVariable> workflowVariables = workflowVariableDao.findVariableByWorkflow(workflow);
                //环节变量
                List<SysNodeVariableAssign> nodeVariableAssigns = nodeVariableAssignDao.findNodeVariableAssignByWorkflow(workflow);
                //环节buttons
                List<SysNodeButton> nodeButtons = nodeButtonDao.findNodeButtonByWorkflow(workflow);
                map.put("workflow", workflow);
                map.put("nodes", nodes);
                map.put("workflowPages", workflowPages);
                map.put("nodePages", nodePages);
                map.put("routers", routers);
                map.put("workflowVariables", workflowVariables);
                map.put("nodeVariableAssigns", nodeVariableAssigns);
                map.put("wfn", wfn);
                map.put("nodeButtons", nodeButtons);
            }
        }
        return map;
    }

    @Override
    public Integer getWorkflowVersion(Long workflowId) {
        return workflowDao.getVersion(workflowId);
    }

    @Override
    public FastPagination getPageList(Map map) {
        return workflowDao.getPageList(map);
    }
}
