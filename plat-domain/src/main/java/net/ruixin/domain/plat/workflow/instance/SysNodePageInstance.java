package net.ruixin.domain.plat.workflow.instance;

import com.fasterxml.jackson.annotation.JsonBackReference;
import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.plat.auth.SysPage;
import net.ruixin.domain.plat.workflow.structure.page.SysNodePage;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Jealous on 2016/03/02.
 * 实体：环节页面关系实例类
 */
@SuppressWarnings("unused")
@Table(name = "SYS_NODE_PAGE_INSTANCE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysNodePageInstance extends BaseDomain {
    // ID
    @Id
    @SequenceGenerator(name = "seq_sys_node_page_instance", sequenceName = "SEQ_SYS_NODE_PAGE_INSTANCE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_node_page_instance")
    private Long id;

    // 环节实例
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "NODE_INSTANCE_ID")
    @JsonBackReference
    private SysNodeInstance node_instance_id;

    // 环节页面
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "NODE_PAGE_ID")
    @JsonBackReference
    private SysNodePage node_page_id;

    // 数据ID
    @Column(name = "DATA_ID")
    private Long data_id;

    // 创建时间
    @Column(name = "CJSJ")
    private Date cjsj;

    // 签章模版地址
    @Column(name = "PATH")
    private String path;

    // 页面ID
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "PAGE_ID")
    @JsonBackReference
    private SysPage page_id;

    // 排序
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

    public SysNodeInstance getNode_instance_id() {
        return node_instance_id;
    }

    public void setNode_instance_id(SysNodeInstance node_instance_id) {
        this.node_instance_id = node_instance_id;
    }

    public SysNodePage getNode_page_id() {
        return node_page_id;
    }

    public void setNode_page_id(SysNodePage node_page_id) {
        this.node_page_id = node_page_id;
    }

    public Long getData_id() {
        return data_id;
    }

    public void setData_id(Long data_id) {
        this.data_id = data_id;
    }

    public Date getCjsj() {
        return cjsj;
    }

    public void setCjsj(Date cjsj) {
        this.cjsj = cjsj;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public SysPage getPage_id() {
        return page_id;
    }

    public void setPage_id(SysPage page_id) {
        this.page_id = page_id;
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
