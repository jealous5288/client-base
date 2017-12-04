package net.ruixin.service.plat.organ;

import net.ruixin.domain.plat.organ.SysGlbOrganUserPost;
import net.ruixin.domain.plat.organ.SysUser;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-8-17.
 * 用户服务接口
 */
@SuppressWarnings("unused")
public interface IUserService {
    /**
     * 根据ID查询用户信息
     *
     * @param userId 用户ID
     * @return SysUser
     */
    SysUser getUserById(Long userId);

    /**
     * 查询用户列表
     *
     * @param map        查询条件
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @return FastPagination
     */
    FastPagination getUserList(Map map, String hasDelData);

    /**
     * 保存用户信息
     *
     * @param sysUser 用户实体
     */
    void saveUser(SysUser sysUser);

    /**
     * 根据机构ID查询用户List
     *
     * @param organId    机构ID
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @return List
     */
    List<Map<String, Object>> getUserListByOrganId(Long organId, String hasDelData);

    /**
     * 查询获取用户关联角色信息
     *
     * @param userId 用户id
     * @return Map
     */
    Map getUserGlxx(Long userId);

    /**
     * 获取无组织用户
     *
     * @param organId    组织id
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @return List
     */
    List<Map<String, Object>> getWgwUserListByOrganId(Long organId, String hasDelData);

    /**
     * 获取无岗位用户
     *
     * @param postId     岗位id
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @return List
     */
    List<Map<String, Object>> getUserListByPostId(Long postId, String hasDelData);

    /**
     * 删除或恢复用户
     *
     * @param userId 用户id
     * @param type   操作类型 0：删除  1：恢复
     */
    void delOrAbleUser(Long userId, String type);

    /**
     * 保存用户关联菜单的关联关系
     *
     * @param userId  用户id
     * @param menuIds 菜单ids
     */
    void saveUserMenu(Long userId, String menuIds);

    /**
     * 根据登录信息获取用户实体
     *
     * @param loginName 登录名
     * @param loginPwd  登录密码
     * @return SysUser
     */
    SysUser getUserByLoginInfo(String loginName, String loginPwd);

    /**
     * 修改用户密码
     *
     * @param newPwd 新密码
     * @param userId 用户id
     * @return ar
     */
    boolean changePwd(String newPwd, Long userId);

    /**
     * 根据用户id获取三要素list
     *
     * @param id 用户id
     * @return list
     */
    List<SysGlbOrganUserPost> getOrganUserPostsByUserId(Long id);

    /**
     * 获取前端需要的用户相关信息
     *
     * @param user 用户信息
     * @return map
     */
    Map getUserInfo(SysUser user);

    /**
     * 根据用户name获取用户
     *
     * @param name   用户name
     * @param ssbmId 排除的部门id
     * @param ids    排除的用户ids
     * @return list
     */
    List<Map<String, Object>> getUserByName(String name, Long ssbmId, String ids);

    /**
     * 根据用户信息获取用户角色信息
     *
     * @param user 用户信息
     * @return list
     */
    List<Map<String, Object>> getUserRoleInfo(SysUser user);

    /**
     * 根据登录信息获取用户实体
     *
     * @param loginName 登录名
     * @return SysUser
     */
    SysUser getUserByLoginName(String loginName);
}
