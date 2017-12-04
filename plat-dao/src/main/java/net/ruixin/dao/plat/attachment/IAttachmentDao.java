package net.ruixin.dao.plat.attachment;

import net.ruixin.domain.plat.attachment.Attachment;

import java.util.List;
import java.util.Map;

/**
 * AttachmentDao  抽象类
 */
public interface IAttachmentDao {

    /**
     * 保存Attachment实体
     *
     * @param attachment 实体
     * @return id
     */
    Long saveAttachment(Attachment attachment);

    /**
     * 获取Attachment实体
     *
     * @param id 附件id
     */
    Attachment getAttachmentById(Long id);

    /**
     * 删除文件
     *
     * @param idstr 附件ids
     */
    void delAttachment(String idstr);

    /**
     * 根据map获取附件列表
     *
     * @param map 查询条件
     * @return 附件实体列表
     */
    List<Attachment> getAttachmentList(Map map);

    /**
     * 根据uuid获取附件列表
     *
     * @param uuid 附件id
     * @return 附件实体列表
     */
    List<Attachment> getAttachmentList(String uuid);

    /**
     * 重新生成附件缩略图路径
     *
     * @param id     附件id
     * @param thPath 路径
     */
    void updateThPath(Long id, String thPath);

    void updateGpy(String ids);

    void clearOtherImage(String uuid);
}
