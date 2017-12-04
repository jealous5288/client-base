package net.ruixin.service.plat.log.factory;

import net.ruixin.domain.plat.log.LogSucceed;
import net.ruixin.domain.plat.log.LogType;
import net.ruixin.domain.plat.log.LoginLog;
import net.ruixin.domain.plat.log.OperationLog;

import java.util.Date;

/**
 * 日志对象创建工厂
 */
public class LogFactory {
    /**
     * 创建登录日志
     */
    public static LoginLog createLoginLog(LogType logType, Long userId, String msg, String ip){
        LoginLog loginLog = new LoginLog();
        loginLog.setLogName(logType.getMessage());
        loginLog.setUserId(userId);
        loginLog.setIp(ip);
        loginLog.setLoginTime(new Date());
        loginLog.setMessage(msg);
        loginLog.setSuccess(LogSucceed.SUCCESS.getMessage());
        return loginLog;
    }

    /**
     * 创建操作日志
     */
    public static OperationLog createOperationLog(LogType logType, Long userId, String bussinessName, String clazzName, String methodName, String msg, LogSucceed succeed) {
        OperationLog operationLog = new OperationLog();
        operationLog.setLogType(logType.getMessage());
        operationLog.setLogName(bussinessName);
        operationLog.setUserId(userId);
        operationLog.setClassName(clazzName);
        operationLog.setMethod(methodName);
        operationLog.setCreateTime(new Date());
        operationLog.setSuccess(succeed.getMessage());
        operationLog.setMessage(msg);
        return operationLog;
    }
}
