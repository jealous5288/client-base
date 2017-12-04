package net.ruixin.dao.plat.organ;

import net.ruixin.domain.plat.organ.SysGlbOrganUserPost;

import java.util.List;

/**
 * Created by admin on 2016-8-17.
 * 组织用户岗位关联DAO接口
 */
public interface ISysGlbOrganUserPostDao {
    /**
     * 根据组织机构ID查询组织用户岗位关联信息
     *
     * @param id 组织机构ID
     * @return 组织用户岗位关联集合
     */
    List<SysGlbOrganUserPost> getSysGlbOrganUserPostListByOrganId(Integer id);

    List<SysGlbOrganUserPost> getOrganUserPostsByUserId(Long id);
}
