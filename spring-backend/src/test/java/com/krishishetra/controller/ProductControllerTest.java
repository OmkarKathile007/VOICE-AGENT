package com.krishishetra.controller;

import com.krishishetra.model.Product;
import com.krishishetra.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link ProductController} routing logic, with a mocked
 * repository. These assert which repository query each request maps to.
 */
@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductController productController;

    @Test
    void getAllProductsUsesSearchWhenSearchParamPresent() {
        when(productRepository.findByNameContainingIgnoreCase("millet"))
                .thenReturn(List.of(Product.builder().name("Bajra Millet").build()));

        ResponseEntity<List<Product>> response = productController.getAllProducts(null, "millet");

        assertThat(response.getBody()).hasSize(1);
        verify(productRepository).findByNameContainingIgnoreCase("millet");
        verify(productRepository, never()).findAll();
    }

    @Test
    void getAllProductsUsesCategoryWhenCategoryParamPresent() {
        when(productRepository.findByCategory("Oils"))
                .thenReturn(List.of(Product.builder().name("Coconut Oil").build()));

        ResponseEntity<List<Product>> response = productController.getAllProducts("Oils", null);

        assertThat(response.getBody()).hasSize(1);
        verify(productRepository).findByCategory("Oils");
    }

    @Test
    void getAllProductsReturnsEverythingForAllProductsCategory() {
        when(productRepository.findAll()).thenReturn(List.of(new Product(), new Product()));

        ResponseEntity<List<Product>> response = productController.getAllProducts("All Products", null);

        assertThat(response.getBody()).hasSize(2);
        verify(productRepository).findAll();
        verify(productRepository, never()).findByCategory(any());
    }

    @Test
    void getProductReturns404WhenMissing() {
        when(productRepository.findById("nope")).thenReturn(Optional.empty());

        ResponseEntity<?> response = productController.getProduct("nope");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void createProductForcesInStockAndStampsCreatedAt() {
        Product input = Product.builder().name("New Honey").price(450).build();
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        ResponseEntity<Product> response = productController.createProduct(input);

        ArgumentCaptor<Product> captor = ArgumentCaptor.forClass(Product.class);
        verify(productRepository).save(captor.capture());
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(captor.getValue().isInStock()).isTrue();
        assertThat(captor.getValue().getCreatedAt()).isNotNull();
    }

    @Test
    void updateProductReturns404WhenMissing() {
        when(productRepository.findById("nope")).thenReturn(Optional.empty());

        ResponseEntity<?> response = productController.updateProduct("nope", new Product());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        verify(productRepository, never()).save(any());
    }

    @Test
    void updateProductPreservesIdAndCreatedAtOfExisting() {
        Product existing = Product.builder().id("p1").name("Old").build();
        existing.setCreatedAt(java.time.Instant.parse("2026-01-01T00:00:00Z"));
        when(productRepository.findById("p1")).thenReturn(Optional.of(existing));
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        Product update = Product.builder().name("New name").price(99).build();
        productController.updateProduct("p1", update);

        ArgumentCaptor<Product> captor = ArgumentCaptor.forClass(Product.class);
        verify(productRepository).save(captor.capture());
        assertThat(captor.getValue().getId()).isEqualTo("p1");
        assertThat(captor.getValue().getCreatedAt()).isEqualTo(existing.getCreatedAt());
        assertThat(captor.getValue().getName()).isEqualTo("New name");
    }
}
