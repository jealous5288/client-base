package net.ruixin.dao.plat.auth.impl;

import net.ruixin.dao.plat.auth.IMenuDao;
import net.ruixin.domain.plat.auth.SysMenu;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-10-12
 * 系统菜单DAO实现
 */
@Repository
public class MenuDao extends BaseDao<SysMenu> implements IMenuDao {

    @Override
    public SysMenu getMenuById(Long id) {
        return super.get(id);
    }

    @Override
    public FastPagination getMenuList(Map map) {
        StringBuilder sb = new StringBuilder();
        sb.append("SELECT MN.ID MENU_ID,MN.CODE MENU_CODE,\n" +
                "       MN.NAME MENU_NAME,\n" +
                "       MN.PARENT,\n" +
                "       (SELECT M.NAME FROM SYS_MENU M WHERE M.ID = MN.PARENT) PARENT_NAME,\n" +
                "       MN.PAGE_ID,\n" +
                "       PAGE.NAME PAGE_NAME,\n" +
                "       MN.SORT,\n" +
                "       MN.XGSJ\n" +
                "  FROM SYS_MENU MN " +
                "  LEFT JOIN SYS_PAGE PAGE\n" +
                "    ON MN.PAGE_ID = PAGE.ID\n" +
                "   AND PAGE.SFYX_ST = '1'\n" +
                " WHERE MN.SFYX_ST = '1' ");
        List<Object> args = new ArrayList<>();
        if (RxStringUtils.isNotEmpty(map.get("menuName"))) {
            sb.append(" AND MN.NAME LIKE ? ");
            args.add("%" + map.get("menuName") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("parentMenu"))) {
            sb.append(" AND MN.PARENT = ? ");
            args.add(map.get("parentMenu"));
        }
        if (RxStringUtils.isNotEmpty(map.get("pageId"))) {
            sb.append(" AND MN.PAGE_ID = ? ");
            args.add(map.get("pageId"));
        }
        sb.append(" ORDER BY MN.XGSJ DESC");
        return super.cacheNextPagePaginationSql(sb, args, (Integer) map.get("pageNo"),
                (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }

    @Override
    public void saveMenu(SysMenu sysMenu) {
        super.saveOrUpdate(sysMenu);
    }

    @Override
    public void deleteMenu(Long menuId) {
        super.delete(menuId);
        String dSql = "DELETE FROM SYS_GLB_MENU GM WHERE GM.MENU_ID = ? ";
        super.executeSqlUpdate(dSql, menuId);
    }

    @Override
    public List<Map<String, Object>> getMenuByParent(Long parent, Long menuId) {
        StringBuilder sb = new StringBuilder("SELECT MN.ID, MN.NAME, MN.PAGE_ID PAGEID, P.NAME PAGENAME, MN.SORT\n" +
                "  FROM SYS_MENU MN\n" +
                "  LEFT JOIN SYS_PAGE P\n" +
                "    ON MN.PAGE_ID = P.ID\n" +
                "   AND P.SFYX_ST = '1'\n" +
                " WHERE MN.SFYX_ST = '1' ");
        List<Object> args = new ArrayList<>();
        if (parent != null) {
            sb.append(" AND MN.PARENT = ? ");
            args.add(parent);
        } else {
            sb.append(" AND MN.PARENT IS NULL ");
        }
        if (menuId != null) {
            sb.append(" AND MN.ID <> ? ");
            args.add(menuId);
        }
        sb.append(" ORDER BY MN.XGSJ DESC");
        if (args.size() > 0) {
            return super.getJdbcTemplate().queryForList(sb.toString(), args.toArray());
        }
        return super.getJdbcTemplate().queryForList(sb.toString());
    }

    @Override
    public List<Map<String, Object>> getMenuTree() {
        String sb = ("SELECT MN.ID MENU_ID, MN.NAME MENU_NAME, MN.PARENT, MN.SORT\n" +
                "  FROM SYS_MENU MN\n" +
                " WHERE MN.SFYX_ST = '1'\n" +
                " ORDER BY MN.SORT ");
        return super.getJdbcTemplate().queryForList(sb);
    }

    @Override
    public List<Map<String, Object>> getRoleMenuTree(Long roleId) {
        String sb = ("SELECT MN.ID MENU_ID, MN.NAME MENU_NAME, MN.PARENT, MN.SORT, GM.ID GLB_ID\n" +
                "  FROM SYS_MENU MN\n" +
                "  LEFT JOIN SYS_GLB_MENU GM\n" +
                "    ON MN.ID = GM.MENU_ID\n" +
                "   AND GM.GL_TYPE = '1'\n" +
                "   AND GM.GL_ID = ?\n" +
                " WHERE MN.SFYX_ST = '1'\n" +
                " ORDER BY MN.SORT ");
        return super.getJdbcTemplate().queryForList(sb, roleId);
    }

    @Override
    public List<Map<String, Object>> getUserMenuTree(Long userId, String sfwh) {
        StringBuilder sb = new StringBuilder();
        sb.append("SELECT DISTINCT MN.ID MENU_ID, MN.NAME MENU_NAME, MN.PARENT, MN.SORT, GM.ID GLB_ID\n" +
                "  FROM SYS_MENU MN\n" +
                "  LEFT JOIN SYS_GLB_MENU GM\n" +
                "    ON MN.ID = GM.MENU_ID ");
        if ("y".equals(sfwh)) {  //是否维护个性菜单 0/n：否     1/y：是
            sb.append(" AND GM.GL_TYPE = '2' AND GM.GL_ID = ? ");   //2 用户
        } else if ("n".equals(sfwh)) {
            sb.append(" AND GM.GL_TYPE = '1'\n" +                     //1 角色
                    "   AND GM.GL_ID IN (SELECT GRU.ROLE_ID\n" +
                    "                      FROM SYS_GLB_ROLE_USER GRU\n" +
                    "                     WHERE GRU.USER_ID = ?\n" +
                    "                       AND GRU.SFYX_ST = '1') ");
        }
        sb.append(" WHERE MN.SFYX_ST = '1' ORDER BY MN.SORT ");
        return super.getJdbcTemplate().queryForList(sb.toString(), userId);
    }

    @Override
    public List<String> getMenusByUserId(Long userId, String sfwh) {
        StringBuilder sb = new StringBuilder();
        sb.append("SELECT DISTINCT MN.ID MENU_ID, MN.CODE \n" +
                "  FROM SYS_MENU MN\n" +
                "  INNER JOIN SYS_GLB_MENU GM\n" +
                "    ON MN.ID = GM.MENU_ID ");
        if ("y".equals(sfwh)) {  //是否维护个性菜单 0/n：否     1/y：是
            sb.append(" AND GM.GL_TYPE = '2' AND GM.GL_ID = ? ");   //2 用户
        } else if ("n".equals(sfwh)) {
            sb.append(" AND GM.GL_TYPE = '1'\n" +                     //1 角色
                    "   AND GM.GL_ID IN (SELECT GRU.ROLE_ID\n" +
                    "                      FROM SYS_GLB_ROLE_USER GRU\n" +
                    "                     WHERE GRU.USER_ID = ?\n" +
                    "                       AND GRU.SFYX_ST = '1') ");
        }
        sb.append(" WHERE MN.SFYX_ST = '1' ");
        List<Map<String,Object>> result = super.getJdbcTemplate().queryForList(sb.toString(), userId);
        List<String> array = new ArrayList<String>();
        for(Map map: result){
            if(RxStringUtils.isNotEmpty(map.get("CODE"))){
                array.add(map.get("CODE").toString());
            }
        }
        return array;
    }

    @Override
    public List<Map<String, Object>> getUserMenus(Long userId, String sfwhgxcd) {
        StringBuilder sql = new StringBuilder("WITH A AS\n" +
                " (SELECT DISTINCT GM.MENU_ID,\n" +
                "                  MN.NAME    MENU_NAME,\n" +
                "                  MN.CODE    MENU_CODE,\n" +
                "                  MN.ICON    MENU_ICON,\n" +
                "                  MN.PARENT,\n" +
                "                  P.URL      MENU_URL\n" +
                "    FROM SYS_GLB_MENU GM\n" +
                "    LEFT JOIN SYS_MENU MN\n" +
                "      ON MN.ID = GM.MENU_ID\n" +
                "     AND MN.SFYX_ST = '1'\n" +
                "    LEFT JOIN SYS_PAGE P\n" +
                "      ON MN.PAGE_ID = P.ID\n" +
                "     AND P.SFYX_ST = '1' ");
        if ("1".equals(sfwhgxcd)) { //用户维护了个性菜单
            sql.append(" WHERE GM.GL_TYPE = '2' AND GM.GL_ID = ? ");
        } else {
            sql.append(" WHERE GM.GL_TYPE = '1'\n" +
                    "     AND GM.GL_ID IN (SELECT DISTINCT GRU.ROLE_ID\n" +
                    "                        FROM SYS_GLB_ROLE_USER GRU\n" +
                    "                       WHERE GRU.USER_ID = ?\n" +
                    "                         AND GRU.SFYX_ST = '1')");
        }
        sql.append(") SELECT A.* FROM A\n" +
                " START WITH A.PARENT IS NULL\n" +
                " CONNECT BY PRIOR A.MENU_ID = A.PARENT\n" +
                " ORDER SIBLINGS BY A.MENU_ID");
        return super.getJdbcTemplate().queryForList(sql.toString(), userId);
    }
}
