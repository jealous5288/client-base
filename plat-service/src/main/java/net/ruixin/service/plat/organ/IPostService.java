package net.ruixin.service.plat.organ;

import net.ruixin.domain.plat.organ.SysPost;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-8-17.
 * 岗位服务接口
 */
@SuppressWarnings("unused")
public interface IPostService {
    /**
     * 根据岗位ID查询岗位信息
     *
     * @param id 岗位ID
     * @return SysPost
     */
    SysPost getPostById(Long id);

    /**
     * 查询岗位列表
     *
     * @param map        查询条件
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @return FastPagination岗位分页信息
     */
    FastPagination getSysPostPagingList(Map map, String hasDelData);

    /**
     * 保存岗位信息
     *
     * @param sysPost 岗位实体
     */
    void savePost(SysPost sysPost);

    /**
     * 根据机构ID查询岗位信息
     *
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @param organId    机构ID
     * @param isTop      是否顶级岗位
     * @return 岗位List
     */
    List<Map<String, Object>> getPostListByOrganId(Long organId, Boolean isTop, String hasDelData);

    /**
     * 根据岗位ID查询下级岗位信息
     *
     * @param postId     岗位ID
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @return 岗位List
     */
    List<Map<String, Object>> getPostChildListByPostId(Long postId, String hasDelData);

    /**
     * 判断同一组织下岗位是否重名
     *
     * @param postId   岗位id
     * @param postName 岗位名
     * @param organId  组织id
     * @return boolean
     */
    boolean hasPostName(Long postId, String postName, Long organId);

    /**
     * 查询岗位关联角色信息
     *
     * @param postId     岗位ID
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @return AjaxReturn
     */
    Map getPostGlxx(Long postId, String hasDelData);

    /**
     * 删除或恢复岗位
     *
     * @param postId 岗位id
     * @param type   操作类型 0：删除  1：恢复
     */
    void delOrAblePost(Long postId, String type);
}
