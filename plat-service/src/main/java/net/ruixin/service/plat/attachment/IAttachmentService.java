package net.ruixin.service.plat.attachment;

import com.fasterxml.jackson.databind.JsonNode;
import net.ruixin.domain.plat.attachment.Attachment;
import net.ruixin.domain.plat.attachment.AttachmentData;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;

/**
 * 附件服务层
 */
public interface IAttachmentService {

    /**
     * 获取Attachment实体
     *
     * @param id 附件id
     */
    Attachment getAttachmentById(Long id);

    /**
     * 获取AttachmentData实体
     *
     * @param attachmentId 附件id
     */
    AttachmentData getDataByAttachmentId(Long attachmentId);

    /**
     * 上传附件
     *
     * @param alias       别名
     * @param description 描述
     * @param uuid        uuid
     * @param fjlbNo      附件类别分类
     * @param thumbFlag   缩略图是否生成标志
     * @param ifUnValid   缩略图是否生成标志
     * @param basePath    项目路径
     * @return str
     */
    String upload(MultipartFile multipartFile, String alias,
                  String description, String uuid, String fjlbNo, boolean thumbFlag, boolean ifUnValid, String basePath);

    /**
     * 删除文件
     *
     * @param idstr 附件ids
     */
    void delAttachment(String idstr);

    /**
     * 根据uuid删除附件
     *
     * @param uuid uuid
     */
    void clearOtherImage(String uuid);

    /**
     * 获取附件列表
     *
     * @param map 查询条件
     * @return 附件实体列表
     */
    List<Attachment> getAttachmentList(Map map);

    /**
     * 获取附件类型为图片的实体列表
     *
     * @param uuid 附件id
     * @return list
     */
    List<Attachment> getLzPhotoList(String uuid);

    /**
     * 获取缩略图
     *
     * @param id       附件id
     * @param thPath   缩略图路径
     * @param response 响应
     */
    void getThumbnail(Long id, String thPath, HttpServletResponse response);

    String uploadBase64(String data64, String alias, String description, String uuid, String fjlbNo);

    String uploadBase64(JsonNode jn, String fjlbNo);

    void updateGpy(String ids);
}
