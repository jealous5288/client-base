package net.ruixin.service.plat.auth.impl;

import net.ruixin.dao.plat.auth.IAuthCfgDao;
import net.ruixin.domain.plat.auth.SysDataAuth;
import net.ruixin.service.plat.auth.IAuthCfgService;
import net.ruixin.util.paginate.FastPagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-9-22.
 * 权限控制类——控制规则、功能权限、数据权限
 */
@Service
public class AuthCfgService implements IAuthCfgService {

    @Autowired
    private IAuthCfgDao authCfgDao;

    @Override
    public List<Map<String, Object>> getAuthRoleListByPageId(Long pageId) {
        return authCfgDao.getAuthRoleListByPageId(pageId);
    }

    @Override
    public List<Map<String, Object>> getAuthRoleListByRoleId(Long roleId) {
        List<Map<String, Object>> oldList = authCfgDao.getAuthRoleListByRoleId(roleId);
        List<Map<String, Object>> newList = new ArrayList<>();
        List<Map<String, Object>> tempList;
        Map<String, Object> newMap;
        Map<String, Object> tempMap;
        boolean flag;
        for (int i = 0; i < oldList.size(); ) {
            flag = false;
            newMap = new HashMap<>();
            newMap.put("PAGE_ID", oldList.get(i).get("PAGE_ID"));
            newMap.put("NAME", oldList.get(i).get("NAME"));
            tempList = new ArrayList<>();
            for (int j = i; j < oldList.size(); j++) {
                if (oldList.get(j).get("PAGE_ID").equals(newMap.get("PAGE_ID"))) {
                    tempMap = new HashMap<>();
                    tempMap.put("AUTHROLEID", oldList.get(j).get("AUTHROLE_ID"));
                    tempMap.put("PAGEAUTHROLEID", oldList.get(j).get("GLB_ID"));
                    tempMap.put("ROLEID", oldList.get(j).get("ROLE_ID"));
                    tempMap.put("ID",oldList.get(j).get("GRM_ID"));
                    tempMap.put("SFYX_ST", "VALID");
                    tempList.add(tempMap);
                } else {
                    flag = true;
                    i = j;
                    break;
                }
            }
            newMap.put("authRoleList", tempList);
            newList.add(newMap);
            if (!flag) {
                break;
            }
        }
        return newList;
    }

    @Override
    public FastPagination getObjectList(Map map) {
        return authCfgDao.getObjectList(map);
    }

    @Override
    public FastPagination getOraDataAuthListByParam(Map map) {
        return authCfgDao.getOraDataAuthListByParam(map);
    }

    @Override
    public FastPagination getPerDataAuthListByParam(Map map) {
        return authCfgDao.getPerDataAuthListByParam(map);
    }

    @Override
    @Transactional
    public void deleteDataAuth(String ztlx, Long id, Long objId) {
        authCfgDao.deleteDataAuth(ztlx, id, objId);
    }

    @Override
    public SysDataAuth getDataAuthById(Long dataAuthId) {
        return authCfgDao.getDataAuthById(dataAuthId);
    }

    @Override
    @Transactional
    public void saveDataAuth(SysDataAuth sysDataAuth) {
        authCfgDao.saveDataAuth(sysDataAuth);
    }

	@Override
    public List<Map<String, Object>> getPageActionAuthByUserId(Long userId) {
        return authCfgDao.getPageActionAuthByUserId(userId);
    }

}
