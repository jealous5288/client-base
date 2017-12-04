package net.ruixin.controller.plat.log;

import net.ruixin.service.plat.log.ILogService;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.resolver.SearchModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
@RequestMapping("/log")
public class LogController {
    @Autowired
    private ILogService logService;

    @ResponseBody
    @RequestMapping(value = "/getLoginLogPage")
    public AjaxReturn getLoginLogPage(@SearchModel Object map) {
        return new AjaxReturn().setSuccess(true).setData(logService.getLoginLogPage((Map) map));
    }

    @ResponseBody
    @RequestMapping(value = "/getOperateLogPage")
    public AjaxReturn getOperateLogPage(@SearchModel Object map) {
        return new AjaxReturn().setSuccess(true).setData(logService.getOperateLogPage((Map) map));
    }

}
