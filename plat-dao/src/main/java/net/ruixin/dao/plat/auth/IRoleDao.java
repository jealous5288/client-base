package net.ruixin.dao.plat.auth;

import net.ruixin.domain.plat.auth.SysRole;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-8-24.
 * 角色DAO接口
 */
public interface IRoleDao {
    /**
     * 根据角色ID查询角色信息
     *
     * @param id 角色ID
     * @return 角色实体
     */
    SysRole getRoleById(Long id);

    /**
     * 保存角色信息
     *
     * @param sysRole 角色信息
     */
    void saveRole(SysRole sysRole);

    void freshRoleUser(Long id);

    /**
     * 查询角色列表
     *
     * @param map 查询条件
     * @return FastPagination
     */
    FastPagination getRoleList(Map map);

    /**
     * 根据角色ID查询关联对象信息
     *
     * @param roleIds 角色ID,逗号拼接的ID字符串
     * @return List
     */
    List getRoleGlDataList(String roleIds);

    /**
     * 删除角色信息
     *
     * @param roleId 角色ID
     */
    void deleteRole(Long roleId);

    /**
     * 通过关联id获取关联角色
     *
     * @param gl_ids  关联id，支持多个id同时获取
     * @param gl_type 关联类型 2 机构   1 岗位   0 用户
     * @return AjaxReturn
     */
    List<Map<String, Object>> getRoleByGlxx(String gl_ids, String gl_type);

    /**
     * 查询获取要素关联角色信息
     *
     * @param eleId   要素id
     * @param gl_type 关联要素类型 2 机构   1 岗位   0 用户
     * @return List
     */
    List<Map<String, Object>> getRoleListByEleId(Long eleId, String gl_type);

    /**
     * 设置SYS_GLB_ROLE恢复状态
     *
     * @param type    操作类型 0：删除 1：恢复
     * @param glId    关联id
     * @param hf_st   恢复状态  0：已恢复   1：可恢复
     * @param sfyx_st 是否有效标志 0：无效  1：有效
     */
    void setHf_st(String type, Long glId, String hf_st, String sfyx_st);

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

    /**
     * 生成角色菜单关联关系
     *
     * @param id      角色id
     * @param menuIds 菜单ids
     */
    void saveRoleMenu(Long id, String menuIds);

    /**
     * 获取用户所有角色的最大数据权限
     *
     * @param userId      用户id
     * @return String
     */
    String getRoleAuthTypeByUserId(Long userId);

    /**
     * 获取用户所有角色的最大数据权限
     *
     * @param map      搜索条件
     * @param roleId   角色id
     * @return FastPagination
     */
    FastPagination getRoleGlbUser(Map map, Long roleId);


    /**
     * 根据角色id查询工作流name
     *
     * @param roleId 角色ID
     * @return List
     */
    List<Map<String, Object>> getWFNameByRoleId(Long roleId);
}
