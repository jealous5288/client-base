package net.ruixin.service.plat.shiro.factory;

import net.ruixin.domain.plat.auth.SysGlbRole;
import net.ruixin.domain.plat.organ.SysUser;
import net.ruixin.service.plat.organ.IUserService;
import net.ruixin.domain.plat.auth.ShiroUser;
import net.ruixin.util.spring.SpringContextHolder;
import org.apache.shiro.authc.CredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@DependsOn("springContextHolder")
@Transactional(readOnly = true)
public class ShiroFactroy implements IShiro {

    @Autowired
    private IUserService userService;

    public static IShiro me() {
        return SpringContextHolder.getBean(IShiro.class);
    }

    @Override
    public SysUser user(String account) {
        SysUser user = userService.getUserByLoginName(account);
        // 账号不存在
        if (null == user) {
            throw new CredentialsException();
        }
        // 账号被锁定
        if (!Objects.equals(user.getIs_Blocked(),"0")){
            throw new LockedAccountException();
        }
        return user;
    }

    @Override
    public ShiroUser shiroUser(SysUser user) {
        ShiroUser shiroUser = new ShiroUser();

        shiroUser.setId(user.getId());            // 账号id
        shiroUser.setAccount(user.getLoginName());// 账号
        shiroUser.setDeptId(user.getDefault_organ_id());    // 部门id
        shiroUser.setDeptName(user.getDftOrganName());// 部门名称
        shiroUser.setName(user.getUserName());        // 用户名称
        shiroUser.setSfwhgxcd(user.getSfwhgxcd());   //是否个性维护菜单

        List<SysGlbRole> roles = user.getSysGlbRoleList();
        List<Long> roleList = new ArrayList<>();
        List<String> roleNameList = new ArrayList<>();
        for(SysGlbRole glbRole : roles){
            roleList.add(glbRole.getRoleId());
            roleNameList.add(glbRole.getRole_name());
        }
        shiroUser.setRoleList(roleList);
        shiroUser.setRoleNames(roleNameList);

        return shiroUser;
    }

    @Override
    public List<String> findPermissionsByRoleId(Long roleId) {
        //抽象所有的资源为权限数据，统一管理。资源的关键信息URL
        return null;
    }

    @Override
    public String findRoleNameByRoleId(Long roleId) {
        return null;
    }

    @Override
    public SimpleAuthenticationInfo info(ShiroUser shiroUser, SysUser user, String realmName) {
        String credentials = user.getLoginPwd();
        // 密码加盐处理
//        String source = user.getSalt();
//        ByteSource credentialsSalt = new Md5Hash(source);
//        return new SimpleAuthenticationInfo(shiroUser, credentials, credentialsSalt, realmName);
        return new SimpleAuthenticationInfo(shiroUser, credentials, realmName);
    }

    @Override
    public Set<String> findRoles(String appKey, String username) {
        return null;
    }

    @Override
    public Set<String> findPermissions(String appKey, String username) {
        return null;
    }
}
