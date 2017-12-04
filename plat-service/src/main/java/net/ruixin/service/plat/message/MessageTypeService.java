package net.ruixin.service.plat.message;

import net.ruixin.dao.plat.message.IMessageTypeDao;
import net.ruixin.service.plat.common.BaseService;
import net.ruixin.util.paginate.FastPagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class MessageTypeService extends BaseService implements IMessageTypeService {

    @Autowired
    private IMessageTypeDao messageTypeDao;

    @Override
    public FastPagination getMessageTypeList(Map map) {
        return messageTypeDao.getMessageTypeList(map);
    }

}
