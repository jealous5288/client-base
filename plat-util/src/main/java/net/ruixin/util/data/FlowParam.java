package net.ruixin.util.data;


import com.fasterxml.jackson.annotation.JsonProperty;
import net.ruixin.domain.plat.BaseDomain;

/**
 * 工作流运行参数
 */
@SuppressWarnings("unused")
public class FlowParam extends BaseDomain {
    private boolean edit;
    private boolean lookflg;
    @JsonProperty("Wstatus")
    private String Wstatus;
    private Long sId;
    private Long wId;
    private Integer sort;
    private Long rwId;
    private Long lcId;
    @JsonProperty("WdataId")
    private Long WdataId;
    @JsonProperty("PdataId")
    private Long PdataId;
    private Long wpId;
    private Long npId;
    private Long spId;
    private Long nId;

    public boolean isEdit() {
        return edit;
    }

    public void setEdit(boolean edit) {
        this.edit = edit;
    }

    public boolean isLookflg() {
        return lookflg;
    }

    public void setLookflg(boolean lookflg) {
        this.lookflg = lookflg;
    }

    public String getWstatus() {
        return Wstatus;
    }

    public void setWstatus(String wstatus) {
        Wstatus = wstatus;
    }

    public Long getsId() {
        return sId;
    }

    public void setsId(Long sId) {
        this.sId = sId;
    }

    public Long getwId() {
        return wId;
    }

    public void setwId(Long wId) {
        this.wId = wId;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public Long getRwId() {
        return rwId;
    }

    public void setRwId(Long rwId) {
        this.rwId = rwId;
    }

    public Long getLcId() {
        return lcId;
    }

    public void setLcId(Long lcId) {
        this.lcId = lcId;
    }

    public Long getWdataId() {
        return WdataId;
    }

    public void setWdataId(Long wdataId) {
        WdataId = wdataId;
    }

    public Long getPdataId() {
        return PdataId;
    }

    public void setPdataId(Long pdataId) {
        PdataId = pdataId;
    }

    public Long getWpId() {
        return wpId;
    }

    public void setWpId(Long wpId) {
        this.wpId = wpId;
    }

    public Long getNpId() {
        return npId;
    }

    public void setNpId(Long npId) {
        this.npId = npId;
    }

    public Long getSpId() {
        return spId;
    }

    public void setSpId(Long spId) {
        this.spId = spId;
    }

    public Long getnId() {
        return nId;
    }

    public void setnId(Long nId) {
        this.nId = nId;
    }
}
