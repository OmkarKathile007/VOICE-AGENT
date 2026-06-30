package com.krishishetra;

import org.junit.jupiter.api.Test;

/**
 * Smoke test: verifies the full application context starts against the embedded
 * MongoDB. If this fails, the integration-test infrastructure itself is broken.
 */
class KrishiShetraApplicationTests extends AbstractIntegrationTest {

    @Test
    void contextLoads() {
        // Context startup (incl. embedded Mongo + security) is the assertion.
    }
}
