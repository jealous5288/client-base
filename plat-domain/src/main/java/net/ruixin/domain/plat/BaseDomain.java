package net.ruixin.domain.plat;

import com.fasterxml.jackson.databind.JsonNode;

import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;
import java.io.Serializable;

/**
 * 实体基类
 * Created by Jealous on 2016-11-9.
 */
@MappedSuperclass
public class BaseDomain implements Serializable{
    @Transient
    private JsonNode interactionFields;

    public JsonNode getInteractionFields() {
        return interactionFields;
    }

    public void setInteractionFields(JsonNode interactionFields) {
        this.interactionFields = interactionFields;
    }
}
