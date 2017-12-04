package net.ruixin.domain.plat.workflow.structure.node;

import net.ruixin.enumerate.plat.DecisionType;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

/**
 * Created by Jealous on 2015/10/15.
 * 实体类：决策环节
 */
@SuppressWarnings("unused")
@Table(name = "SYS_DECISION_NODE")
@Entity
@PrimaryKeyJoinColumn(name="ID")
@DynamicInsert
@DynamicUpdate
public class SysDecisionNode extends SysTransactNode{
    //决策类型
    @Enumerated
    @Column(name = "DECISION_TYPE")
    private DecisionType decisionType;

    public DecisionType getDecisionType() {
        return decisionType;
    }

    public void setDecisionType(DecisionType decisionType) {
        this.decisionType = decisionType;
    }
}
