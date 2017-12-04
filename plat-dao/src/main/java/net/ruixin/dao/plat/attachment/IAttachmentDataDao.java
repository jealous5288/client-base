package net.ruixin.dao.plat.attachment;


import net.ruixin.domain.plat.attachment.AttachmentData;

/**
 * 附件数据
 */
public interface IAttachmentDataDao {

    /**
     * 保存AttachmentData实体
     *
     * @param attachmentData 实体
     */
    void saveAttachmentData(AttachmentData attachmentData);

    /**
     * 获取AttachmentData实体
     *
     * @param attachmentId 附件id
     * @return AttachmentData
     */
    AttachmentData getDataByAttachmentId(Long attachmentId);

    /**
     * 删除AttachmentData实体
     *
     * @param attachmentId 附件id
     */
    void delDataByAttachmentId(Long attachmentId);
}
