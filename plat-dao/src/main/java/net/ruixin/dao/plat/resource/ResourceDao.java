package net.ruixin.dao.plat.resource;

import net.ruixin.domain.plat.resource.SysResource;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class ResourceDao extends BaseDao<SysResource> implements IResourceDao {

    @Override
    public void saveResource(SysResource resource) {
        super.saveOrUpdate(resource);
    }

    @Override
    public SysResource getResourceById(Long id) {
        return super.get(id);
    }

    @Override
    public void delResource(Long id) {
        super.delete(id);
    }

    @Override
    public FastPagination getResourceList(Map map) {
        StringBuilder sql = new StringBuilder("SELECT R.ID, R.NAME, R.CODE, R.TYPE, R.XGSJ\n" +
                "  FROM SYS_RESOURCE R WHERE R.SFYX_ST='1' ");
        List<Object> args = new ArrayList<>();
        if (RxStringUtils.isNotEmpty(map.get("name"))) {
            sql.append(" AND R.NAME LIKE ? ");
            args.add("%" + map.get("name") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("code"))) {
            sql.append(" AND R.CODE LIKE ? ");
            args.add("%" + map.get("code") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("type"))) {
            sql.append(" AND R.TYPE = ? ");
            args.add(map.get("type"));
        }
        sql.append(" ORDER BY R.XGSJ DESC");
        return super.cacheNextPagePaginationSql(sql, args, (Integer) map.get("pageNo"),
                (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }

    @Override
    public List getResourceTreeData(String resourceType, Long removeId, Long id) {
        StringBuilder sql = new StringBuilder();
        List<Object> args = new ArrayList<>();
        sql.append(" SELECT R.ID, R.NAME, R.CODE, R.TYPE, R.XGSJ,\n" +
                " (SELECT COUNT(R2.ID) FROM SYS_RESOURCE R2 WHERE R2.PARENT_ID = R.ID ");
        if(null != removeId){
            sql.append("AND R2.ID <> ? ");
            args.add(removeId);
        }
        sql.append(" AND INSTR(?,R.TYPE) > 0 ");
        args.add(","+resourceType+",");
        sql.append(" AND R2.SFYX_ST = '1') CHILD_NUM \n" +
                "  FROM SYS_RESOURCE R WHERE INSTR(?,R.TYPE) > 0 ");
        args.add(","+resourceType+",");
        if(null != removeId){
            sql.append("AND R.ID <> ? ");
            args.add(removeId);
        }
        if(null == id){
            sql.append("AND (R.PARENT_TYPE IS NULL OR INSTR(? ,R.PARENT_TYPE) = 0) ");
            args.add(","+resourceType+",");
        }else{
            sql.append("AND R.PARENT_ID = ? ");
            args.add(id);
        }
        sql.append("AND R.SFYX_ST = '1' ");
        return getJdbcTemplate().queryForList(sql.toString(),args.toArray());
    }
}