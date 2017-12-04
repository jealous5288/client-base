package net.ruixin.controller.plat.workflow;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow")
public class WorkflowMapping {

    //流程类别管理
    @RequestMapping(value = "/designTools/workflowType")
    public String workflowType() {
        return "plat/workflow/designTools/workflowType";
    }

    //流程类别管理
    @RequestMapping(value = "/designTools/workflowTypeSelect")
    public String workflowTypeSelect() {
        return "plat/workflow/designTools/workflowTypeSelect";
    }

    //流程设计
    @RequestMapping(value = "/designTools/flow")
    public String workflowDesign() {
        return "plat/workflow/designTools/flow";
    }

    //流程设计
    @RequestMapping(value = "/designTools/panel")
    public String panel() {
        return "plat/workflow/designTools/panel";
    }

    //开始环节
    @RequestMapping(value = "/designTools/start_node")
    public String start_node() {
        return "plat/workflow/designTools/start_node";
    }

    //结束环节
    @RequestMapping(value = "/designTools/end_node")
    public String end_node() {
        return "plat/workflow/designTools/end_node";
    }

    //决策环节
    @RequestMapping(value = "/designTools/judge_node")
    public String judge_node() {
        return "plat/workflow/designTools/judge_node";
    }

    //传阅环节
    @RequestMapping(value = "/designTools/read_node")
    public String read_node() {
        return "plat/workflow/designTools/read_node";
    }

    //嵌套环节
    @RequestMapping(value = "/designTools/nested_node")
    public String nested_node() {
        return "plat/workflow/designTools/nested_node";
    }

    // 流向设置
    @RequestMapping(value = "/designTools/router")
    public String router() {
        return "plat/workflow/designTools/router";
    }

    // 新建流程页面
    @RequestMapping(value = "/designTools/flowProperty")
    public String flowProperty() {
        return "plat/workflow/designTools/flowPropertyEdit";
    }

    //弹出选择流程表单
    @RequestMapping(value = "/designTools/sheetSelect")
    public String sheetSelect() {
        return "plat/workflow/designTools/sheetSelect";
    }

    // 活动环节
    @RequestMapping(value = "/designTools/activity_node")
    public String activity_node() {
        return "plat/workflow/designTools/activityNodeEdit";
    }

    //任务办理页面
    @RequestMapping(value = "/handle/taskHandle")
    public String taskHandel() {
        return "plat/workflow/handle/taskHandle";
    }

    //流程办理页面
    @RequestMapping(value = "/handle/handle")
    public String handle() {
        return "plat/workflow/handle/handle";
    }

    //签收页面
    @RequestMapping(value = "/handle/confirmSing")
    public String confirmSing() {
        return "plat/workflow/handle/confirmSing";
    }

    //退回意见页面
    @RequestMapping(value = "/handle/blyj")
    public String blyj() {
        return "plat/workflow/handle/blyj";
    }

    //任务列表页面
    @RequestMapping(value = "/handle/taskList")
    public String taskList() {
        return "plat/workflow/handle/taskList";
    }

    //流程图形
    @RequestMapping(value = "/view/workflowView")
    public String workflowView() {
        return "plat/workflow/view/workflowView";
    }

    //流程图形
    @RequestMapping(value = "/view/image")
    public String image() {
        return "plat/workflow/view/image";
    }

    //流程图形
    @RequestMapping(value = "/view/taskList")
    public String teskList() {
        return "plat/workflow/view/taskList";
    }

    //流程图形
    @RequestMapping(value = "/view/transactList")
    public String transactList() {
        return "plat/workflow/view/transactList";
    }

    //待办任务
    @RequestMapping(value = "/gzrwgl/dbrw")
    public String dbrw() {
        return "plat/workflow/gzrwgl/dbrw";
    }

    //在办任务
    @RequestMapping(value = "/gzrwgl/zbrw")
    public String zbrw() {
        return "plat/workflow/gzrwgl/zbrw";
    }

    //已办任务
    @RequestMapping(value = "/gzrwgl/ybrw")
    public String ybrw() {
        return "plat/workflow/gzrwgl/ybrw";
    }

    //任务查询
    @RequestMapping(value = "/gzrwgl/rwcx")
    public String rwcx() {
        return "plat/workflow/gzrwgl/rwcx";
    }

    //流程审核意见
    @RequestMapping(value = "/workflowShyj")
    public String workflowShyj() {
        return "plat/workflow/instance/workflowShyj";
    }


}
