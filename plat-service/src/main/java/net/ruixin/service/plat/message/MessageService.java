package net.ruixin.service.plat.message;

import net.ruixin.dao.plat.message.IMessageDao;
import net.ruixin.domain.plat.message.Message;
import net.ruixin.domain.plat.message.SysGlbMsgUser;
import net.ruixin.service.plat.common.BaseService;
import net.ruixin.util.constant.Const;
import net.ruixin.util.http.HttpSessionHolder;
import net.ruixin.util.paginate.FastPagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Map;

@Service
public class MessageService extends BaseService implements IMessageService {
    @Autowired
    private IMessageDao messageDao;

    @Override
    @Transactional
    public void generateMessage(String userIds, String typeCode, String title, String content, Long source, String param) {
        Message message = new Message(typeCode, title, content, source, param);
        save(message);
        saveGlbMsgUser(userIds, message);
    }

    @Override
    @Transactional
    public void generateMessage(String userIds, String typeCode, String title, String content, String param) {
        Long source = (Long) HttpSessionHolder.get().getAttribute(Const.USER_ID);
        Message message = new Message(typeCode, title, content, source, param);
        save(message);
        saveGlbMsgUser(userIds, message);
    }

    @Override
    public void readMessage(Long messageId) {
        Long userId = (Long) HttpSessionHolder.get().getAttribute(Const.USER_ID);
        messageDao.readMessage(messageId, userId);

    }

    private void saveGlbMsgUser(String userIds, Message message) {
        String[] userArray = userIds.split(",");
        for (String userId : userArray) {
            SysGlbMsgUser sysGlbMsgUser = new SysGlbMsgUser();
            sysGlbMsgUser.setMessageId(message.getId());
            sysGlbMsgUser.setUserId(Long.parseLong(userId));
            sysGlbMsgUser.setReceiveTime(new Date());
            save(sysGlbMsgUser);
        }
    }


    @Override
    public FastPagination getMessageList(Map map) {
        Long userId = (Long) HttpSessionHolder.get().getAttribute(Const.USER_ID);
        map.put("userId", userId);
        return messageDao.getMessageList(map);
    }


}
