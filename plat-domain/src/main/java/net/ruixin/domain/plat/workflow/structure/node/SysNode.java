package net.ruixin.domain.plat.workflow.structure.node;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.enumerate.plat.NodeType;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Jealous on 2015/10/15.
 * 实体类：环节
 */
@SuppressWarnings("unused")
@Entity
@Table(name = "SYS_NODE")
@Inheritance(strategy = InheritanceType.JOINED)
@DynamicInsert
@DynamicUpdate
public class SysNode extends BaseDomain {
    //ID
    @Id
    @SequenceGenerator(name = "seq_node", sequenceName = "SEQ_SYS_NODE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_node")
    private Long id;
    //名称
    @Column(name = "NAME")
    private String name;
    //x坐标
    @Column(name = "X")
    private Integer x;
    //y坐标
    @Column(name = "Y")
    private Integer y;
    //节点类型
    @Enumerated
    @Column(name = "TYPE")
    private NodeType type;
    //所属流程
    @ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    @JoinColumn(name = "WORKFLOW_ID")
    private SysWorkflow sysWorkflow;
    //序号
    @Column(name = "SORT")
    private Integer sort;
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

    //是否显示保存按钮：0不显示,1显示
    @Column(name = "SFXSBC")
    private String sfxsbc;

    //是否必须上传附件：0不必须,1必须
    @Column(name = "SFBXSCFJ")
    private String sfbxscfj;

    //环节业务状态
    @Column(name = "YWZT")
    private String ywzt;

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

    public Integer getX() {
        return x;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public Integer getY() {
        return y;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public NodeType getType() {
        return type;
    }

    public void setType(NodeType type) {
        this.type = type;
    }

    public SysWorkflow getSysWorkflow() {
        return sysWorkflow;
    }

    public void setSysWorkflow(SysWorkflow sysWorkflow) {
        this.sysWorkflow = sysWorkflow;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
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

    public String getSfxsbc() {
        return sfxsbc;
    }

    public void setSfxsbc(String sfxsbc) {
        this.sfxsbc = sfxsbc;
    }

    public String getSfbxscfj() {
        return sfbxscfj;
    }

    public void setSfbxscfj(String sfbxscfj) {
        this.sfbxscfj = sfbxscfj;
    }

    public String getYwzt() {
        return ywzt;
    }

    public void setYwzt(String ywzt) {
        this.ywzt = ywzt;
    }
}
