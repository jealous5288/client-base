package net.ruixin.dao.plat.dictionary;

import net.ruixin.domain.plat.dictionary.SysDict;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 字典数据访问层
 */
@Repository
public class DictDao extends BaseDao<SysDict> implements IDictDao {

    @Override
    public FastPagination getDictList(Map map) {
        List<Object> args = new ArrayList<>();
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT D.ID,D.DICT_NAME,D.DICT_CODE,D.IS_EMPTY,D.DESCRIPTION,D.XGSJ " +
                "FROM SYS_DICT D WHERE D.SFYX_ST='1' ");
        if (RxStringUtils.isNotEmpty(map.get("dictName"))) {
            sql.append(" AND D.DICT_NAME LIKE ? ");
            args.add("%" + map.get("dictName") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("dictCode"))) {
            sql.append(" AND D.DICT_CODE LIKE ? ");
            args.add("%" + map.get("dictCode") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("dictType"))) {
            sql.append(" AND D.DICT_TYPE = ? ");
            args.add(map.get("dictType"));
        }
        sql.append(" ORDER BY D.XGSJ DESC ");
        return super.cacheNextPagePaginationSql(sql, args, (Integer) map.get("pageNo"),
                (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }

    @Override
    public void saveDict(SysDict sysDict) {
        super.saveOrUpdate(sysDict);
    }

    @Override
    public SysDict getDictById(Long id) {
        return super.get(id);
    }

    @Override
    public void deleteDict(Long dictId) {
        super.deleteCascade(dictId);
    }

    @Override
    public SysDict getDictByCode(String dictCode) {
        if (RxStringUtils.isEmpty(dictCode))
            return null;
        return super.getByHql("from SysDict x where x.dictCode=? and x.sfyx_st='1' ",
                dictCode.toUpperCase());
    }

    @Override
    public List<Map<String, Object>> getSubDictsByCode(String dictcode) {
        String sql = "SELECT SS.*\n" +
                "  FROM SYS_SUBDICT SS\n" +
                " WHERE SS.SFYX_ST = '1'\n" +
                "   AND SS.DICT_CODE = ? \n" +
                " ORDER BY SS.SORT ASC";
        return jdbcTemplate.queryForList(sql, dictcode);
    }

    @Override
    public List<SysDict> getAllDict() {
        return super.findListByHql("from SysDict x where x.sfyx_st='1'");
    }
}
