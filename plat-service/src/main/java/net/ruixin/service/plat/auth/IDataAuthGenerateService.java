package net.ruixin.service.plat.auth;

import net.ruixin.domain.plat.auth.SysRole;
import net.ruixin.domain.plat.organ.SysUser;
import org.springframework.scheduling.annotation.Async;

/**
 * Created by Ruixin on 2016/9/29.
 * 数据权限生成服务类
 */
public interface IDataAuthGenerateService {

    /**
     * 根据角色生成数据权限
     *
     * @param sysRole 角色信息
     * @param userId  用户ID，如果用户ID为空，生成角色关联数据权限，如果非空，生成该用户关联的角色对应数据权限
     */
    @Async
    void generateDataAuth(SysRole sysRole, Long userId);

    /**
     * 根据用户生成数据权限
     *
     * @param sysUser 用户
     */
    @Async
    void generateDataAuth(SysUser sysUser);
}
