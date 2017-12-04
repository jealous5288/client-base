package net.ruixin.service.plat.auth;

import net.ruixin.domain.plat.auth.SysRole;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-8-24.
 * 角色服务接口
 */
public interface IRoleService {
    /**
     * 根据ID查询角色信息
     *
     * @param id 角色ID
     * @return 角色实体
     */
    SysRole getRoleById(Long id);

    /**
     * 根据角色ID查询关联对象信息
     *
     * @param roleIds 角色ID,逗号拼接的ID字符串
     * @return List
     */
    List getRoleGlDataList(String roleIds);

    /**
     * 保存角色信息
     *
     * @param sysRole 角色信息
     * @param menuIds 菜单ids
     */
    void saveRole(SysRole sysRole, String menuIds);

    /**
     * 查询角色列表
     *
     * @param map 查询条件
     * @return FastPagination
     */
    FastPagination getRoleList(Map map);

    /**
     * 删除角色信息
     *
     * @param roleId 角色ID
     */
    void deleteRole(Long roleId);

    /**
     * 根据角色id查询工作流name
     *
     * @param roleId 角色ID
     * @return AjaxReturn
     */
    AjaxReturn getWFNameByRoleId(Long roleId);

    /**
     * 通过关联id获取关联角色
     *
     * @param map organIds postIds 关联类型  3：用户  1：岗位  2：机构
     * @return List
     */
    List<Map<String, Object>> getRoleByGlxx(Map map);

    /**
     * 查询角色下有无关联用户
     *
     * @param roleId 角色id
     * @return Boolean
     */
    boolean checkRoleHasUser(Long roleId);

    /**
     * 查询角色下规则
     *
     * @param roleId 角色id
     * @return List
     */
    List getRoleGlRule(Long roleId);

    /*
    *获取角色关联用户
    * @param map 查询条件
    * @param roleId 角色id
    * @return FastPagination
    * */
    FastPagination getRoleGlbUser(Map map, Long roleId);
}
