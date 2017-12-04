package net.ruixin.dao.plat.organ;

import net.ruixin.domain.plat.organ.SysUser;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-8-17.
 * 用户DAO接口
 */
@SuppressWarnings("JavaDoc")
public interface IUserDao {

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
     * @return List<Map<String, Object>>
     */
    List<Map<String, Object>> getUserListByOrganId(Long organId, String hasDelData);

    /**
     * 根据岗位ID查询用户List
     *
     * @param postId     岗位ID
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @return List<Map<String,Object>>
     */
    List<Map<String, Object>> getUserListByPostId(Long postId, String hasDelData);

    /**
     * 获取用户关联信息
     *
     * @param userId 用户id
     * @return AjaxReturn
     */
    List<Map<String, Object>> getUserGlxx(Long userId);

    /**
     * 获取无岗位的用户
     *
     * @param organId    机构id
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @return
     */
    List<Map<String, Object>> getWgwUserListByOrganId(Long organId, String hasDelData);

    /**
     * 获取无机构无岗位的用户
     *
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @return
     */
    List<Map<String, Object>> getWjgWgwUserList(String hasDelData);

    /**
     * 恢复用户
     *
     * @param userId 用户id
     */
    void able(Long userId);

    /**
     * 删除用户
     *
     * @param userId 用户id
     */
    void del(Long userId);

    /**
     * 保存用户关联菜单的关联关系
     *
     * @param userId  用户id
     * @param menuIds 菜单ids
     */
    void saveUserMenu(Long userId, String menuIds);

    /**
     * 停用用户
     *
     * @param userId 用户id
     */
    void pause(Long userId);

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
     * 根据用户name获取用户
     *
     * @param name   用户name
     * @param ssbmId 排除的部门id
     * @param ids    排除的用户ids
     * @return list
     */
    List<Map<String, Object>> getUserByName(String name, Long ssbmId, String ids);

    /**
     * 根据用户登录账号获取登录账号
     * @param loginName 登录账号
     * @return 账号
     */
    SysUser findUserByLoginName(String loginName);
}
