package net.ruixin.service.plat.auth;

import net.ruixin.domain.plat.auth.SysAuthRole;
import net.ruixin.util.paginate.FastPagination;

import java.util.Map;

/**
 * Created by admin on 2016-10-19
 * 功能权限服务接口
 */
public interface IAuthRoleService {
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
     * 删除或恢复功能权限
     *
     * @param authRoleId 功能权限ID
     * @param type       操作类型 0：删除  1：恢复
     */
    void delOrAbleAuthRole(Long authRoleId, String type);
}
