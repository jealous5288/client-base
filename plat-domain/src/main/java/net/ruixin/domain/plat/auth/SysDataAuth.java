package net.ruixin.domain.plat.auth;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;

import javax.persistence.*;
import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * 数据权限实体
 */
@SuppressWarnings("unused")
@Table(name = "SYS_DATA_AUTH")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysDataAuth extends BaseDomain {
    /**
     * 主键id
     */
    @Id
    @SequenceGenerator(name = "seq_data_auth", sequenceName = "SEQ_SYS_DATA_AUTH", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_data_auth")
    private Long id;
    /**
     * 角色id
     */
    @Column(name = "ROLE_ID")
    private Long roleId;
    /**
     * 角色名称
     */
    @Formula("(CASE WHEN ROLE_ID IS NULL THEN NULL ELSE (SELECT R.ROLE_NAME FROM SYS_ROLE R WHERE R.ID=ROLE_ID AND R.SFYX_ST='1') END)")
    private String roleName;
    /**
     * 规则id
     */
    @Column(name = "RULE_ID")
    private Long ruleId;
    /**
     * 用户id
     */
    @Column(name = "USER_ID")
    private Long userId;
    /**
     * 用户名称
     */
    @Formula("(SELECT U.USER_NAME FROM SYS_USER U WHERE U.ID=USER_ID AND U.SFYX_ST='1')")
    private String userName;
    /**
     * 对象id
     */
    @Column(name = "OBJECT_ID")
    private Long objectId;
    /**
     * 对象名称
     */
    @Formula("(SELECT O.OBJ_NAME FROM SYS_OBJECT O WHERE O.ID=OBJECT_ID AND O.SFYX_ST='1')")
    private String objectName;
    /**
     * 对象数据ids
     */
    @Column(name = "OIDS")
    private String oids;
    /**
     * 页面IDS
     */
    @Column(name = "PAGE_IDS")
    private String pageIds;
    /**
     * 页面名称
     */
    @Formula("(SELECT WM_CONCAT(P.NAME) FROM SYS_PAGE P " +
            "WHERE INSTR(',' || PAGE_IDS || ',', ',' || P.ID || ',') > 0 AND P.SFYX_ST='1')")
    private String pageNames;
    /**
     * 权限类型
     */
    @Column(name = "QXLX")
    private String qxlx;
    /**
     * 创建人
     */
    @Column(name = "CJR_ID")
    private Long cjr_id;
    /**
     * 创建时间
     */
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CJSJ")
    private Date cjsj;
    /**
     * 有效状态，0：无效，1：有效
     */
    @Enumerated
    private Sfyx_st sfyx_st;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public Long getRuleId() {
        return ruleId;
    }

    public void setRuleId(Long ruleId) {
        this.ruleId = ruleId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getObjectId() {
        return objectId;
    }

    public void setObjectId(Long objectId) {
        this.objectId = objectId;
    }

    public String getObjectName() {
        return objectName;
    }

    public void setObjectName(String objectName) {
        this.objectName = objectName;
    }

    public String getOids() {
        return oids;
    }

    public void setOids(String oids) {
        this.oids = oids;
    }

    public String getPageIds() {
        return pageIds;
    }

    public void setPageIds(String pageIds) {
        this.pageIds = pageIds;
    }

    public String getPageNames() {
        return pageNames;
    }

    public void setPageNames(String pageNames) {
        this.pageNames = pageNames;
    }

    public String getQxlx() {
        return qxlx;
    }

    public void setQxlx(String qxlx) {
        this.qxlx = qxlx;
    }

    public Long getCjr_id() {
        return cjr_id;
    }

    public void setCjr_id(Long cjr_id) {
        this.cjr_id = cjr_id;
    }

    public Date getCjsj() {
        return cjsj;
    }

    public void setCjsj(Date cjsj) {
        this.cjsj = cjsj;
    }

    public Sfyx_st getSfyx_st() {
        return sfyx_st;
    }

    public void setSfyx_st(Sfyx_st sfyx_st) {
        this.sfyx_st = sfyx_st;
    }
}
