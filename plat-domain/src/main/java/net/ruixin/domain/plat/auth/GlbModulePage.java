package net.ruixin.domain.plat.auth;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

/**
 * Created by Zp on 2017/3/28.
 * 模块页面关联
 */
@SuppressWarnings("unused")
@Table(name = "SYS_GLB_MODULE_PAGE")
@Entity
@DynamicInsert
@DynamicUpdate
public class GlbModulePage extends BaseDomain {
    /**
     * 主键id
     */
    @Id
    @SequenceGenerator(name = "seq_glb_module_page", sequenceName = "SEQ_GLB_MODULE_PAGE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_glb_module_page")
    private Long id;

    /**
     * 模块ID
     */
    @Column(name = "MODULE_ID")
    private Long moduleId;

    /**
     * 关联页面
     */
    @OneToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name="PAGE_ID")
    private SysPage page;

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

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }

    public SysPage getPage() {
        return page;
    }

    public void setPage(SysPage page) {
        this.page = page;
    }

    public Sfyx_st getSfyx_st() {
        return sfyx_st;
    }

    public void setSfyx_st(Sfyx_st sfyx_st) {
        this.sfyx_st = sfyx_st;
    }
}
