package net.ruixin.service.plat.dictionary;

import net.ruixin.domain.plat.dictionary.SysDict;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

/**
 * 字典
 */
public interface IDictService {

    /**
     * 保存字典实体
     *
     * @param sysDict 字典实体
     */
    void saveDict(SysDict sysDict);

    /**
     * 获取字典列表
     *
     * @param map 查询条件:dictName dictCode dictType
     */
    FastPagination getDictList(Map map);

    /**
     * 获取字典实体
     *
     * @param id 字典id
     */
    SysDict getDictById(Long id);

    /**
     * 删除字典
     *
     * @param dictId 字典id
     */
    void deleteDict(Long dictId);

    /**
     * 通过字典code查询字典list
     *
     * @param dictcode 字典code
     */
    List<Map<String,Object>> getSubDictsByCode(String dictcode);



}
