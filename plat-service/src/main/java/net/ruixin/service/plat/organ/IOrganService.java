package net.ruixin.service.plat.organ;

import net.ruixin.domain.plat.organ.SysOrgan;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

/**
 * Created by Jealous on 2016-8-15.
 * 机构服务接口
 */
public interface IOrganService {

    /**
     * 通过组织机构ID获取组织机构
     *
     * @param id 机构ID
     * @return 机构
     */
    SysOrgan getOrganById(Long id);

    /**
     * 查询组织机构列表
     *
     * @param map        查询条件
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @return FastPagination
     */
    FastPagination getSysOrganPagingList(Map map, String hasDelData);

    /**
     * 保存、修改组织机构
     *
     * @param organ 组织机构实体对象
     */
    void saveOrgan(SysOrgan organ);

    /**
     * 根据机构ID查询下级机构
     *
     * @param id         机构ID
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @return 机构List
     */
    List<Map<String, Object>> getOrganListByParentId(Long id, String hasDelData);

    /**
     * 查询组织关联角色信息
     *
     * @param organId    组织机构ID
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @return AjaxReturn
     */
    Map getOrganGlxx(Long organId, String hasDelData);

    /**
     * 验证同一组织机构下 简称不能重复
     *
     * @param organId   机构ID
     * @param organName 机构名称
     * @param parentOrg 上级机构ID
     * @return boolean
     */
    boolean hasOrganName(Long organId, String organName, Long parentOrg);

    /**
     * 删除或恢复组织机构
     *
     * @param organId    机构id
     * @param type       操作类型 0：删除  1：恢复   2:停用
     * @param newOrganId 调整后的机构id
     */
    void delOrAbleOrgan(Long organId, String type, Long newOrganId);

    /**
     * 判断机构下是否有直接岗位
     *
     * @param organId  机构id
     * @param filterId 过滤id
     * @return boolean
     */
    boolean isOrganHasPost(Long organId, Long filterId);

    /**
     * 通过组织机构代码获取组织机构
     *
     * @param code 机构代码
     * @return 机构
     */
    SysOrgan getOrganByCode(String code);
}
