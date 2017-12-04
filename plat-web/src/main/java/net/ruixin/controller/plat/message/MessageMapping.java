package net.ruixin.controller.plat.message;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/message")
public class MessageMapping {
    @RequestMapping("messageTypeList")
    private String messageTypeList() {
        return "plat/message/messageTypeList";
    }

    @RequestMapping("messageTypeEdit")
    private String messageTypeEdit() {
        return "plat/message/messageTypeEdit";
    }
}
