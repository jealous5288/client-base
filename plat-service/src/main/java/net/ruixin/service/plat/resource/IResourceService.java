package net.ruixin.service.plat.resource;


import net.ruixin.domain.plat.resource.SysResource;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

public interface IResourceService {

    /**
     * 保存、修改资源
     *
     * @param resource 资源
     */
    void saveResource(SysResource resource);

    /**
     * 根据ID获取资源实体
     *
     * @param id 资源ID
     */
    SysResource getResourceById(Long id);

    /**
     * 根据ID删除资源
     *
     * @param id 资源ID
     */
    void delResource(Long id);

    /**
     * 分页列表查询
     *
     * @param map 查询条件
     */
    FastPagination getResourceList(Map map);

    /**
     * 资源异步树数据获取
     *
     * @param resourceType 资源类型
     * @param removeId 启动(排除)资源id
     * @param id 异步节点id
     */
    List getResourceTreeData(String resourceType, Long removeId, Long id);
}
