package br.com.restconnectordatastore.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Map;

@Data
public class RequestUpsertDataDatastore {

    @JsonProperty("entity")
    private String entity;

    @JsonProperty("key")
    private String key;

    @JsonProperty("object")
    private Map<String, Object> object;
}
