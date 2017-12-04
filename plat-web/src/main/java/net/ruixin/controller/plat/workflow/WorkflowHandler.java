package net.ruixin.controller.plat.workflow;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflowType;
import net.ruixin.service.plat.workflow.IWorkflowService;
import net.ruixin.service.plat.workflow.IWorkflowTypeService;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.resolver.SearchModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Jealous on 2016-8-9.
 * 工作流结构部分控制层
 */
@SuppressWarnings({"unused", "unchecked"})
@Controller
@RequestMapping("/workflow")
public class WorkflowHandler extends BaseController {

    @Autowired
    private IWorkflowTypeService workflowTypeService;

    @Autowired
    private IWorkflowService workflowService;


    /**
     * 构建流程类别树
     *
     * @param id 流程类别主键信息
     */
    @ResponseBody
    @RequestMapping(value = "/designTools/createWorkflowTypeTree")
    public List createWorkflowTypeTree(Long id) {
        List<SysWorkflowType> sysWorkflowTypeList;
        if (id != null) {
            sysWorkflowTypeList = workflowTypeService.findWorkflowTypesByParent(id);
        } else {
            sysWorkflowTypeList = workflowTypeService.findTopWorkflowTypes();
        }
        return workflowTypeService.parseTreeMap(sysWorkflowTypeList, null);
    }

    /**
     * 获取流程类别
     *
     * @param id 流程类别主键信息
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/designTools/getWorkflowType")
    public AjaxReturn getWorkflowType(Long id) {
        boolean result = false;
        String message;
        SysWorkflowType sysWorkflowType = null;
        if (id != null) {
            sysWorkflowType = workflowTypeService.getWorkflowType(id);
            result = true;
            message = "删除成功";
        } else {
            message = "请求出错，缺失流程类别主键信息";
        }
        return new AjaxReturn().setSuccess(result).setMsg(message).setData(sysWorkflowType);
    }

    /**
     * 删除流程类别
     *
     * @param id 流程类别主键信息
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/designTools/delWorkflowType")
    public AjaxReturn delWorkflowType(Long id) {
        boolean result = false;
        String message;
        if (id != null) {
            if (workflowTypeService.hasChildren(id)) {
                result = false;
                message = "该流程类别包含子流程类别，不可删除";
            } else if (workflowService.hasWorkflow(id)) {
                result = false;
                message = "该流程类别下存在工作流，不可删除";
            } else {
                if (workflowTypeService.delWorkflowType(id)) {
                    result = true;
                    message = "删除成功";
                } else {
                    message = "删除失败";
                }
            }
        } else {
            message = "请求出错，缺失流程类别主键信息";
        }
        return new AjaxReturn().setSuccess(result).setMsg(message);
    }

    /**
     * 新增、修改流程类别
     *
     * @param id          流程类别ID
     * @param name        流程类别名称
     * @param description 流程类别描述
     * @param parent      父级流程类别
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/designTools/saveWorkflowType")
    public AjaxReturn saveWorkflowType(Long id, String name, String description, Long parent) {
        boolean result = false;
        String operate = "保存";
        String message = "失败";
        if (id != null)
            operate = "修改";
        if (workflowTypeService.saveWorkflowType(new SysWorkflowType(id, name, description, parent))) {
            message = "成功";
            result = true;
        }
        return new AjaxReturn().setSuccess(result).setMsg(operate + message);
    }

    /**
     * 构建流程类别树+类别下的工作流数据
     *
     * @param id 流程类别ID
     * @return List
     */
    @ResponseBody
    @RequestMapping(value = "/designTools/createWorkflowTypeAndWorkflowTree")
    public List createWorkflowTypeAndWorkflowTree(Long id) {
        List<SysWorkflowType> sysWorkflowTypeList;
        List<SysWorkflow> sysWorkflowList = null;
        if (id != null) {
            sysWorkflowTypeList = workflowTypeService.findWorkflowTypesByParent(id);
            sysWorkflowList = workflowService.findWorkflowsByType(id);
        } else {
            sysWorkflowTypeList = workflowTypeService.findTopWorkflowTypes();
        }
        return workflowTypeService.parseTreeMap(sysWorkflowTypeList, sysWorkflowList);
    }

    /**
     * 查询所有的流程
     *
     * @return List
     */
    @ResponseBody
    @RequestMapping(value = "/designTools/findWorkflow")
    public List findWorkflow() {
        List<SysWorkflow> list = workflowService.findAllWorkflow();
        List json = new ArrayList();
        for (SysWorkflow it : list) {
            Map map = new HashMap();
            map.put("id", it.getId());
            map.put("name", it.getName());
            json.add(map);
        }
        return json;
    }

    /**
     * 获取单个流程数据
     *
     * @param id 流程ID
     * @return Map
     */
    @ResponseBody
    @RequestMapping(value = "/designTools/findWorkflowById")
    public Map findWorkflowById(Long id) {
        SysWorkflow workflow = workflowService.get(id);
        Map map = new HashMap();
        map.put("name", workflow.getName());
        if (workflow.getVersion() != null) {
            map.put("version", workflow.getVersion());
        } else {
            map.put("version", 1);
        }
        return map;
    }

    /**
     * 删除流程
     *
     * @param id 流程ID
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/designTools/delWorkflow")
    public AjaxReturn delWorkflow(Long id) {
        boolean result = false;
        String message;
        if (id != null) {
            if (workflowService.delWorkflow(id)) {
                result = true;
                message = "删除成功";
            } else {
                message = "删除失败";
            }
        } else {
            message = "请求出错，缺失流程主键信息";
        }
        return new AjaxReturn().setSuccess(result).setMsg(message);
    }

    /**
     * 保存流程
     *
     * @param json json格式工作流内容
     * @return 成功否
     */
    @ResponseBody
    @RequestMapping(value = "/designTools/saveWorkflow")
    public AjaxReturn saveWorkflow(String json) {
        boolean result = false;
        String message;
        Long workflowId = workflowService.saveWorkflow(json);
        if (workflowId != null) {
            result = true;
            message = "保存成功";
        } else {
            message = "保存失败";
        }
        return new AjaxReturn().setSuccess(result).setMsg(message).setData(workflowId);
    }

    /**
     * 获取工作流
     *
     * @param id 工作流id
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/designTools/getWorkflowJSON")
    public AjaxReturn getWorkflowJSON(Long id) {
        return new AjaxReturn().setSuccess(true).setData(workflowService.getWorkflowJSON(id));
    }

    /**
     * 分页查询流程表单
     *
     * @param map 参数集
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/designTools/getPageList")
    public AjaxReturn getPageList(@SearchModel Object map) {
        FastPagination fastPagination = workflowService.getPageList((Map) map);
        return new AjaxReturn().setSuccess(true).setData(fastPagination);
    }

    /**
     * 获取工作流最大版本号
     *
     * @param workflowId 流程ID
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/designTools/getWorkflowVersion")
    public AjaxReturn getWorkflowVersion(Long workflowId) {
        return new AjaxReturn().setSuccess(true).setData(workflowService.getWorkflowVersion(workflowId));
    }
}
