package net.ruixin.dao.plat.auth;

import net.ruixin.domain.plat.auth.SysModule;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-8-19.
 * 系统模块DAO接口
 */
public interface IModuleDao {
    /**
     * 根据ID查询模块信息
     *
     * @param moduleId 模块ID
     * @return 模块实体
     */
    SysModule getModuleById(Long moduleId);

    /**
     * 查询模块列表
     *
     * @param map 查询条件
     * @return 模块分页信息
     */
    FastPagination getModuleList(Map map);

    /**
     * 保存模块信息
     *
     * @param sysModule 模块实体
     */
    void saveModule(SysModule sysModule);

    /**
     * 删除模块信息
     *
     * @param moduleId 模块ID
     */
    void deleteModule(Long moduleId);

    /**
     * 获取模块list 搜索下拉列表
     *
     * @return List
     */
    List<Map<String, Object>> getModuleSearchList();

    /**
     * 获取顺序号最大值
     *
     * @param tableName 表名
     * @param fieldName 字段名
     * @return AjaxReturn
     */
    String getMaxSort(String tableName, String fieldName);

    /**
     * 根据模块id查询规则名称
     *
     * @param moduleId 模块id
     * @return list
     */
    List<Map<String,Object>> getRuleNameByModuleId(Long moduleId);

    /**
     * 根据模块id查询菜单名称
     *
     * @param moduleId 模块id
     * @return list
     */
    List<Map<String,Object>> getMenuNameByModuleId(Long moduleId);
}
