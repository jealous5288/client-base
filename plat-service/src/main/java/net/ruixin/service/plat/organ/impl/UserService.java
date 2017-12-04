package net.ruixin.service.plat.organ.impl;

import net.ruixin.dao.plat.auth.IRoleDao;
import net.ruixin.dao.plat.organ.IOrganDao;
import net.ruixin.dao.plat.organ.ISysGlbOrganUserPostDao;
import net.ruixin.dao.plat.organ.IUserDao;
import net.ruixin.domain.plat.organ.SysGlbOrganUserPost;
import net.ruixin.domain.plat.organ.SysUser;
import net.ruixin.service.plat.auth.IDataAuthGenerateService;
import net.ruixin.service.plat.organ.IUserService;
import net.ruixin.service.plat.shiro.ShiroKit;
import net.ruixin.util.cache.Cache;
import net.ruixin.util.cache.CacheKey;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-8-17.
 * 用户服务实现
 */
@Service
public class UserService implements IUserService {

    @Autowired
    private IUserDao userDao;
    @Autowired
    private ISysGlbOrganUserPostDao sysGlbOrganUserPostDao;
    @Autowired
    private IRoleDao roleDao;
    @Autowired
    private IOrganDao organDao;

    @Autowired
    private IDataAuthGenerateService dataAuthGenerateService;

    @Override
    public SysUser getUserById(Long userId) {
        return userDao.getUserById(userId);
    }

    @Override
    public FastPagination getUserList(Map map, String hasDelData) {
        return userDao.getUserList(map, hasDelData);
    }

    @Override
    @Transactional
    public void saveUser(SysUser sysUser) {
        //密码使用MD5计算
        String pwd = sysUser.getLoginPwd();
        sysUser.setLoginPwd(ShiroKit.md5Nosalt(pwd));
        userDao.saveUser(sysUser);
        dataAuthGenerateService.generateDataAuth(sysUser);
    }

    @Override
    public List<Map<String, Object>> getUserListByOrganId(Long organId, String hasDelData) {
        return userDao.getUserListByOrganId(organId, hasDelData);
    }

    @Override
    public Map getUserGlxx(Long userId) {
        List<Map<String, Object>> roleList = roleDao.getRoleListByEleId(userId, "3");
        Map<String, Object> map = new HashMap<>();
        map.put("role", roleList);
        return map;
    }

    @Override
    public List<Map<String, Object>> getWgwUserListByOrganId(Long organId, String hasDelData) {
        return userDao.getWgwUserListByOrganId(organId, hasDelData);
    }

    @Override
    public List<Map<String, Object>> getUserListByPostId(Long postId, String hasDelData) {
        return userDao.getUserListByPostId(postId, hasDelData);
    }

    @Override
    @Transactional
    public void delOrAbleUser(Long userId, String type) {
        if ("1".equals(type)) {  //1 恢复
            roleDao.setHf_st("3", userId, "0", "1");  //3 用户
            userDao.able(userId);
        } else if ("0".equals(type)) {  //0 删除
            roleDao.setHf_st("3", userId, "1", "0");
            userDao.del(userId);
        } else if ("2".equals(type)) {  //2 停用
            roleDao.setHf_st("3", userId, "1", "0");
            userDao.pause(userId);
        }
    }

    @Override
    @Transactional
    public void saveUserMenu(Long userId, String menuIds) {
        userDao.saveUserMenu(userId, menuIds);
    }

    @Override
    public SysUser getUserByLoginInfo(String loginName, String loginPwd) {
        return userDao.getUserByLoginInfo(loginName, loginPwd);
    }

    @Override
    @Transactional
    public boolean changePwd(String newPwd, Long userId) {
        return userDao.changePwd(newPwd, userId);
    }

    @Override
    public List<SysGlbOrganUserPost> getOrganUserPostsByUserId(Long id) {
        return sysGlbOrganUserPostDao.getOrganUserPostsByUserId(id);
    }

    @Override
    public Map getUserInfo(SysUser user) {
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("name", user.getUserName());
        String authType = roleDao.getRoleAuthTypeByUserId(user.getId());
        userInfo.put("authType", RxStringUtils.isNotEmpty(authType) ? authType : "1");
        userInfo.put("dftOrganId", user.getDefault_organ_id());
        userInfo.put("dftOrganName", user.getDftOrganName());
        userInfo.put("dftOrganCode", user.getDftOrganCode());
        List<Map<String, Object>> bmList = organDao.getBmByUserId(user.getId());
        if (bmList.size() > 0) {
            userInfo.put("bmOrganId", bmList.get(0).get("ID"));
            userInfo.put("bmOrganName", bmList.get(0).get("ORGAN_NAME"));
            userInfo.put("bmOrganCode", bmList.get(0).get("ORGAN_CODE"));
        }
        return userInfo;
    }

    @Override
    public List<Map<String, Object>> getUserByName(String name, Long ssbmId, String ids) {
        return userDao.getUserByName(name, ssbmId, ids);
    }

    @Override
    public List<Map<String, Object>> getUserRoleInfo(SysUser user) {
        return userDao.getUserGlxx(user.getId());
    }

    @Override
    @Cacheable(value = Cache.USER, key = "'" + CacheKey.USER_NAME + "'+#loginName")
    public SysUser getUserByLoginName(String loginName) {
        return userDao.findUserByLoginName(loginName);
    }
}
