package com.krishishetra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "listings")
public class Listing {

    @Id
    private String id;

    private String crop;

    private String quantity;

    private String price;

    private String location;

    private String source;  // "manual" | "voice"

    /** Base64-encoded image or public URL */
    private String imageUrl;

    @Indexed
    private String userId;

    private String userEmail;

    private Instant createdAt;
}
