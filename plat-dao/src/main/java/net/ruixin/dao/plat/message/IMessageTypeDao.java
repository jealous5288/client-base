package net.ruixin.dao.plat.message;

import net.ruixin.util.paginate.FastPagination;

import java.util.Map;

public interface IMessageTypeDao {

     FastPagination getMessageTypeList(Map map);
}
