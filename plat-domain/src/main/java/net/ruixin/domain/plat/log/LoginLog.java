package net.ruixin.domain.plat.log;

import net.ruixin.domain.plat.BaseDomain;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 登录日志
 */
@Table(name = "SYS_LOG_LOGIN")
@Entity
@DynamicInsert
@DynamicUpdate
public class LoginLog extends BaseDomain {
    @Id
    @SequenceGenerator(name = "seq_sys_log", sequenceName = "SEQ_SYS_LOG_LOGIN", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_log")
    private Long id;

//    日志名称
    @Column(name = "LOG_NAME")
    private String logName;

//    用户id
    @Column(name = "USER_ID")
    private Long userId;

//    是否执行成功
    @Column(name = "SUCCESS")
    private String success;

//    具体的消息
    @Column(name = "MESSAGE")
    private String message;

//    登录IP地址
    @Column(name = "IP")
    private String ip;

//    登录时间
    @Column(name = "LOGIN_TIME")
    private Date loginTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLogName() {
        return logName;
    }

    public void setLogName(String logName) {
        this.logName = logName;
    }


    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getSuccess() {
        return success;
    }

    public void setSuccess(String success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public Date getLoginTime() {
        return loginTime;
    }

    public void setLoginTime(Date loginTime) {
        this.loginTime = loginTime;
    }
}
