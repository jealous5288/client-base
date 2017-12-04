package net.ruixin.service.plat.organ.impl;

import net.ruixin.dao.plat.auth.IRoleDao;
import net.ruixin.dao.plat.organ.IPostDao;
import net.ruixin.dao.plat.organ.IUserDao;
import net.ruixin.domain.plat.organ.SysPost;
import net.ruixin.service.plat.organ.IPostService;
import net.ruixin.util.paginate.FastPagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-8-17.
 * 岗位服务实现
 */
@Service
public class PostService implements IPostService {

    @Autowired
    private IPostDao postDao;
    @Autowired
    private IUserDao userDao;
    @Autowired
    private IRoleDao roleDao;

    @Override
    public SysPost getPostById(Long id) {
        return postDao.getPostById(id);
    }

    @Override
    public FastPagination getSysPostPagingList(Map map, String hasDelData) {
        return postDao.getSysPostPagingList(map, hasDelData);
    }

    @Override
    @Transactional
    public void savePost(SysPost sysPost) {
        postDao.savePost(sysPost);
    }

    @Override
    public List<Map<String, Object>> getPostListByOrganId(Long organId, Boolean isTop, String hasDelData) {
        return postDao.getPostListByOrganId(organId, isTop, hasDelData);
    }

    @Override
    public List<Map<String, Object>> getPostChildListByPostId(Long postId, String hasDelData) {
        return postDao.getPostChildListByPostId(postId, hasDelData);
    }

    @Override
    public boolean hasPostName(Long postId, String postName, Long organId) {
        return postDao.hasPostName(postId, postName, organId);
    }

    @Override
    public Map getPostGlxx(Long postId, String hasDelData) {
        List<Map<String, Object>> userList = userDao.getUserListByPostId(postId, hasDelData);
        List<Map<String, Object>> postList = postDao.getPostChildListByPostId(postId, hasDelData);
        List<Map<String, Object>> roleList = roleDao.getRoleListByEleId(postId, "1");
        Map<String, Object> map = new HashMap<>();
        map.put("user", userList);
        map.put("post", postList);
        map.put("role", roleList);
        return map;
    }

    @Override
    @Transactional
    public void delOrAblePost(Long postId, String type) {
        if ("1".equals(type)) {  //1 恢复
            roleDao.setHf_st("1", postId, "0", "1");
            postDao.able(postId);
        } else if ("0".equals(type)) {  //0 删除
            postDao.del(postId);
        } else if ("2".equals(type)) {  //2 停用
            roleDao.setHf_st("1", postId, "1", "0");
            postDao.pause(postId);
        }
    }

}
