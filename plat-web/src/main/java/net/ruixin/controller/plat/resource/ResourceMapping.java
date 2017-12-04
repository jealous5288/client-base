package net.ruixin.controller.plat.resource;

import net.ruixin.util.cache.Cache;
import net.ruixin.util.cache.CacheKit;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

/**
 * 资源mapping
 */
@Controller
@RequestMapping("/resource")
public class ResourceMapping {
    //资源列表
    @RequestMapping(value = "/resourceList")
    public String configList(Model model) {
        model.addAttribute("resourceConfig",CacheKit.get(Cache.CONFIG,"resourceConfig"));
        model.addAttribute("resourceDict",CacheKit.get(Cache.CONFIG,"resourceDict"));
        return "plat/resource/resourceList";
    }

    //选择资源类型
    @RequestMapping(value = "/resourceTypeSelect")
    public String resourceTypeSelect(Model model) {
        model.addAttribute("resourceDict",CacheKit.get(Cache.CONFIG,"resourceDict"));
        return "plat/resource/resourceTypeSelect";
    }

    //资源编辑
    @RequestMapping(value = "/resourceEdit")
    public String configEdit(String resourceType, Model model) {
        Map<String,Map<String,Object>> resourceConfig = CacheKit.get(Cache.CONFIG,"resourceConfig");
        model.addAttribute("resourceType",resourceType);
        model.addAttribute("config",resourceConfig.get(resourceType));
        model.addAttribute("resourceDict",CacheKit.get(Cache.CONFIG,"resourceDict"));
        return "plat/resource/resourceEdit";
    }

    //资源选择树
    @RequestMapping(value = "/resourceTreeSelect")
    public String resourceTreeSelect() {
        return "plat/resource/resourceTreeSelect";
    }
}
