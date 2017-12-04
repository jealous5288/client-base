package net.ruixin.controller.plat.message;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.message.MessageType;
import net.ruixin.service.plat.message.IMessageTypeService;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.resolver.FormModel;
import net.ruixin.util.resolver.SearchModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
@RequestMapping("/messageType")
public class MessageTypeController extends BaseController {
    @Autowired
    IMessageTypeService messageTypeService;

    @ResponseBody
    @RequestMapping("/getMessageTypeList")
    public AjaxReturn getMessageTypeList(@SearchModel Object map) {
        return SUCCESS.setData(messageTypeService.getMessageTypeList((Map) map));
    }

    @ResponseBody
    @RequestMapping("/saveMessageType")
    public AjaxReturn saveMessageType(@FormModel MessageType messageType) {
        messageTypeService.save(messageType);
        return SUCCESS;
    }

    @ResponseBody
    @RequestMapping("/getMessageTypeById")
    public AjaxReturn getMessageTypeById(Long id) {
        return SUCCESS.setData(messageTypeService.get(MessageType.class, id));
    }

    @ResponseBody
    @RequestMapping("/deleteMessageType")
    public AjaxReturn deleteMessageType(Long id) {
        messageTypeService.delete(MessageType.class, id);
        return SUCCESS;
    }


}
