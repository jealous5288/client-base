package net.ruixin.domain.plat.auth;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by admin on 2016-8-31.
 * 数据权限生成规则实体
 */
@SuppressWarnings("unused")
@Table(name = "SYS_AUTH_RULE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysAuthRule extends BaseDomain {
    /**
     * 主键id
     */
    @Id
    @SequenceGenerator(name = "seq_auth_rule", sequenceName = "SEQ_SYS_AUTH_RULE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_auth_rule")
    private Long id;
    /**
     * 对象类ID
     */
    @Column(name = "OBJECT_ID")
    private Long objectId;

    @Formula("(SELECT O.OBJ_NAME FROM SYS_OBJECT O WHERE O.ID=OBJECT_ID AND O.SFYX_ST='1')")
    private String objectName;
    /**
     * 权限类型  1：查看权限，2：维护权限
     */
    @Column(name = "QXLX")
    private String qxlx;
    /**
     * 规则类型  1：数据权限规则，2：动态规则
     */
    @Column(name = "GZLX")
    private String gzlx;
    /**
     * 页面IDs
     */
    @Column(name = "PAGE_IDS")
    private String pageIds;

    @Formula("(SELECT WM_CONCAT(P.NAME) FROM SYS_PAGE P WHERE P.ID IN " +
            " (SELECT * FROM TABLE(SPLITSTR(PAGE_IDS, ','))) AND P.SFYX_ST = '1')")
    private String pageNames;
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
     * 修改人
     */
    @Column(name = "XGR_ID")
    private Long xgr_id;
    /**
     * 修改时间
     */
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "XGSJ")
    private Date xgsj;
    /**
     * 有效状态，0：无效，1：有效
     */
    @Enumerated
    private Sfyx_st sfyx_st;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumns(@JoinColumn(name = "GL_RULE_ID", referencedColumnName = "ID"))
    private SysBaseRule sysBaseRule;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getQxlx() {
        return qxlx;
    }

    public void setQxlx(String qxlx) {
        this.qxlx = qxlx;
    }

    public String getGzlx() {
        return gzlx;
    }

    public void setGzlx(String gzlx) {
        this.gzlx = gzlx;
    }

    public String getPageNames() {
        return pageNames;
    }

    public void setPageNames(String pageNames) {
        this.pageNames = pageNames;
    }

    public String getPageIds() {
        return pageIds;
    }

    public void setPageIds(String pageIds) {
        this.pageIds = pageIds;
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

    public Long getXgr_id() {
        return xgr_id;
    }

    public void setXgr_id(Long xgr_id) {
        this.xgr_id = xgr_id;
    }

    public Date getXgsj() {
        return xgsj;
    }

    public void setXgsj(Date xgsj) {
        this.xgsj = xgsj;
    }

    public Sfyx_st getSfyx_st() {
        return sfyx_st;
    }

    public void setSfyx_st(Sfyx_st sfyx_st) {
        this.sfyx_st = sfyx_st;
    }

    public SysBaseRule getSysBaseRule() {
        return sysBaseRule;
    }

    public void setSysBaseRule(SysBaseRule sysBaseRule) {
        this.sysBaseRule = sysBaseRule;
    }
}
