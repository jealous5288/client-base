package net.ruixin.service.plat.auth;

import net.ruixin.domain.plat.auth.SysDataAuth;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-9-22.
 * 权限控制类——控制规则、功能权限、数据权限
 */
public interface IAuthCfgService {

    /**
     * 通过模块id获取模块包含功能权限
     *
     * @param pageId 页面id
     * @return list
     */
    List<Map<String, Object>> getAuthRoleListByPageId(Long pageId);

    /**
     * 通过roleId获取模块及模块对应的功能权限
     *
     * @param roleId 角色id
     * @return list
     */
    List<Map<String, Object>> getAuthRoleListByRoleId(Long roleId);

    /**
     * 数据权限管理模块  关联对象的弹出层使用  查询配置了数据权限的对象列表
     *
     * @param map 可根据objectName查询
     * @return FastPagination
     */
    FastPagination getObjectList(Map map);

    /**
     * 查询当前用户对该对象的数据权限
     *
     * @param map 含user_id,obj_id,module_id,db_name 数据库表名,field_names 数据库表字段名  module_id不必传，其余必传
     * @return FastPagination
     */
    FastPagination getOraDataAuthListByParam(Map map);

    /**
     * 查询数据权限列表
     *
     * @param map ztlx:主体类型 1(角色)  2(用户), id 主体id, obj_id 对象id, module_id 模型id
     * @return FastPagination
     */
    FastPagination getPerDataAuthListByParam(Map map);

    /**
     * 根据主体类型、主体id删除数据权限
     *
     * @param ztlx  主体类型(1.角色  2.用户)
     * @param id    主体id或数据id
     * @param objId 对象id
     */
    void deleteDataAuth(String ztlx, Long id, Long objId);

    /**
     * 根据id获取数据权限实体
     *
     * @param dataAuthId 数据权限id
     * @return SysDataAuth
     */
    SysDataAuth getDataAuthById(Long dataAuthId);

    /**
     * 保存数据权限实体
     *
     * @param sysDataAuth 数据权限实体
     */
    void saveDataAuth(SysDataAuth sysDataAuth);

	/**
     * 根据用户id获取页面功能权限
     *
     * @param userId 用户id
     * @return list
     */
    List<Map<String, Object>> getPageActionAuthByUserId(Long userId);
}
