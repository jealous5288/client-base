package net.ruixin.domain.plat.auth;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.rule.Restrict;
import net.ruixin.domain.rule.Rule;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Jealous on 2016/8/19.
 * 模块实体
 */
@SuppressWarnings("unused")
@Table(name = "SYS_MODULE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysModule extends BaseDomain {
    //主键ID
    @Id
    @SequenceGenerator(name = "seq_sysmodule", sequenceName = "SEQ_SYS_MODULE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sysmodule")
    private Long id;

    //模块名称
    @Restrict(rules = {@Rule(validateClass = "CheckUnique", name = "模块名称")})
    @Column(name = "MODULE_NAME")
    private String moduleName;

    //模块代码
    @Restrict(rules = {@Rule(validateClass = "CheckUnique", name = "模块编码")})
    @Column(name = "MODULE_CODE")
    private String moduleCode;

    //关联页面ids
    @Formula("(SELECT WM_CONCAT(P.ID) FROM SYS_PAGE P WHERE P.MODULE_ID=ID AND P.SFYX_ST = '1')")
    private String pageIds;

    //关联页面names
    @Formula("(SELECT WM_CONCAT(P.NAME) FROM SYS_PAGE P WHERE P.MODULE_ID=ID AND P.SFYX_ST = '1')")
    private String pageNames;

    //显示顺序
    @Column(name = "SORT_NUM")
    private Integer sortNum;

    //是否有效
    @Enumerated(value = EnumType.ORDINAL)
    private Sfyx_st sfyx_st;

    //创建人
    @Column(name = "CJR_ID")
    private Long cjr_id;

    //创建时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CJSJ")
    private Date cjsj;

    //修改人
    @Column(name = "XGR_ID")
    private Long xgr_id;

    //修改时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "XGSJ")
    private Date xgsj;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public String getModuleCode() {
        return moduleCode;
    }

    public void setModuleCode(String moduleCode) {
        this.moduleCode = moduleCode;
    }

    public Integer getSortNum() {
        return sortNum;
    }

    public void setSortNum(Integer sortNum) {
        this.sortNum = sortNum;
    }

    public Sfyx_st getSfyx_st() {
        return sfyx_st;
    }

    public void setSfyx_st(Sfyx_st sfyx_st) {
        this.sfyx_st = sfyx_st;
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
}
