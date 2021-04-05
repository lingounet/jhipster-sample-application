package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DemandTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Demand.class);
        Demand demand1 = new Demand();
        demand1.setId(1L);
        Demand demand2 = new Demand();
        demand2.setId(demand1.getId());
        assertThat(demand1).isEqualTo(demand2);
        demand2.setId(2L);
        assertThat(demand1).isNotEqualTo(demand2);
        demand1.setId(null);
        assertThat(demand1).isNotEqualTo(demand2);
    }
}
