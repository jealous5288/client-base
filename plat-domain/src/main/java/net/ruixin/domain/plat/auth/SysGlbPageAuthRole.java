package net.ruixin.domain.plat.auth;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;

import javax.persistence.*;

/**
 * Created with IntelliJ IDEA.
 * 模块功能权限关联实体
 */
@SuppressWarnings({"unused", "WeakerAccess"})
@Table(name = "SYS_GLB_PAGE_AUTHROLE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysGlbPageAuthRole extends BaseDomain {
    /**
     * 主键id
     */
    @Id
    @SequenceGenerator(name = "seq_module_authrole", sequenceName = "SEQ_SYS_GLB_PAGE_AUTHROLE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_module_authrole")
    private Long id;
    /**
     * 功能权限id
     */
    @Column(name = "AUTHROLE_ID")
    private Long authroleId;
    /**
     * 页面ID
     */
    @Column(name = "PAGE_ID")
    private Long pageId;

    /**
     * 有效状态，0：无效，1：有效
     */
    @Enumerated
    private Sfyx_st sfyx_st;


    //权限名称
    @Formula("(SELECT A.NAME FROM SYS_ACTION_AUTH A WHERE A.ID=AUTHROLE_ID AND A.SFYX_ST='1')")
    private String name;

    //权限编码
    @Formula("(SELECT A.CODE FROM SYS_ACTION_AUTH A WHERE A.ID=AUTHROLE_ID AND A.SFYX_ST='1')")
    private String code;

    //权限描述
    @Formula("(SELECT A.DESCRIPTION FROM SYS_ACTION_AUTH A WHERE A.ID=AUTHROLE_ID AND A.SFYX_ST='1')")
    private String description;

    //权限类型
    @Formula("(SELECT A.TYPE FROM SYS_ACTION_AUTH A WHERE A.ID=AUTHROLE_ID AND A.SFYX_ST='1')")
    private String type;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAuthroleId() {
        return authroleId;
    }

    public void setAuthroleId(Long authroleId) {
        this.authroleId = authroleId;
    }

    public Long getPageId() {
        return pageId;
    }

    public void setPageId(Long pageId) {
        this.pageId = pageId;
    }

    public Sfyx_st getSfyx_st() {
        return sfyx_st;
    }

    public void setSfyx_st(Sfyx_st sfyx_st) {
        this.sfyx_st = sfyx_st;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
