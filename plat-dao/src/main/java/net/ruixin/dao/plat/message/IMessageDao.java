package net.ruixin.dao.plat.message;

import net.ruixin.util.paginate.FastPagination;

import java.util.Map;

public interface IMessageDao {
    /**
     * 消息变成已读状态
     *
     * @param messageId 消息id
     * @param userId    用户
     */
    void readMessage(Long messageId, Long userId);

    /**
     * 获取消息分页列表
     *
     * @param map
     * @return
     */
    FastPagination getMessageList(Map map);


}
