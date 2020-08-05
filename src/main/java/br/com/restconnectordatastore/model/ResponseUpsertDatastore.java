package br.com.restconnectordatastore.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResponseUpsertDatastore {

    @JsonProperty("status")
    private String status;

    @JsonProperty("enqueue")
    private Boolean enqueue;
}
