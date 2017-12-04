package net.ruixin.dao.plat.dictionary;

import net.ruixin.domain.plat.dictionary.SysDict;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

/**
 * 字典
 */
public interface IDictDao {

    /**
     * 获取字典列表
     *
     * @param map 查询条件:
     */
    FastPagination getDictList(Map map);

    /**
     * 保存字典实体
     *
     * @param sysDict 字典实体:dictName dictCode dictType
     */
    void saveDict(SysDict sysDict);

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
     * 获取字典信息
     *
     * @param dictCode 字典编码
     */
    SysDict getDictByCode(String dictCode);

    /**
     * 通过字典code查询字典list
     *
     * @param dictcode 字典code
     */
    List<Map<String,Object>> getSubDictsByCode(String dictcode);

    /*
    * 获取所有的字典项
    * */
    List<SysDict> getAllDict();
}
