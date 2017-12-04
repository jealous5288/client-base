package net.ruixin.dao.plat.page;

import net.ruixin.domain.plat.auth.SysPage;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-9-5
 * 页面DAO实现
 */
public interface IPageDao {
    /**
     * 根据ID查询页面信息
     *
     * @param pageId 页面ID
     * @return SysPage
     */
    SysPage getPageById(Long pageId);

    /**
     * 保存页面信息
     *
     * @param sysPage 页面实体
     */
    void savePage(SysPage sysPage);

    /**
     * 页面有效状态变更
     *
     * @param pageId 页面ID
     */
    void deletePage(Long pageId);

    /**
     * 分页查询流程表单
     *
     * @param map 查询条件
     * @return 分页页面列表
     */
    FastPagination getPageList(Map map);

    /**
     * 根据页面id查询模块name
     *
     * @param pageId 页面ID
     * @return list
     */
    List<Map<String, Object>> getModuleNameByPageId(Long pageId);

    //清空对应页面的模块id
    void clearModuleId(Long moduleId);

    /**
     * 获取页面list 搜索下拉列表
     *
     * @return List
     */
    List<Map<String, Object>> getPageSearchList();

    /**
     * 根据页面id获取菜单name
     *
     * @param pageId 页面id
     * @return list
     */
    List<Map<String, Object>> getMenuNameByPageId(Long pageId);

    /**
     * 根据页面id获取规则name
     *
     * @param pageId 页面id
     * @return list
     */
    List<Map<String, Object>> getRuleNameByPageId(Long pageId);

    /**
     * 根据页面id查询工作流name
     *
     * @param pageId 页面ID
     * @return list
     */
    List<Map<String,Object>> getWFNameByPageId(Long pageId);


}
