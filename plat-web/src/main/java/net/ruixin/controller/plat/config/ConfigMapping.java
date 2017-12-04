package net.ruixin.controller.plat.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 配置mapping
 */
@Controller
@RequestMapping("/config")
public class ConfigMapping {
    //配置列表
    @RequestMapping(value = "/configList")
    public String configList() {
        return "plat/config/configList";
    }

    //配置编辑
    @RequestMapping(value = "/configEdit")
    public String configEdit() {
        return "plat/config/configEdit";
    }
}
