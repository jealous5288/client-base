package net.ruixin.service.plat.organ.impl;

import net.ruixin.dao.plat.auth.IRoleDao;
import net.ruixin.dao.plat.organ.IOrganDao;
import net.ruixin.dao.plat.organ.IPostDao;
import net.ruixin.dao.plat.organ.IUserDao;
import net.ruixin.domain.plat.organ.SysOrgan;
import net.ruixin.service.plat.organ.IOrganService;
import net.ruixin.util.paginate.FastPagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-8-16.
 * 机构服务实现
 */
@Service
public class OrganService implements IOrganService {

    @Autowired
    private IOrganDao organDao;
    @Autowired
    private IUserDao userDao;
    @Autowired
    private IRoleDao roleDao;
    @Autowired
    private IPostDao postDao;


    @Override
    public SysOrgan getOrganById(Long id) {
        return organDao.getOrganById(id);
    }

    @Override
    public FastPagination getSysOrganPagingList(Map map, String hasDelData) {
        return organDao.getSysOrganPagingList(map, hasDelData);
    }

    @Override
    @Transactional
    public void saveOrgan(SysOrgan organ) {
        organDao.saveOrgan(organ);
    }

    @Override
    public List<Map<String, Object>> getOrganListByParentId(Long id, String hasDelData) {
        return organDao.getOrganListByParentId(id, hasDelData);
    }

    @Override
    public Map getOrganGlxx(Long organId, String hasDelData) {
        List<Map<String, Object>> organList = organDao.getOrganListByParentId(organId, hasDelData);
        List<Map<String, Object>> postList = postDao.getPostListByOrganId(organId, false, hasDelData);
        List<Map<String, Object>> userList = userDao.getUserListByOrganId(organId, hasDelData);
        List<Map<String, Object>> roleList = roleDao.getRoleListByEleId(organId, "2");
        Map<String, Object> map = new HashMap<>();
        map.put("organ", organList);
        map.put("post", postList);
        map.put("user", userList);
        map.put("role", roleList);
        return map;
    }

    @Override
    public boolean hasOrganName(Long organId, String organName, Long parentOrg) {
        return organDao.hasOrganName(organId, organName, parentOrg);
    }

    @Override
    @Transactional
    public void delOrAbleOrgan(Long organId, String type, Long newOrganId) {
        if ("1".equals(type)) {  //1 恢复
            roleDao.setHf_st("2", organId, "0", "1");
            organDao.able(organId);
        } else if ("0".equals(type)) {  //0 删除
            organDao.del(organId, newOrganId);
        } else if ("2".equals(type)) {  //2 停用
            roleDao.setHf_st("2", organId, "1", "0");
            organDao.pause(organId);
        }
    }

    @Override
    public boolean isOrganHasPost(Long organId, Long filterId) {
        return organDao.isOrganHasPost(organId, filterId);
    }

    @Override
    public SysOrgan getOrganByCode(String code) {
        return organDao.getOrganByCode(code);
    }
}
