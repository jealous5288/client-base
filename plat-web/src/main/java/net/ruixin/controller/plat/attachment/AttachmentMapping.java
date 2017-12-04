package net.ruixin.controller.plat.attachment;

import net.ruixin.controller.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 附件Mapping
 */
@Controller
@RequestMapping("/attachment")
public class AttachmentMapping extends BaseController {

    //上传
    @RequestMapping("addFileUpload")
    public String addFileUpload() {
        return "baseModel/attachment/addFileUpload";
    }

    //查看
    @RequestMapping("showFile")
    public String showFile() {
        return "baseModel/attachment/showFile";
    }

    //查看缩略图
    @RequestMapping("showLzPhoto")
    public String showLzPhoto() {
        return "baseModel/attachment/showLzPhoto";
    }

    //查看原图
    @RequestMapping("showYt")
    public String showYt() {
        return "baseModel/attachment/showYt";
    }

    //照片上传
    @RequestMapping("addImageUpload")
    public String addImageUpload(){
        return "baseModel/attachment/addImageUpload";
    }


    //照片上传
    @RequestMapping("fjFzIndex")
    public String fjFzIndex(){
        return "baseModel/attachment/fjFzIndex";
    }
}


