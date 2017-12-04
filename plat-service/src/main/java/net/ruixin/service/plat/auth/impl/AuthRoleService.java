package net.ruixin.service.plat.auth.impl;

import net.ruixin.dao.plat.auth.IAuthRoleDao;
import net.ruixin.domain.plat.auth.SysAuthRole;
import net.ruixin.service.plat.auth.IAuthRoleService;
import net.ruixin.util.paginate.FastPagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

/**
 * Created by admin on 2016-8-19.
 * 功能权限服务实现
 */
@Service
public class AuthRoleService implements IAuthRoleService {

    @Autowired
    private IAuthRoleDao authRoleDao;


    @Override
    public SysAuthRole getAuthRoleById(Long authRoleId) {
        return authRoleDao.getAuthRoleById(authRoleId);
    }

    @Override
    public FastPagination getAuthRoleList(Map map) {
        return authRoleDao.getAuthRoleList(map);
    }

    @Override
    @Transactional
    public void saveAuthRole(SysAuthRole sysAuthRole) {
        authRoleDao.saveAuthRole(sysAuthRole);
    }

    @Override
    @Transactional
    public void delOrAbleAuthRole(Long authRoleId, String type) {
        if ("1".equals(type)) {
            authRoleDao.ableAuthRole(authRoleId);
        } else if ("0".equals(type)) {
            authRoleDao.deleteAuthRole(authRoleId);
        }
    }
}
