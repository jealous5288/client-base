package net.ruixin.service.plat.auth;

import net.ruixin.domain.plat.auth.SysMenu;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-10-12
 * 系统菜单服务接口
 */
public interface IMenuService {

    /**
     * 根据ID查询菜单信息
     *
     * @param id 菜单ID
     * @return 菜单实体
     */
    SysMenu getMenuById(Long id);

    /**
     * 查询菜单列表
     *
     * @param map 查询条件
     * @return 菜单分页信息
     */
    FastPagination getMenuList(Map map);

    /**
     * 保存菜单信息
     *
     * @param sysMenu 菜单实体
     */
    void saveMenu(SysMenu sysMenu);

    /**
     * 删除菜单信息
     *
     * @param menuId 菜单ID
     */
    void deleteMenu(Long menuId);

    /**
     * 根据父级菜单获取子菜单
     *
     * @param parent 父级菜单id
     * @param menuId 菜单id
     * @return AjaxReturn
     */
    List<Map<String, Object>> getMenuByParent(Long parent, Long menuId);

    /**
     * 同步获取菜单树
     *
     * @return list
     */
    List getMenuTree(Long filterId);

    /**
     * 同步获取角色菜单树
     *
     * @param filterId 过滤id
     * @param roleId   角色id
     * @return list
     */
    List getRoleMenuTree(Long filterId, Long roleId);

    /**
     * 同步获取用户菜单树
     *
     * @param filterId 过滤id
     * @param userId   用户id
     * @return list
     */
    List getUserMenuTree(Long filterId, Long userId);

    /**
     * 根据用户id获取菜单列表
     *
     * @param userId 用户id
     * @return list
     */
    List getMenusByUserId(Long userId);

    List getUserMenus(Long userId, String sfwhgxcd);
}
