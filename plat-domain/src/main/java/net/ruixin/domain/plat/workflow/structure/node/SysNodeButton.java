package net.ruixin.domain.plat.workflow.structure.node;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.Sfyx_st;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Administrator on 2017/9/2 0002.
 */
@SuppressWarnings("unused")
@Table(name = "sys_workflow_button")
@Entity
public class SysNodeButton extends BaseDomain {
    @Id
    @SequenceGenerator(name = "seq_sys_workflow_button", sequenceName = "seq_sys_workflow_button", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_workflow_button")
    private Long id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "CODE")
    private String code;

    @Column(name = "ICON")
    private String icon;

    @Column(name = "FLAG")
    private String flag;

    @Column(name = "FUNCNAME")
    private String funcName;

    //所属环节
    @ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    @JoinColumn(name = "NODE_ID")
    private SysNode node;

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

    //排序号
    @Column(name = "sort")
    private Integer sort;

    //是都只在办理中显示
    @Column(name = "ISSHOWINHANDLE")
    private String isShowInHandle;
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

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getFlag() {
        return flag;
    }

    public void setFlag(String flag) {
        this.flag = flag;
    }

    public String getFuncName() {
        return funcName;
    }

    public void setFuncName(String funcName) {
        this.funcName = funcName;
    }

    public SysNode getNode() {
        return node;
    }

    public void setNode(SysNode node) {
        this.node = node;
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

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public String getIsShowInHandle() {
        return isShowInHandle;
    }

    public void setIsShowInHandle(String isShowInHandle) {
        this.isShowInHandle = isShowInHandle;
    }
}
