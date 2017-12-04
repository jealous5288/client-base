package net.ruixin.dao.plat.attachment;

import net.ruixin.domain.plat.attachment.AttachmentData;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

/**
 * 附件数据Dao
 */
@Repository
public class AttachmentDataDao extends BaseDao<AttachmentData> implements IAttachmentDataDao {


    @Override
    public void saveAttachmentData(AttachmentData attachmentData) {
        super.saveOrUpdate(attachmentData);
    }

    @Override
    public AttachmentData getDataByAttachmentId(Long attachmentId) {
        String hql = " from AttachmentData where attachmentId =? and sfyx_st='1' ";
        return super.getByHql(hql, attachmentId);
    }

    @Override
    public void delDataByAttachmentId(Long attachmentId) {
        String sql = "UPDATE SYS_ATTACHMENT_DATA SET SFYX_ST='0' WHERE ATTACHMENT_ID=? ";
        super.executeSqlUpdate(sql, attachmentId);
    }

}
