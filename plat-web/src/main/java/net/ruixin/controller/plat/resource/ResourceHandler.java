package net.ruixin.controller.plat.resource;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.resource.SysResource;
import net.ruixin.service.plat.resource.IResourceService;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.resolver.FormModel;
import net.ruixin.util.resolver.SearchModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

/**
 * 资源控制层
 */
@Controller
@RequestMapping("/resource")
public class ResourceHandler extends BaseController {

    @Autowired
    private IResourceService resourceService;

    /**
     * 分页列表查询
     *
     * @param map 查询条件
     */
    @ResponseBody
    @RequestMapping(value = "/getResourceList")
    public AjaxReturn getResourceList(@SearchModel Object map) {
        FastPagination fastPagination = resourceService.getResourceList((Map) map);
        return SUCCESS.setData(fastPagination);
    }

    /**
     * 根据ID获取资源实体
     *
     * @param id 资源ID
     */
    @ResponseBody
    @RequestMapping(value = "/getResourceById")
    public AjaxReturn getResourceById(Long id) {
        return SUCCESS.setData(resourceService.getResourceById(id));
    }

    /**
     * 保存、修改资源
     *
     * @param resource 资源
     */
    @ResponseBody
    @RequestMapping(value = "/saveResource")
    public AjaxReturn saveConfig(@FormModel SysResource resource) {
        resourceService.saveResource(resource);
        return SUCCESS;
    }

    /**
     * 根据ID删除资源
     *
     * @param id 资源ID
     */
    @ResponseBody
    @RequestMapping(value = "/delResource")
    public AjaxReturn delResource(Long id) {
        resourceService.delResource(id);
        return SUCCESS;
    }

    /**
     * 资源异步树数据获取
     *
     * @param resourceType 资源类型
     * @param removeId 启动(排除)资源id
     * @param id 异步节点id
     */
    @ResponseBody
    @RequestMapping(value = "/getResourceTreeData")
    public List getResourceTreeData(String resourceType, Long removeId, Long id) {
        return resourceService.getResourceTreeData(resourceType, removeId, id);
    }
}
