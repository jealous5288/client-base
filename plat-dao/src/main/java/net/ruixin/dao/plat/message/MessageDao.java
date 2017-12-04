package net.ruixin.dao.plat.message;

import net.ruixin.domain.plat.message.Message;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class MessageDao extends BaseDao<Message> implements IMessageDao {

    @Override
    public void readMessage(Long messageId, Long userId) {
        String sql = "UPDATE SYS_GLB_MESSAGE_USER SGU  SET STATUS='2' WHERE SGU.MESSAGE_ID=? AND SGU.USER_ID=?";
        executeSqlUpdate(sql, messageId, userId);
    }

    @Override
    public FastPagination getMessageList(Map map) {
        StringBuilder sql = new StringBuilder();
        List<Object> params = new ArrayList<>();
        sql.append("\n" +
                "SELECT M.TITLE,\n" +
                "       M.CONTENT,\n" +
                "       M.SOURCE,\n" +
                "       M.PARAM,\n" +
                "       MT.URGENT_LEVEL,\n" +
                "       MT.VALID_TIME,\n" +
                "       MT.WIN_SIZE,\n" +
                "       MT.SKIP_PATH,\n" +
                "       MT.OPERATE_TYPE\n" +
                "  FROM SYS_GLB_MESSAGE_USER GM, SYS_MESSAGE M, SYS_MESSAGE_TYPE MT\n" +
                " WHERE M.TYPE_CODE = MT.CODE\n" +
                "   AND GM.MESSAGE_ID = M.ID\n" +
                "   AND M.SFYX_ST = '1'\n" +
                "   AND MT.SFYX_ST='1'\n" +
                "   AND GM.SFYX_ST='1'");

        if (RxStringUtils.isNotEmpty(map.get("userId"))) {
            sql.append("AND GM.USER_ID=?");
            params.add(map.get("userId"));
        }
        return super.cacheNextPagePaginationSql(sql, params, (Integer) map.get("pageNo"),
                (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }


}