package net.ruixin.dao.plat.auth;

import net.ruixin.domain.plat.auth.SysAuthRole;
import net.ruixin.util.paginate.FastPagination;

import java.util.Map;

/**
 * Created by admin on 2016-8-19.
 * 功能权限DAO接口
 */
public interface IAuthRoleDao {
    /**
     * 根据ID查询功能权限信息
     *
     * @param authRoleId 功能权限ID
     * @return 模块实体
     */
    SysAuthRole getAuthRoleById(Long authRoleId);

    /**
     * 查询功能权限列表
     *
     * @param map 查询条件
     * @return 功能权限分页信息
     */
    FastPagination getAuthRoleList(Map map);

    /**
     * 保存功能权限
     *
     * @param sysAuthRole 功能权限实体
     */
    void saveAuthRole(SysAuthRole sysAuthRole);

    /**
     * 删除功能权限
     *
     * @param authRoleId 功能权限ID
     */
    void deleteAuthRole(Long authRoleId);

    /**
     * 恢复功能权限
     *
     * @param authRoleId 功能权限ID
     */
    void ableAuthRole(Long authRoleId);
}
