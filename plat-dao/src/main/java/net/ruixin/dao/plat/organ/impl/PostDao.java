package net.ruixin.dao.plat.organ.impl;

import net.ruixin.dao.plat.organ.IPostDao;
import net.ruixin.domain.plat.organ.SysPost;
import net.ruixin.enumerate.plat.Sfyx_st;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-8-17.
 * 岗位DAO实现
 */
@Repository
public class PostDao extends BaseDao<SysPost> implements IPostDao {

    @Override
    public SysPost getPostById(Long id) {
        return super.get(id);
    }

    @Override
    public FastPagination getSysPostPagingList(Map map, String hasDelData) {
        StringBuilder sql = new StringBuilder();
        List<Object> args = new ArrayList<>();
        sql.append("SELECT P.ID,\n" +
                "       P.POST_NAME,\n" +
                "       P.ORGAN," +
                "       TO_CHAR(P.CJSJ, 'YYYY-MM-DD') CJSJ,\n" +
                "       P.SFYX_ST,\n" +
                "       P.SFKHF,\n" +
                "       (SELECT T.POST_NAME\n" +
                "          FROM SYS_POST T\n" +
                "         WHERE T.SFYX_ST = '1'\n" +
                "           AND T.ID = P.PARENT_POST) SJ_POST,\n" +
                "       (SELECT O.ORGAN_NAME\n" +
                "          FROM SYS_ORGAN O\n" +
                "         WHERE O.SFYX_ST = '1'\n" +
                "           AND O.ID = P.ORGAN) ORGAN_NAME\n" +
                "  FROM SYS_POST P\n" +
                " WHERE 1 = 1 ");
        if (RxStringUtils.isNotEmpty(map.get("organ"))) {
            sql.append(" AND P.ORGAN = ? ");
            args.add(map.get("organ"));
        }
        if (RxStringUtils.isNotEmpty(map.get("post_name"))) {
            sql.append(" AND P.POST_NAME LIKE ? ");
            args.add("%" + map.get("post_name") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("parent_post"))) {
            sql.append(" AND P.PARENT_POST = ? ");
            args.add(map.get("parent_post"));
        }
        if (RxStringUtils.isEmpty(hasDelData)) {
            sql.append(" AND P.SFYX_ST = '1' ");
        } else {
            sql.append(" AND (P.SFYX_ST = '1' OR P.SFKHF = '1') ");
        }
        sql.append(" ORDER BY P.XGSJ DESC ");
        return super.cacheNextPagePaginationSql(sql, args, (Integer) map.get("pageNo"),
                (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }

    @Override
    public void savePost(SysPost sysPost) {
        super.saveOrUpdate(sysPost);
        super.getSession().flush();
        //调用存储过程
        List<Object> params = new ArrayList<>();
        params.add(sysPost.getId());
        params.add(3);  //参数类型定义 1为roleId、2为organId、3为postId、4为userId
        super.prepareCallNoReturn("{call PKG_PLATFORM.USP_SYS_GLB_ROLE_USER(?,?,?)}", params.toArray());
    }

    @Override
    public List<Map<String, Object>> getPostListByOrganId(Long organId, Boolean isTop, String hasDelData) {
        StringBuilder sql = new StringBuilder("SELECT P.ID,\n" +
                "          P.POST_NAME MC,\n" +
                "          P.ORGAN,\n" +
                "          P.PARENT_POST,\n" +
                "          P.SFYX_ST,\n" +
                "          P.SFKHF\n," +
                "          (SELECT COUNT(1)\n" +
                "             FROM SYS_POST SP\n" +
                "            WHERE SP.PARENT_POST = P.ID\n" +
                "              AND (SP.SFYX_ST='1' OR SP.SFKHF = '1')) GWCT,\n" +
                "          (SELECT COUNT(1)\n" +
                "             FROM SYS_GLB_ORGAN_USER_POST SGOUP\n" +
                "            WHERE SGOUP.POST_ID = P.ID\n" +
                "              AND SGOUP.SFYX_ST = '1') USERCT,\n" +
                "          (SELECT SP.POST_NAME " +
                "             FROM SYS_POST SP " +
                "            WHERE SP.ID = P.PARENT_POST) PARENT_POSTNAME,\n" +
                "          (SELECT SO.ORGAN_NAME " +
                "             FROM SYS_ORGAN SO " +
                "            WHERE SO.ID = P.ORGAN) ORGAN_NAME " +
                "     FROM SYS_POST P\n" +
                "    WHERE P.ORGAN=? ");
        if (isTop) {
            sql.append(" AND P.PARENT_POST IS NULL ");
        }
        if (RxStringUtils.isEmpty(hasDelData)) {
            sql.append(" AND P.SFYX_ST = '1' ");
        } else {
            sql.append(" AND (P.SFYX_ST = '1' OR P.SFKHF = '1') ");
        }
        sql.append(" ORDER BY P.SORT_NUM ");
        return super.getJdbcTemplate().queryForList(sql.toString(), organId);
    }

    @Override
    public List<Map<String, Object>> getPostChildListByPostId(Long postId, String hasDelData) {
        StringBuilder sb = new StringBuilder();
        sb.append("SELECT P.ID,\n" +
                "       P.POST_NAME MC,\n" +
                "       P.ORGAN,\n" +
                "       P.PARENT_POST,\n" +
                "       P.SFYX_ST,\n" +
                "       P.SFKHF,\n" +
                "       (SELECT COUNT(1)\n" +
                "          FROM SYS_POST SP\n" +
                "         WHERE SP.PARENT_POST = P.ID\n" +
                "           AND (SP.SFYX_ST='1' OR SP.SFKHF = '1')) GWCT,\n" +
                "       (SELECT COUNT(OUP.USER_ID)\n" +
                "          FROM SYS_GLB_ORGAN_USER_POST OUP\n" +
                "         WHERE OUP.POST_ID = P.ID\n" +
                "           AND OUP.SFYX_ST = '1') USERCT,\n" +
                "       O.ORGAN_NAME,\n" +
                "       (SELECT SP.POST_NAME " +
                "          FROM SYS_POST SP " +
                "         WHERE SP.ID = P.PARENT_POST) PARENT_POSTNAME\n" +
                "  FROM SYS_POST P\n" +
                "  LEFT JOIN SYS_ORGAN O\n" +
                "    ON P.ORGAN = O.ID\n" +
                "   AND O.SFYX_ST = '1'\n" +
                " WHERE P.PARENT_POST = ? ");
        if (RxStringUtils.isEmpty(hasDelData)) {
            sb.append(" AND P.SFYX_ST = '1' ");
        } else {
            sb.append(" AND (P.SFYX_ST = '1' OR P.SFKHF = '1') ");
        }
        sb.append(" ORDER BY P.SORT_NUM ");
        return super.getJdbcTemplate().queryForList(sb.toString(), postId);
    }

    @Override
    public boolean hasPostName(Long postId, String postName, Long organId) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(P.ID) SL FROM SYS_POST P " +
                "WHERE P.SFYX_ST='1' AND P.POST_NAME = :POST_NAME ");
        Map<String, Object> queryMap = new HashMap<>();
        queryMap.put("POST_NAME", postName);
        if (null == organId) {  //无组织岗位
            sql.append(" AND P.ORGAN IS NULL ");
        } else {
            sql.append(" AND P.ORGAN = :ORGAN_ID ");
            queryMap.put("ORGAN_ID", organId);
        }
        if (null != postId) {  //修改
            sql.append(" AND P.ID <> :POST_ID ");
            queryMap.put("POST_ID", postId);
        }
        Map map = super.getNpJdbcTemplate().queryForMap(sql.toString(), queryMap);
        return Integer.parseInt(map.get("SL").toString()) > 0;
    }

    @Override
    public void able(Long postId) {
        SysPost post = super.get(postId);
        post.setSfyx_st(Sfyx_st.VALID);
        post.setSfkhf("0");
        this.savePost(post);
    }

    @Override
    public void del(Long postId) {
        //调用存储过程
        super.prepareCallNoReturn("{call PKG_PLATFORM.USP_POST_DELETE(?,?)}", postId);
    }

    @Override
    public void pause(Long postId) {
        SysPost post = super.get(postId);
        post.setSfyx_st(Sfyx_st.UNVALID);
        post.setSfkhf("1");
        this.savePost(post);
    }

}
