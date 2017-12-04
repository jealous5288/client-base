package net.ruixin.dao.plat.message;

import net.ruixin.domain.plat.message.MessageType;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
@Repository
public class MessageTypeDao extends BaseDao<MessageType> implements IMessageTypeDao {
    @Override
    public FastPagination getMessageTypeList(Map map) {
        StringBuilder sql = new StringBuilder("SELECT T.* FROM SYS_MESSAGE_TYPE T WHERE T.SFYX_ST='1'");
        List args = new ArrayList();
        if (RxStringUtils.isNotEmpty(map.get("name"))) {
            sql.append(" AND T.NAME LIKE ? ");
            args.add("%" + map.get("name") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("code"))) {
            sql.append(" AND T.CODE LIKE ? ");
            args.add("%" + map.get("code") + "%");
        }
        return super.cacheNextPagePaginationSql(sql, args, (Integer) map.get("pageNo"), (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }

}
