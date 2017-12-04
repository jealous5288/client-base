package net.ruixin.intercept;

import net.ruixin.controller.BaseController;
import net.ruixin.service.plat.shiro.ShiroKit;
import net.ruixin.util.http.HttpKit;
import org.apache.shiro.session.InvalidSessionException;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

/**
 * 验证session超时的拦截器
 */
@Aspect
@Component
public class SessionTimeoutInterceptor extends BaseController {

    @Pointcut("execution(* net.ruixin.controller..*.*(..))")
    public void cutService() {
    }

    @Around("cutService()")
    public Object sessionTimeoutValidate(ProceedingJoinPoint point) throws Throwable {

        String servletPath = getPath();
        if (servletPath.equals("/login")
                || servletPath.equals("logout")
                || servletPath.equals("/global/notFound")
                || servletPath.equals("/global/error")
                || servletPath.equals("/global/sessionError")
                || servletPath.equals("/global/unauthorized")) {
            return point.proceed();
        } else {
            if (ShiroKit.getSession().getAttribute("sessionFlag") == null) {
                ShiroKit.getSubject().logout();
                throw new InvalidSessionException();
            } else {
                return point.proceed();
            }
        }
    }

    private String getPath() {
        HttpServletRequest request = HttpKit.getRequest();
        String uri = request.getServletPath();
        String pathInfo = request.getPathInfo();
        if (pathInfo != null && pathInfo.length() > 0) {
            uri = uri + pathInfo;
        }
        return uri;
    }
}
