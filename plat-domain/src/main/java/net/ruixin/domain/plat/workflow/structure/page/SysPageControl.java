package net.ruixin.domain.plat.workflow.structure.page;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.Sfyx_st;
import net.ruixin.enumerate.plat.SheetControlStatus;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Jealous on 2015/10/15.
 * 实体：环节页面控制类
 */
@SuppressWarnings("unused")
@Table(name = "SYS_PAGE_CONTROL")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysPageControl extends BaseDomain {
    //ID
    @Id
    @SequenceGenerator(name = "seq_page_control", sequenceName = "SEQ_SYS_PAGE_CONTROL", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_page_control")
    private Long id;
    //名称
    @Column(name = "NAME")
    private String name;
    /* 环节页面 */
    @ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    @JoinColumn(name = "NODE_PAGE_ID")
    private SysNodePage nodePage;
    /* 控制状态 */
    @Enumerated
    @Column(name = "CONTROL")
    private SheetControlStatus control;
    //初始值
    @Column(name = "INITIAL_VALUE")
    private String initialValue;
    //创建人
    @Column(name = "CJR_ID")
    private Long cjr_id;
    //创建时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CJSJ")
    private Date cjsj;
    //有效标识
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

    public SysNodePage getNodePage() {
        return nodePage;
    }

    public void setNodePage(SysNodePage nodePage) {
        this.nodePage = nodePage;
    }

    public SheetControlStatus getControl() {
        return control;
    }

    public void setControl(SheetControlStatus control) {
        this.control = control;
    }

    public String getInitialValue() {
        return initialValue;
    }

    public void setInitialValue(String initialValue) {
        this.initialValue = initialValue;
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
