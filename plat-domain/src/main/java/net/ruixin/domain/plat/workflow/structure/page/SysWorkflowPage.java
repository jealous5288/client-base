package net.ruixin.domain.plat.workflow.structure.page;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.plat.auth.SysPage;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

/**
 * Created by Jealous on 2015/10/15.
 * 流程和页面关系类
 */
@SuppressWarnings("unused")
@Table(name = "SYS_WORKFLOW_PAGE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysWorkflowPage extends BaseDomain {
    //ID
    @Id
    @SequenceGenerator(name = "seq_workflow_page", sequenceName = "SEQ_SYS_WORKFLOW_PAGE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_workflow_page")
    private Long id;
    //名称
    @Column(name = "NAME")
    private String name;
    //所属流程
    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name = "WORKFLOW_ID")
    private SysWorkflow sysWorkflow;
    //所属页面
    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name = "PAGE_ID")
    private SysPage sysPage;
    //序号
    @Column(name = "SORT")
    private Integer sort;
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

    public SysWorkflow getSysWorkflow() {
        return sysWorkflow;
    }

    public void setSysWorkflow(SysWorkflow sysWorkflow) {
        this.sysWorkflow = sysWorkflow;
    }

    public SysPage getSysPage() {
        return sysPage;
    }

    public void setSysPage(SysPage sysPage) {
        this.sysPage = sysPage;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public Sfyx_st getSfyx_st() {
        return sfyx_st;
    }

    public void setSfyx_st(Sfyx_st sfyx_st) {
        this.sfyx_st = sfyx_st;
    }
}
