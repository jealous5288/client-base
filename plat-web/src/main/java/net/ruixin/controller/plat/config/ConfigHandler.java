package net.ruixin.controller.plat.config;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.config.SysConfig;
import net.ruixin.service.plat.config.IConfigService;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.resolver.FormModel;
import net.ruixin.util.resolver.SearchModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

/**
 * 配置控制层
 */
@Controller
@RequestMapping("/config")
public class ConfigHandler extends BaseController {

    @Autowired
    private IConfigService configService;

    /**
     * 分页列表查询
     *
     * @param map 查询条件
     */
    @ResponseBody
    @RequestMapping(value = "/getConfigList")
    public AjaxReturn getConfigList(@SearchModel Object map) {
        FastPagination fastPagination = configService.getConfigList((Map) map);
        return SUCCESS.setData(fastPagination);
    }

    /**
     * 根据ID获取配置实体
     *
     * @param id 配置ID
     */
    @ResponseBody
    @RequestMapping(value = "/getConfigById")
    public AjaxReturn getConfigById(Long id) {
        return SUCCESS.setData(configService.getConfigById(id));
    }

    /**
     * 保存、修改配置
     *
     * @param config 配置
     */
    @ResponseBody
    @RequestMapping(value = "/saveConfig")
    public AjaxReturn saveConfig(@FormModel SysConfig config) {
        configService.saveConfig(config);
        return SUCCESS;
    }

    /**
     * 根据ID删除配置
     *
     * @param id 配置ID
     */
    @ResponseBody
    @RequestMapping(value = "/delConfig")
    public AjaxReturn delConfig(Long id) {
        configService.delConfig(id);
        return SUCCESS;
    }

}
