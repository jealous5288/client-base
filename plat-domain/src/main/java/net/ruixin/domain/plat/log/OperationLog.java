package net.ruixin.domain.plat.log;

import net.ruixin.domain.plat.BaseDomain;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 操作日志
 */
@Table(name = "SYS_LOG_OPERATION")
@Entity
@DynamicInsert
@DynamicUpdate
public class OperationLog extends BaseDomain {
    @Id
    @SequenceGenerator(name = "seq_sys_log", sequenceName = "SEQ_SYS_LOG_LOGIN", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_log")
    private Long id;

    /**
     * 日志类型
     */
    @Column(name = "LOG_TYPE")
    private String logType;
    /**
     * 日志名称
     */
    @Column(name = "LOG_NAME")
    private String logName;
    /**
     * 用户id
     */
    @Column(name = "USER_ID")
    private Long userId;
    /**
     * 类名称
     */
    @Column(name = "CLASS_NAME")
    private String className;
    /**
     * 方法名称
     */
    @Column(name = "METHOD")
    private String method;
    /**
     * 创建时间
     */
    @Column(name = "CREATE_TIME")
    private Date createTime;
    /**
     * 是否成功
     */
    @Column(name = "SUCCESS")
    private String success;
    /**
     * 备注
     */
    @Column(name = "MESSAGE")
    private String message;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLogType() {
        return logType;
    }

    public void setLogType(String logType) {
        this.logType = logType;
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

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
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
}
