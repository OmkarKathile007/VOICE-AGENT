package com.krishishetra.security;

import com.krishishetra.model.User;
import com.krishishetra.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link UserDetailsServiceImpl} with a mocked repository.
 */
@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @Test
    void loadUserByUsernameMapsUserToSpringUserWithRoleAuthority() {
        User user = User.builder()
                .id("1")
                .email("seller@krishi.in")
                .password("hashed-pw")
                .role("FPO")
                .build();
        when(userRepository.findByEmail("seller@krishi.in")).thenReturn(Optional.of(user));

        UserDetails details = userDetailsService.loadUserByUsername("seller@krishi.in");

        assertThat(details.getUsername()).isEqualTo("seller@krishi.in");
        assertThat(details.getPassword()).isEqualTo("hashed-pw");
        assertThat(details.getAuthorities())
                .extracting(GrantedAuthority::getAuthority)
                .containsExactly("ROLE_FPO");
    }

    @Test
    void loadUserByUsernameThrowsWhenUserMissing() {
        when(userRepository.findByEmail("ghost@krishi.in")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userDetailsService.loadUserByUsername("ghost@krishi.in"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("ghost@krishi.in");
    }
}
