package net.ruixin.controller;

import net.ruixin.util.constant.Const;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.exception.BizExceptionEnum;
import net.ruixin.util.exception.BussinessException;
import net.ruixin.util.file.FileUtil;
import net.ruixin.util.http.HttpKit;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

public class BaseController {
    protected static String REDIRECT = "redirect:";
    protected static String FORWARD = "forward:";

    protected static AjaxReturn SUCCESS = new AjaxReturn(true);
    protected static AjaxReturn ERROR = new AjaxReturn(false);

    protected HttpServletRequest getHttpServletRequest() {
        return HttpKit.getRequest();
    }

    protected HttpServletResponse getHttpServletResponse() {
        return HttpKit.getResponse();
    }

    protected HttpSession getSession() {
        return HttpKit.getRequest().getSession();
    }

    protected HttpSession getSession(Boolean flag) {
        return HttpKit.getRequest().getSession(flag);
    }

    protected Long getCurrentUserId() {
        return (Long) getSession().getAttribute(Const.USER_ID);
    }

    protected String getPara(String name) {
        return HttpKit.getRequest().getParameter(name);
    }

    protected void setAttr(String name, Object value) {
        HttpKit.getRequest().setAttribute(name, value);
    }

    protected void deleteCookieByName(String cookieName) {
        Cookie[] cookies = this.getHttpServletRequest().getCookies();
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals(cookieName)) {
                Cookie temp = new Cookie(cookie.getName(), "");
                temp.setMaxAge(0);
                this.getHttpServletResponse().addCookie(temp);
            }
        }
    }

    protected ResponseEntity<byte[]> renderFile(String fileName, String filePath) {
        byte[] bytes = FileUtil.toByteArray(filePath);
        return renderFile(fileName, bytes);
    }

    protected ResponseEntity<byte[]> renderFile(String fileName, byte[] fileBytes) {
        String dfileName;
        try {
            dfileName = URLEncoder.encode(fileName, "utf-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            throw new BussinessException(BizExceptionEnum.File_CODING_ERROR);
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", dfileName);
        return new ResponseEntity<>(fileBytes, headers, HttpStatus.CREATED);
    }
}
