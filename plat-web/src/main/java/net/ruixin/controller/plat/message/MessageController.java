package net.ruixin.controller.plat.message;

import net.ruixin.controller.BaseController;
import net.ruixin.service.plat.message.IMessageService;
import net.ruixin.util.data.AjaxReturn;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/message")
public class MessageController extends BaseController {
    @Autowired
    private IMessageService messageService;

    @ResponseBody
    @RequestMapping("/generateMessage")
    public AjaxReturn generateMessage() {
        messageService.generateMessage("11","DWGL", "标题", "内容", "param");
        return SUCCESS;
    }
}
