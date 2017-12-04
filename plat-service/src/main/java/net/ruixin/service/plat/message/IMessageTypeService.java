package net.ruixin.service.plat.message;

import net.ruixin.service.plat.common.IBaseService;
import net.ruixin.util.paginate.FastPagination;

import java.util.Map;

public interface IMessageTypeService extends IBaseService {

    FastPagination getMessageTypeList(Map map);


}
