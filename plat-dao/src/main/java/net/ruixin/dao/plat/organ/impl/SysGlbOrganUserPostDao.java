package net.ruixin.dao.plat.organ.impl;

import net.ruixin.dao.plat.organ.ISysGlbOrganUserPostDao;
import net.ruixin.domain.plat.organ.SysGlbOrganUserPost;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by admin on 2016-8-17.
 * 组织用户岗位关联DAO实现
 */
@Repository
public class SysGlbOrganUserPostDao extends BaseDao<SysGlbOrganUserPost> implements ISysGlbOrganUserPostDao {
    @Override
    public List<SysGlbOrganUserPost> getSysGlbOrganUserPostListByOrganId(Integer id) {
        String hql = "from SysGlbOrganUserPost t where t.sfyx_st = '1' and t.organId = ? ";
        return super.findListByHql(hql, id);
    }

    @Override
    public List<SysGlbOrganUserPost> getOrganUserPostsByUserId(Long id) {
        String hql = "from SysGlbOrganUserPost t where t.sfyx_st = '1' and t.userId = ? ";
        return super.findListByHql(hql, id);
    }
}
