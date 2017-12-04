package net.ruixin.domain.plat.workflow.structure.node;

import net.ruixin.enumerate.plat.ConvergeType;
import net.ruixin.enumerate.plat.CountersignParameter;
import net.ruixin.enumerate.plat.TransactType;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

/**
 * Created by Jealous on 2015/10/15.
 * 实体类：活动环节
 */
@SuppressWarnings("unused")
@Table(name = "SYS_ACTIVITY_NODE")
@Entity
@PrimaryKeyJoinColumn(name="ID")
@DynamicInsert
@DynamicUpdate
public class SysActivityNode extends SysTransactNode{
    //多人办理方式
    @Enumerated
    @Column(name = "TRANSACT_TYPE")
    private TransactType transactType;
    //会签处理参数
    @Enumerated
    @Column(name = "COUNTERSIGN_PARAMETER")
    private CountersignParameter countersignParameter;
    //会签处理参数值
    @Column(name = "COUNTERSIGN_VALUE")
    private Integer countersignValue;
    //聚合方式
    @Column(name = "CONVERGE_TYPE")
    private ConvergeType convergeType;
    //不同意跳转环节ID
    @Column(name="DISAGREE_NODE_ID")
    private Long disagree_node_id;
    //
    @Transient
    private String disagree_nodedom_id;

    //提交个性设置名称
    @Column (name = "SUBMITNAME")
    private String submitName;

    //保存个性设置名称
    @Column (name = "SAVENAME")
    private String saveName;


    public TransactType getTransactType() {
        return transactType;
    }

    public void setTransactType(TransactType transactType) {
        this.transactType = transactType;
    }

    public CountersignParameter getCountersignParameter() {
        return countersignParameter;
    }

    public void setCountersignParameter(CountersignParameter countersignParameter) {
        this.countersignParameter = countersignParameter;
    }

    public Integer getCountersignValue() {
        return countersignValue;
    }

    public void setCountersignValue(Integer countersignValue) {
        this.countersignValue = countersignValue;
    }

    public ConvergeType getConvergeType() {
        return convergeType;
    }

    public void setConvergeType(ConvergeType convergeType) {
        this.convergeType = convergeType;
    }

    public Long getDisagree_node_id() {
        return disagree_node_id;
    }

    public void setDisagree_node_id(Long disagree_node_id) {
        this.disagree_node_id = disagree_node_id;
    }

    public String getDisagree_nodedom_id() {
        return disagree_nodedom_id;
    }

    public void setDisagree_nodedom_id(String disagree_nodedom_id) {
        this.disagree_nodedom_id = disagree_nodedom_id;
    }

    public String getSubmitName() {
        return submitName;
    }

    public void setSubmitName(String submitName) {
        this.submitName = submitName;
    }

    public String getSaveName() {
        return saveName;
    }

    public void setSaveName(String saveName) {
        this.saveName = saveName;
    }
}
