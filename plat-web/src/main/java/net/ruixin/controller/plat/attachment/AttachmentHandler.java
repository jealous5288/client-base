package net.ruixin.controller.plat.attachment;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.attachment.Attachment;
import net.ruixin.domain.plat.attachment.AttachmentData;
import net.ruixin.service.plat.attachment.IAttachmentService;
import net.ruixin.util.cache.Cache;
import net.ruixin.util.cache.CacheKit;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.resolver.JsonModel;
import net.ruixin.util.tools.IOUtils;
import net.ruixin.util.tools.RxStringUtils;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2016/11/1.
 * 附件控制层
 */
@Controller
@RequestMapping("/attachment")
public class AttachmentHandler extends BaseController {

    @Autowired
    private IAttachmentService attachmentService;

    /**
     * 上传附件
     *
     * @param request     请求
     * @param alias       别名
     * @param description 描述
     * @param uuid        uuid
     * @param fjlbNo      附件类别分类
     * @param thumbFlag   缩略图是否生成标志
     * @param ifUnValid   是否无效
     * @return str
     */
    @ResponseBody
    @RequestMapping(value = "/upload", produces = "text/html; charset=utf-8")
    public String upload(HttpServletRequest request, String alias, String description,
                         String uuid, String fjlbNo, boolean thumbFlag, boolean ifUnValid) {
        if (RxStringUtils.getStrLength(alias) > 50) {
            return "{'err':'上传失败，失败原因：文件别名过长'}";
        }
        if (RxStringUtils.getStrLength(description) > 250) {
            return "{'err':'上传失败，失败原因：文件描述过长'}";
        }
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        MultipartFile multipartFile = multipartRequest.getFile("filedata"); //获取上传的文件
        if (multipartFile.isEmpty()) {
            return "{'err':'上传失败，失败原因：上传文件为空'}";
        }

        String zpId = attachmentService.upload(multipartFile, alias, description, uuid, fjlbNo, thumbFlag, ifUnValid, request.getContextPath());
        return "{'err':'','msg':'" + request.getContextPath() + "/attachment/getImage?id=" + zpId + "'" + ",'zpId':" + zpId + "}";
    }

    /**
     * html5 多文件上传
     *
     * @param request     请求
     * @param alias       别名
     * @param description 描述
     * @param uuid        uuid
     * @param fjlbNo      附件类别分类
     * @param thumbFlag   缩略图是否生成标志
     * @param ifUnValid   是否无效
     * @return str
     */
    @ResponseBody
    @RequestMapping(value = "/mulupload", produces = "text/html; charset=utf-8")
    public String mulupload(HttpServletRequest request, String alias, String description,
                            String uuid, String fjlbNo, boolean thumbFlag, boolean ifUnValid) {
        if (RxStringUtils.getStrLength(alias) > 50) {
            return "{'err':'上传失败，失败原因：文件别名过长'}";
        }
        if (RxStringUtils.getStrLength(description) > 250) {
            return "{'err':'上传失败，失败原因：文件描述过长'}";
        }
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        List<MultipartFile> multipartFileList = multipartRequest.getFiles("filedata"); //获取上传的文件
        if (multipartFileList.size() == 0) {
            return "{'err':'上传失败，失败原因：上传文件为空'}";
        }
        StringBuilder result = new StringBuilder();
        for (MultipartFile multiFile : multipartFileList) {
            String zpId = attachmentService.upload(multiFile, alias, description, uuid, "0", thumbFlag, ifUnValid, request.getContextPath());
            result.append(zpId).append(",");
        }
        return result.toString();
    }


    /**
     * base64格式数据（高拍仪） 上传
     *
     * @param data64      base64格式数据
     * @param alias       别名
     * @param description 描述
     * @param uuid        uuid
     * @param fjlbNo      附件类别
     * @param request     请求
     * @return str
     */
    @ResponseBody
    @RequestMapping(value = "/uploadGpy", produces = "text/html; charset=utf-8")
    public String uploadGpy(String data64, String alias, String description,
                            String uuid, String fjlbNo, HttpServletRequest request) {
        if (request instanceof MultipartHttpServletRequest)
            return upload(request, alias, description, uuid, fjlbNo, true, true);
        return attachmentService.uploadBase64(data64, alias, description, uuid, fjlbNo);
    }

    /**
     * 根据ID修改SFYX_ST为1（高拍仪使用）
     *
     * @param fjIds 附件ID
     * @return str
     */
    @ResponseBody
    @RequestMapping(value = "/updateGpy", produces = "text/html; charset=utf-8")
    public String updateGpy(@RequestParam("fjIds") String fjIds) {
        if (RxStringUtils.isNotEmpty(fjIds)) {
            attachmentService.updateGpy(fjIds);
        }
        return "{'err':'','msg':'true'}";
    }

    /**
     * 下载附件
     *
     * @param id       附件id
     * @param response 响应
     */
    @RequestMapping("/download")
    public void download(Long id, HttpServletResponse response) {
        Attachment attachment = attachmentService.getAttachmentById(id);
        byte[] data = getFileData(id);
        if (data != null) {
            String fileName = attachment.getName();
            try {
                fileName = URLEncoder.encode(fileName, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException("文件名编码错误");
            }
            String ext = attachment.getExtension();
            String[] names = attachment.getName().split("\\.");
            Boolean hasExt = true;
            if (RxStringUtils.isEmpty(ext)) {
                hasExt = false;
            } else if (names.length > 0) {
                hasExt = !ext.toLowerCase().equals(names[names.length - 1].toLowerCase());
            }
            if (hasExt) {
                response.setHeader("Content-disposition", "attachment;filename=" + fileName + "." + ext);
            } else {
                response.setHeader("Content-disposition", "attachment;filename=" + fileName);
            }
            OutputStream outputStream = null;
            try {
                outputStream = response.getOutputStream();
                outputStream.write(data);
                outputStream.flush();
            } catch (IOException e) {
                throw new RuntimeException("文件下载失败", e);
            } finally {
                IOUtils.close(outputStream);
            }
        } else {
            throw new RuntimeException("附件不存在");
        }
    }

    //获取文件byte[]数据
    private byte[] getFileData(Long id) {
        Attachment attachment = attachmentService.getAttachmentById(id);
        File file = new File(attachment.getAbsolutePath() == null ? "" : attachment.getAbsolutePath());
        byte[] data = null;
        if (file.exists()) {
            try {
                data = FileUtils.readFileToByteArray(file);
            } catch (IOException e) {
                throw new RuntimeException("文件下载失败", e);
            }
        } else if (!"1".equals(CacheKit.get(Cache.CONFIG, "attachmentPosition"))) {
            AttachmentData attachmentData = attachmentService.getDataByAttachmentId(id);
            if (attachmentData != null) {
                data = attachmentData.getContent();
            } else {
                throw new RuntimeException("附件不存在");
            }
        }
        return data;
    }

    /**
     * 获取图片
     *
     * @param id       附件id
     * @param response 响应
     */
    @RequestMapping("/getImage")
    public void getImage(Long id, HttpServletResponse response) {
        byte[] data = getFileData(id);
        if (data != null) {
            OutputStream outputStream = null;
            try {
                outputStream = response.getOutputStream();
                outputStream.write(data);
                outputStream.flush();
            } catch (IOException e) {
                throw new RuntimeException("获取图片失败", e);
            } finally {
                IOUtils.close(outputStream);
            }
        } else {
            throw new RuntimeException("附件不存在");
        }
    }

    /**
     * 获取图片缩略图
     *
     * @param id       附件id
     * @param thPath   缩略图路径
     * @param response 响应
     */
    @RequestMapping("/getThumbnail")
    public void getThumbnail(Long id, String thPath, HttpServletResponse response) {
        attachmentService.getThumbnail(id, thPath, response);
    }

    /**
     * 删除文件
     *
     * @param idstr 附件ids
     * @return str
     */
    @ResponseBody
    @RequestMapping("/delAttachment")
    public AjaxReturn delAttachment(String idstr) {
        attachmentService.delAttachment(idstr);
        return new AjaxReturn(true);
    }

    /**
     * 获取附件信息
     *
     * @param id 附件id
     */
    @ResponseBody
    @RequestMapping("/getAttachment")
    public AjaxReturn getAttachment(Long id) {
        return new AjaxReturn().setSuccess(true).setData(attachmentService.getAttachmentById(id));
    }

    /**
     * 获取附件实体列表
     *
     * @param map 查询条件
     * @return 附件实体列表
     */
    @ResponseBody
    @RequestMapping("/getAttachmentList")
    public AjaxReturn getAttachmentList(@JsonModel Object map) {
        return new AjaxReturn().setSuccess(true).setData(attachmentService.getAttachmentList((Map) map));
    }

    /**
     * 获取附件类型为图片的实体列表
     *
     * @param uuid 附件id
     * @return ar
     */
    @ResponseBody
    @RequestMapping(value = "/getLzPhotoList")
    public AjaxReturn getLzPhotoList(String uuid) {
        return new AjaxReturn().setSuccess(true).setData(attachmentService.getLzPhotoList(uuid));
    }


}

