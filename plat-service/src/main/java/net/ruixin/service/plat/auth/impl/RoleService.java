package net.ruixin.service.plat.auth.impl;

import net.ruixin.dao.plat.auth.IRoleDao;
import net.ruixin.domain.plat.auth.SysRole;
import net.ruixin.service.plat.auth.IDataAuthGenerateService;
import net.ruixin.service.plat.auth.IRoleService;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-8-24.
 * 角色服务实现
 */
@Service
public class RoleService implements IRoleService {

    @Autowired
    private IRoleDao roleDao;

    @Autowired
    private IDataAuthGenerateService dataAuthGenerateService;

    @Override
    public SysRole getRoleById(Long id) {
        return roleDao.getRoleById(id);
    }

    @Override
    public List getRoleGlDataList(String roleIds) {
        return roleDao.getRoleGlDataList(roleIds);
    }

    @Override
    @Transactional
    public void saveRole(SysRole sysRole, String menuIds) {
        roleDao.saveRole(sysRole);
        roleDao.saveRoleMenu(sysRole.getId(), menuIds); //维护角色菜单关联关系
        if("1".equals(sysRole.getRoleType())){
            dataAuthGenerateService.generateDataAuth(sysRole, null); //系统角色生成数据权限
        }

    }

    @Override
    public FastPagination getRoleList(Map map) {
        return roleDao.getRoleList(map);
    }

    @Override
    @Transactional
    public void deleteRole(Long roleId) {
        roleDao.deleteRole(roleId);
    }

    @Override
    public AjaxReturn getWFNameByRoleId(Long roleId) {
        AjaxReturn ar = new AjaxReturn();
        List<Map<String, Object>> list = roleDao.getWFNameByRoleId(roleId);
        List<Object> newList = new ArrayList<>();
        if (list.size() > 0) { //被其它流程使用
            Map<String, Object> map = new HashMap<>();
            map.put("data", list);
            map.put("name", "工作流");
            map.put("showName", "NAME");
            newList.add(map);
            ar.setSuccess(false).setData(newList);
        } else { //未被其它流程使用
            ar.setSuccess(true);
        }
        return ar;
    }

    @Override
    public List<Map<String, Object>> getRoleByGlxx(Map map) {
        List<Map<String, Object>> organRoles = new ArrayList<>();
        if (RxStringUtils.isNotEmpty(map.get("organIds"))) {
            organRoles = roleDao.getRoleByGlxx(map.get("organIds").toString(), "2");
        }
        List<Map<String, Object>> postRoles = new ArrayList<>();
        if (RxStringUtils.isNotEmpty(map.get("postIds"))) {
            postRoles = roleDao.getRoleByGlxx(map.get("postIds").toString(), "1");
        }
        List<Map<String, Object>> newOrganRoles = getNewRoles(organRoles);
        List<Map<String, Object>> newPostRoles = getNewRoles(postRoles);
        List<Map<String, Object>> finalRoles = new ArrayList<>();
        List<Object> tempRoles = new ArrayList<>();
        if (newOrganRoles.size() > 0 && newPostRoles.size() > 0) {
            finalRoles.addAll(newPostRoles);//加入所有岗位查出的角色
            for (Map<String, Object> newPostRole : newPostRoles) {
                tempRoles.add(newPostRole.get("ROLEID"));
            }
            for (Map<String, Object> newOrganRole : newOrganRoles) {
                //加入机构查出并与岗位查出的角色不重复的角色
                if (!tempRoles.contains(newOrganRole.get("ROLEID"))) {
                    finalRoles.add(newOrganRole);
                }
            }
        } else if (newOrganRoles.size() > 0) {
            finalRoles.addAll(newOrganRoles);
        } else if (newPostRoles.size() > 0) {
            finalRoles.addAll(newPostRoles);
        }
        return finalRoles;
    }

    //处理同级的角色并返回
    private List<Map<String, Object>> getNewRoles(List<Map<String, Object>> oldRoles) {
        List<Map<String, Object>> newRoles = new ArrayList<>();
        if (oldRoles.size() > 0) {
            for (Map<String, Object> oldRole : oldRoles) {
                boolean sameFlag = false;
                for (Map<String, Object> newRole : newRoles) {
                    if (oldRole.get("ROLEID").equals(newRole.get("ROLEID"))) {
                        if ("UNVALID".equals(oldRole.get("SFQY_ST"))) {
                            newRole.put("SFQY_ST", "UNVALID");
                        }
                        sameFlag = true;
                        break;
                    }
                }
                if (!sameFlag) {
                    newRoles.add(oldRole);
                }
            }
        }
        return newRoles;
    }

    @Override
    public boolean checkRoleHasUser(Long roleId) {
        return roleDao.checkRoleHasUser(roleId);
    }

    @Override
    public List getRoleGlRule(Long roleId) {
        return roleDao.getRoleGlRule(roleId);
    }

    @Override
    public FastPagination getRoleGlbUser(Map map, Long roleId) {
        return roleDao.getRoleGlbUser(map,roleId);
    }
}
