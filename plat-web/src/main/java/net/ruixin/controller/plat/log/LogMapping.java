package net.ruixin.controller.plat.log;

import net.ruixin.controller.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/log")
public class LogMapping extends BaseController {


    @RequestMapping("loginLogList")
    public String loginLogList() {
        return "plat/log/loginLogList";
    }

    @RequestMapping("operateLogList")
    public String operateLogList() {
        return "plat/log/operateLogList";
    }


}
