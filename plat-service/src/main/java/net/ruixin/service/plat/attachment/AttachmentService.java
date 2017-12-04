package net.ruixin.service.plat.attachment;

import com.fasterxml.jackson.databind.JsonNode;
import net.ruixin.dao.plat.attachment.IAttachmentDao;
import net.ruixin.dao.plat.attachment.IAttachmentDataDao;
import net.ruixin.domain.plat.attachment.Attachment;
import net.ruixin.domain.plat.attachment.AttachmentData;
import net.ruixin.enumerate.plat.Sfyx_st;
import net.ruixin.util.cache.Cache;
import net.ruixin.util.cache.CacheKit;
import net.ruixin.util.tools.IOUtils;
import net.ruixin.util.tools.RxFileUtils;
import net.ruixin.util.tools.RxStringUtils;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import sun.misc.BASE64Decoder;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.List;

/**
 * 附件Service层
 */
@Service
public class AttachmentService implements IAttachmentService {

    @Autowired
    private IAttachmentDao attachmentDao;

    @Autowired
    private IAttachmentDataDao attachmentDataDao;

    @Override
    public Attachment getAttachmentById(Long id) {
        return attachmentDao.getAttachmentById(id);
    }

    @Override
    public AttachmentData getDataByAttachmentId(Long attachmentId) {
        return attachmentDataDao.getDataByAttachmentId(attachmentId);
    }

    @Override
    @Transactional
    public String upload(MultipartFile multipartFile, String alias,
                         String description, String uuid, String fjlbNo,
                         boolean thumbFlag, boolean ifUnValid, String basePath) {
        try {
            Long fileSize = multipartFile.getSize(); //获取文件大小
            byte[] content = multipartFile.getBytes(); //获取文件内容
            String oFileName = multipartFile.getOriginalFilename(); //获得文件名（含后缀扩展名）
            Integer lastIndex = oFileName.lastIndexOf("."); //获取.的位置下标
            String ext = null;
            String fileName = null;
            String type = null;
            if (lastIndex > 0) {
                ext = oFileName.substring(lastIndex + 1); //获得文件名后缀扩展名
                fileName = oFileName.substring(0, lastIndex); //获得文件名（不含后缀扩展名）
                type = RxFileUtils.getFileType(ext);  //获取文件类型
            }
            String filePath = CacheKit.get(Cache.CONFIG, "attachmentPath"); //获取全局配置文件路径
            File file = new File(filePath);
            if (!file.exists()) {
                if (!file.mkdirs()) {
                    throw new RuntimeException("创建文件路径失败");
                }
            }
            String nowTime = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
            String absolutePath = filePath + File.separator + fileName + nowTime + "." + ext; //获取物理路径
            //获取图片缩略图路径
            String thAbsolutePath = null;
            if (RxStringUtils.isNotEmpty(thumbFlag) && ext != null &&  //非图片文件 不生成缩略图
                    CacheKit.get(Cache.CONFIG, "imgExt").toString().contains(ext.toLowerCase())) {
                if (fileSize > 4096) {
                    File thFile = RxFileUtils.changToFile(multipartFile);
                    //获取缩略图物理路径
                    thAbsolutePath = generateThumbnail(thFile, 600, 300, nowTime + "_" + new Random().nextInt(100), true);
                } else {
                    thAbsolutePath = generateThumbnail(content, 600, 300, nowTime + "_" + new Random().nextInt(100), true);
                }
            }
            Sfyx_st state = Sfyx_st.VALID;
            if (ifUnValid) {
                state = Sfyx_st.UNVALID;
            }
            //根据配置保存 附件数据实体 到相应的位置
            String destPosition = CacheKit.get(Cache.CONFIG, "attachmentPosition");
            if ("dataBase".equals(destPosition))
                absolutePath = null;
            //创建 附件实体 并保存
            Attachment attachment = new Attachment(type, fileName, alias != null ? alias : fileName, ext,
                    fileSize.intValue(), absolutePath, thAbsolutePath, description, uuid, fjlbNo, state);
            Long attachmentId = attachmentDao.saveAttachment(attachment);
            switch (destPosition) {
                case "fileSystem": { //保存到服务器文件系统
                    saveToFileSystem(multipartFile, absolutePath);
                    break;
                }
                case "dataBase": { //保存到数据库
                    saveToDataBase(content, attachmentId);
                    break;
                }
                case "fileSystem,dataBase": { //均保存
                    saveToFileSystem(multipartFile, absolutePath);
                    saveToDataBase(content, attachmentId);
                    break;
                }
                default:
                    break;
            }
            return attachmentId.toString();
//            return "{'err':'','msg':'" + basePath + "/attachment/getImage?id=" + attachmentId + "'" + ",'zpId':" + attachmentId + "}";
        } catch (IOException e) {
            return "{'err':'上传失败'}";
        }
    }

    //文件保存到数据库
    private void saveToDataBase(byte[] content, Long attachmentId) {
        AttachmentData attachmentData = new AttachmentData(attachmentId, content, Sfyx_st.VALID);
        attachmentDataDao.saveAttachmentData(attachmentData);
    }

    //文件保存到系统
    private void saveToFileSystem(MultipartFile multipartFile, String absolutePath) {
        File file = new File(absolutePath);
        try {
            multipartFile.transferTo(file);
        } catch (IOException e) {
            throw new RuntimeException("保存文件时失败", e);
        }
    }

    //文件保存到系统
    private void saveToFileSystem(byte[] bytes, String absolutePath) {
        FileOutputStream fos = null;
        File file = new File(absolutePath);
        try {
            fos = new FileOutputStream(file);
            fos.write(bytes);
            fos.flush();
        } catch (IOException e) {
            throw new RuntimeException("保存文件时失败", e);
        } finally {
            IOUtils.close(fos);
        }
    }

    @Override
    @Transactional
    public void delAttachment(String idstr) {
        String destPosition = CacheKit.get(Cache.CONFIG, "attachmentPosition");
        attachmentDao.delAttachment(idstr); //删除数据库中的Attachment
        Attachment attachment;
        String[] ids = idstr.split(",");
        for (String id : ids) {
            attachment = attachmentDao.getAttachmentById(Long.parseLong(id));
            if ("fileSystem".equals(destPosition)) {
                //删除服务器上的文件
                delFileOnFileSystem(attachment.getAbsolutePath());
            } else if ("dataBase".equals(destPosition)) {
                //删除数据库中的AttachmentData
                attachmentDataDao.delDataByAttachmentId(Long.parseLong(id));
            } else {
                //删除数据库中的AttachmentData
                attachmentDataDao.delDataByAttachmentId(Long.parseLong(id));
                //删除服务器上的文件
                delFileOnFileSystem(attachment.getAbsolutePath());
            }
            //删除缩略图
            delFileOnFileSystem(attachment.getThAbsolutePath());
        }
    }

    private void delFileOnFileSystem(String absolutePath) {
        if (RxStringUtils.isNotEmpty(absolutePath)) {
            File f = new File(absolutePath);
            if (f.exists()) {
                if (!f.delete()) {
                    throw new RuntimeException("文件删除失败");
                }
            }
        }
    }

    @Override
    public void clearOtherImage(String uuid) {
        attachmentDao.clearOtherImage(uuid);
    }

    @Override
    public List<Attachment> getAttachmentList(Map map) {
        return attachmentDao.getAttachmentList(map);
    }

    @Override
    public List<Attachment> getLzPhotoList(String uuid) {
        List<Attachment> list = attachmentDao.getAttachmentList(uuid);
        List<Attachment> newList = new ArrayList<>();
        if (list.size() > 0) {
            for (Attachment attachment : list) {
                String ext = attachment.getExtension();
                if (RxStringUtils.isEmpty(ext)) {
                    String[] names = attachment.getName().split("\\.");
                    if (names.length > 0) {
                        ext = names[names.length - 1].toLowerCase();
                        attachment.setExtension(ext);
                    }
                }
                if (CacheKit.get(Cache.CONFIG, "imgExt").toString().indexOf(ext.toLowerCase()) > 0) {
                    newList.add(attachment);
                }
            }
        }
        return newList;
    }

    @Override
    @Transactional
    public void getThumbnail(Long id, String thPath, HttpServletResponse response) {
        OutputStream outputStream = null;
        if (RxStringUtils.isNotEmpty(thPath)) {
            try {
                thPath = URLDecoder.decode(thPath, "utf-8");
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException("Attachmentservice decode error", e);
            }
            if (!new File(thPath).exists()) {
                rePaintThumbnail(id, thPath); //重新生成缩略图
            }
        } else {
            thPath = rePaintThumbnail(id, thPath); //重新生成缩略图及路径
        }
        if (thPath != null) {
            File thfile = new File(thPath);
            try {
                byte[] data = FileUtils.readFileToByteArray(thfile);
                outputStream = response.getOutputStream();
                outputStream.write(data);
                outputStream.flush();
            } catch (IOException e) {
                throw new RuntimeException("获取图片缩略图失败", e);
            } finally {
                IOUtils.close(outputStream);
            }
        }
    }

    @Override
    @Transactional
    public String uploadBase64(JsonNode jn, String fjlbNo) {
        String uuid = UUID.randomUUID().toString();
        for (int i = 0; i < jn.size(); i++) {
            uploadBase64(jn.get(i).get("data").asText(), jn.get(i).get("mc").asText(), null, uuid, fjlbNo);
        }
        return uuid;
    }

    @Override
    @Transactional
    public String uploadBase64(String data64, String alias, String description, String uuid, String fjlbNo) {
        BASE64Decoder decoder = new BASE64Decoder();
        try {
            // Base64解码
            byte[] b = decoder.decodeBuffer(data64);
            for (int i = 0; i < b.length; ++i) {
                if (b[i] < 0) {// 调整异常数据
                    b[i] += 256;
                }
            }
            int fileSize = b.length; //获取文件大小
            String filePath = CacheKit.get(Cache.CONFIG, "attachmentPath");//获取全局配置文件路径
            File file = new File(filePath);
            if (!file.exists()) {
                if (file.mkdir()) {
                    throw new RuntimeException("创建文件路径失败");
                }
            }
            String nowTime = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
            String absolutePath = filePath + File.separator + alias; //获取物理路径
            //获取图片缩略图路径
            String thAbsolutePath = generateThumbnail(b, 600, 300, nowTime + "_" + new Random().nextInt(100), true); //获取缩略图物理路径
            //根据配置保存 附件数据实体 到相应的位置
            String destPosition = CacheKit.get(Cache.CONFIG, "attachmentPosition");
            if ("dataBase".equals(destPosition))
                absolutePath = null;
            //创建 附件实体 并保存
            Attachment attachment = new Attachment("2", alias, alias, "jpg",
                    fileSize, absolutePath, thAbsolutePath, description, uuid, fjlbNo, Sfyx_st.UNVALID);
            Long attachmentId = attachmentDao.saveAttachment(attachment);
            switch (destPosition) {
                case "fileSystem": { //保存到服务器文件系统
                    saveToFileSystem(b, absolutePath);
                    break;
                }
                case "dataBase": { //保存到数据库
                    saveToDataBase(b, attachmentId);
                    break;
                }
                case "fileSystem,dataBase": { //均保存
                    saveToFileSystem(b, absolutePath);
                    saveToDataBase(b, attachmentId);
                    break;
                }
                default:
                    break;
            }
            return "{'err':'','msg':'id=" + attachmentId + "'}";
        } catch (IOException e) {
            return "{'err':'上传失败'}";
        }
    }

    @Override
    @Transactional
    public void updateGpy(String ids) {
        attachmentDao.updateGpy(ids);
    }

    //根据附件id thPath重新生成缩略图
    private String rePaintThumbnail(Long id, String thPath) {
        if (id != null) {
            String destPosition = CacheKit.get(Cache.CONFIG, "attachmentPosition");
            if (destPosition.equals("fileSystem")) {
                String absolutePath = attachmentDao.getAttachmentById(id).getAbsolutePath();
                if (RxStringUtils.isNotEmpty(absolutePath)) {
                    InputStream inputStream = null;
                    byte[] data;
                    try {
                        data = FileUtils.readFileToByteArray(new File(absolutePath));
                        inputStream = new ByteArrayInputStream(data);
                        thPath = paintThumbnail(id, inputStream, 120, 90, thPath, true);
                    } catch (IOException e) {
                        throw new RuntimeException("重新生成缩略图失败", e);
                    } finally {
                        IOUtils.close(inputStream);
                    }
                    return thPath;
                }
            } else {
                AttachmentData attachmentData = attachmentDataDao.getDataByAttachmentId(id);
                if (attachmentData != null) {
                    if (attachmentData.getContent() != null) {
                        InputStream inputStream = new ByteArrayInputStream(attachmentData.getContent());
                        thPath = paintThumbnail(id, inputStream, 600, 300, thPath, true);
                        IOUtils.close(inputStream);
                        return thPath;
                    }
                }
            }
        }
        return null;
    }

    /**
     * 生成缩略图
     *
     * @param inputStream 输入流
     * @param w           宽度
     * @param h           高度
     * @param thPath      缩略图物理路径
     * @param force       是否强制按照宽高生成缩略图(如果为false，则生成最佳比例缩略图)
     */
    private String paintThumbnail(Long id, InputStream inputStream, int w, int h, String thPath, boolean force) {
        try {
            BufferedImage img = ImageIO.read(inputStream);
            BufferedImage bi = getBufferedImage(w, h, force, img);
            String suffix = CacheKit.get(Cache.CONFIG, "th_suffix");
            if (RxStringUtils.isEmpty(thPath)) {
                //从配置文件中获取缩略图保存路径及其前缀、后缀
                String thumbnailPath = CacheKit.get(Cache.CONFIG, "thumbnailPath");
                String nowTime = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
                thPath = thumbnailPath + File.separator + "th" + nowTime + "_" + new Random().nextInt(100) + "." + suffix;
                attachmentDao.updateThPath(id, thPath);
            }
            File thFile = new File(thPath);
            ImageIO.write(bi, suffix, thFile);
            return thPath;
        } catch (IOException e) {
            throw new RuntimeException("重新生成缩略图失败", e);
        }
    }

    /**
     * 生成图片文件缩略图及路径
     *
     * @param thFile  file
     * @param w       宽度
     * @param h       高度
     * @param nowTime 当前时间
     * @param force   是否强制按照宽高生成缩略图(如果为false，则生成最佳比例缩略图)
     * @return ThumbnailPath
     */
    private String generateThumbnail(File thFile, int w, int h, String nowTime, boolean force) {
        try {
            BufferedImage img = ImageIO.read(thFile);
            return getSlt(w, h, nowTime, force, img);
        } catch (IOException e) {
            throw new RuntimeException("生成缩略图失败", e);
        }
    }

    /**
     * 生成图片文件缩略图及路径
     *
     * @param thFile  byte[]
     * @param w       宽度
     * @param h       高度
     * @param nowTime 当前时间
     * @param force   是否强制按照宽高生成缩略图(如果为false，则生成最佳比例缩略图)
     * @return ThumbnailPath
     */
    private String generateThumbnail(byte[] thFile, int w, int h, String nowTime, boolean force) {
        try {
            BufferedImage img = ImageIO.read(new ByteArrayInputStream(thFile));
            return getSlt(w, h, nowTime, force, img);
        } catch (IOException e) {
            throw new RuntimeException("生成缩略图失败", e);
        }
    }

    /**
     * 生成缩略图
     *
     * @param w       宽度
     * @param h       高度
     * @param nowTime 当前时间
     * @param force   是否强制按照宽高生成缩略图(如果为false，则生成最佳比例缩略图)
     * @param img     BufferedImage
     * @return ThumbnailPath
     * @throws IOException e
     */
    private String getSlt(int w, int h, String nowTime, boolean force, BufferedImage img) throws IOException {
        if (img == null) { //文件不是图片
            return null;
        }
        BufferedImage bi = getBufferedImage(w, h, force, img);
        //从配置文件中获取缩略图保存路径及其前缀、后缀
        String suffix = CacheKit.get(Cache.CONFIG, "th_suffix");
        String thumbnailPath = CacheKit.get(Cache.CONFIG, "thumbnailPath");
        File thumbnailfile = new File(thumbnailPath);
        if (!thumbnailfile.exists()) {
            if (!thumbnailfile.mkdirs()) {  //目录不存在则创建
                throw new RuntimeException("创建缩略图路径失败");
            }
        }
        //拼接缩略图物理绝对路径
        String thAbsolutePath = thumbnailPath + File.separator + "th" + nowTime + "." + suffix;
        File f = new File(thAbsolutePath);
        ImageIO.write(bi, suffix, f);
        return thAbsolutePath;
    }

    /**
     * 根据宽度、高度获取BufferedImage
     *
     * @param w     宽度
     * @param h     高度
     * @param force 是否强制按照宽高生成缩略图(如果为false，则生成最佳比例缩略图)
     * @param img   BufferedImage
     * @return BufferedImage
     */
    private BufferedImage getBufferedImage(int w, int h, boolean force, BufferedImage img) {
        if (!force) {
            int width = img.getWidth();
            int height = img.getHeight();
            if ((width * 1.0) / w < (height * 1.0) / h) {
                if (width > w) {
                    h = Integer.parseInt(new java.text.DecimalFormat("0").format(height * w / (width * 1.0)));
                }
            } else {
                if (height > h) {
                    w = Integer.parseInt(new java.text.DecimalFormat("0").format(width * h / (height * 1.0)));
                }
            }
        }
        BufferedImage bi = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
        Graphics g = bi.getGraphics();
        g.drawImage(img, 0, 0, w, h, Color.LIGHT_GRAY, null);
        g.dispose();
        return bi;
    }
}
