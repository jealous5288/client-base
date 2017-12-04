package net.ruixin.domain.plat.dictionary;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.rule.Restrict;
import net.ruixin.domain.rule.Rule;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * 字典实体
 */
@SuppressWarnings("unused")
@Table(name = "SYS_DICT")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysDict extends BaseDomain {

    @Id
    @SequenceGenerator(name = "seq_sys_dict", sequenceName = "SEQ_SYS_DICT", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_dict")
    private Long id;

    //字典名称
    @Restrict(rules = {@Rule(validateClass = "CheckUnique", name = "字典名称")})
    @Column(name = "DICT_NAME")
    private String dictName;

    //字典编码
    @Restrict(rules = {@Rule(validateClass = "CheckUnique", name = "字典编码")})
    @Column(name = "DICT_CODE")
    private String dictCode;

    //字典类型 1：系统字典   2：流程字典
    @Column(name = "DICT_TYPE")
    private String dictType;

    //字典描述
    @Column(name = "DESCRIPTION")
    private String description;

    //上级字典编码
    @Column(name = "PDICT_CODE")
    private String pdictCode;

    //上级字典名称
    @Formula("(SELECT DICT.DICT_NAME FROM SYS_DICT DICT WHERE DICT.DICT_CODE=PDICT_CODE AND DICT.SFYX_ST='1')")
    private String pdictName;

    //上级字典是否为空
    @Formula("(SELECT DICT.IS_EMPTY FROM SYS_DICT DICT WHERE DICT.DICT_CODE=PDICT_CODE AND DICT.SFYX_ST='1')")
    private String pdictIsEmpty;

    @Column(name = "IS_EMPTY")
    private String isEmpty;

    //创建人id
    @Column(name = "CJR_ID")
    private Long cjr_id;

    //创建时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CJSJ")
    private Date cjsj;

    //修改人id
    @Column(name = "XGR_ID")
    private Long xgr_id;

    //修改时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "XGSJ")
    private Date xgsj;

    //有效状态，0：无效，1：有效
    @Enumerated
    private Sfyx_st sfyx_st;

    //与字典项的一对多关系
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "DICT_CODE", referencedColumnName = "DICT_CODE")
    @Where(clause = "SFYX_ST='1'")
    @OrderBy("sort")
    private List<SysSubDict> sysSubDictList;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDictName() {
        return dictName;
    }

    public void setDictName(String dictName) {
        this.dictName = dictName;
    }

    public String getDictCode() {
        return dictCode;
    }

    public void setDictCode(String dictCode) {
        this.dictCode = dictCode;
    }

    public String getDictType() {
        return dictType;
    }

    public void setDictType(String dictType) {
        this.dictType = dictType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPdictCode() {
        return pdictCode;
    }

    public void setPdictCode(String pdictCode) {
        this.pdictCode = pdictCode;
    }

    public String getPdictName() {
        return pdictName;
    }

    public void setPdictName(String pdictName) {
        this.pdictName = pdictName;
    }

    public String getPdictIsEmpty() {
        return pdictIsEmpty;
    }

    public void setPdictIsEmpty(String pdictIsEmpty) {
        this.pdictIsEmpty = pdictIsEmpty;
    }

    public String getIsEmpty() {
        return isEmpty;
    }

    public void setIsEmpty(String isEmpty) {
        this.isEmpty = isEmpty;
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

    public List<SysSubDict> getSysSubDictList() {
        return sysSubDictList;
    }

    public void setSysSubDictList(List<SysSubDict> sysSubDictList) {
        this.sysSubDictList = sysSubDictList;
    }
}
