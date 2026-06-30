package com.krishishetra.controller;

import com.krishishetra.AbstractIntegrationTest;
import com.krishishetra.model.Product;
import com.krishishetra.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * End-to-end tests for the product catalogue. Reads are public; writes require
 * an authenticated user.
 */
class ProductControllerIT extends AbstractIntegrationTest {

    @Autowired
    private ProductRepository productRepository;

    private Product millet;

    @BeforeEach
    void seedProducts() {
        millet = productRepository.save(Product.builder()
                .name("Pearl Millet").price(120).category("Millets").inStock(true).build());
        productRepository.save(Product.builder()
                .name("Coconut Oil").price(350).category("Oils").inStock(true).build());
    }

    @Test
    void getAllProductsIsPublicAndReturnsEverything() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void getProductsFilteredBySearch() throws Exception {
        mockMvc.perform(get("/api/products").param("search", "millet"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is("Pearl Millet")));
    }

    @Test
    void getProductsFilteredByCategory() throws Exception {
        mockMvc.perform(get("/api/products").param("category", "Oils"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is("Coconut Oil")));
    }

    @Test
    void getProductByIdReturnsProduct() throws Exception {
        mockMvc.perform(get("/api/products/" + millet.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Pearl Millet")));
    }

    @Test
    void getProductByUnknownIdReturns404() throws Exception {
        mockMvc.perform(get("/api/products/64b0000000000000000000ff"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createProductRequiresAuthentication() throws Exception {
        mockMvc.perform(post("/api/products")
                        .contentType(APPLICATION_JSON)
                        .content(toJson(Product.builder().name("Ghee").price(600).build())))
                .andExpect(result -> assertThat(result.getResponse().getStatus()).isIn(401, 403));
    }

    @Test
    void createProductSucceedsForAuthenticatedUser() throws Exception {
        String token = registerAndGetToken("seller@krishi.in", "secret123", "FPO");

        mockMvc.perform(post("/api/products")
                        .header("Authorization", bearer(token))
                        .contentType(APPLICATION_JSON)
                        .content(toJson(Product.builder().name("Ghee").price(600).build())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("Ghee")))
                .andExpect(jsonPath("$.inStock", is(true)));

        assertThat(productRepository.findByNameContainingIgnoreCase("Ghee")).hasSize(1);
    }

    @Test
    void updateProductSucceedsForAuthenticatedUser() throws Exception {
        String token = registerAndGetToken("editor@krishi.in", "secret123", "FPO");

        Product update = Product.builder().name("Pearl Millet (Premium)").price(150).category("Millets").build();
        mockMvc.perform(put("/api/products/" + millet.getId())
                        .header("Authorization", bearer(token))
                        .contentType(APPLICATION_JSON)
                        .content(toJson(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Pearl Millet (Premium)")))
                .andExpect(jsonPath("$.price", is(150.0)));

        assertThat(productRepository.findById(millet.getId()).orElseThrow().getPrice()).isEqualTo(150.0);
    }

    @Test
    void deleteProductSucceedsForAuthenticatedUser() throws Exception {
        String token = registerAndGetToken("remover@krishi.in", "secret123", "FPO");

        mockMvc.perform(delete("/api/products/" + millet.getId())
                        .header("Authorization", bearer(token)))
                .andExpect(status().isNoContent());

        assertThat(productRepository.findById(millet.getId())).isEmpty();
    }
}
