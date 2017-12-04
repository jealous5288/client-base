package net.ruixin.dao.plat.config;

import net.ruixin.domain.plat.config.SysConfig;
import net.ruixin.util.paginate.FastPagination;

import java.util.Map;

public interface IConfigDao {

    /**
     * 保存、修改配置
     *
     * @param config 配置
     */
    void saveConfig(SysConfig config);

    /**
     * 根据ID获取配置实体
     *
     * @param id 配置ID
     */
    SysConfig getConfigById(Long id);

    /**
     * 根据ID删除配置
     *
     * @param id 配置ID
     */
    void delConfig(Long id);

    /**
     * 分页列表查询
     *
     * @param map 查询条件
     */
    FastPagination getConfigList(Map map);
}
