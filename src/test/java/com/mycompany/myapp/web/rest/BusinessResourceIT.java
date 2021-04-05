package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Business;
import com.mycompany.myapp.repository.BusinessRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link BusinessResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BusinessResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/businesses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBusinessMockMvc;

    private Business business;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Business createEntity(EntityManager em) {
        Business business = new Business().code(DEFAULT_CODE).name(DEFAULT_NAME);
        return business;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Business createUpdatedEntity(EntityManager em) {
        Business business = new Business().code(UPDATED_CODE).name(UPDATED_NAME);
        return business;
    }

    @BeforeEach
    public void initTest() {
        business = createEntity(em);
    }

    @Test
    @Transactional
    void createBusiness() throws Exception {
        int databaseSizeBeforeCreate = businessRepository.findAll().size();
        // Create the Business
        restBusinessMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(business)))
            .andExpect(status().isCreated());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeCreate + 1);
        Business testBusiness = businessList.get(businessList.size() - 1);
        assertThat(testBusiness.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testBusiness.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createBusinessWithExistingId() throws Exception {
        // Create the Business with an existing ID
        business.setId(1L);

        int databaseSizeBeforeCreate = businessRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBusinessMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(business)))
            .andExpect(status().isBadRequest());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBusinesses() throws Exception {
        // Initialize the database
        businessRepository.saveAndFlush(business);

        // Get all the businessList
        restBusinessMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(business.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getBusiness() throws Exception {
        // Initialize the database
        businessRepository.saveAndFlush(business);

        // Get the business
        restBusinessMockMvc
            .perform(get(ENTITY_API_URL_ID, business.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(business.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingBusiness() throws Exception {
        // Get the business
        restBusinessMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBusiness() throws Exception {
        // Initialize the database
        businessRepository.saveAndFlush(business);

        int databaseSizeBeforeUpdate = businessRepository.findAll().size();

        // Update the business
        Business updatedBusiness = businessRepository.findById(business.getId()).get();
        // Disconnect from session so that the updates on updatedBusiness are not directly saved in db
        em.detach(updatedBusiness);
        updatedBusiness.code(UPDATED_CODE).name(UPDATED_NAME);

        restBusinessMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBusiness.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBusiness))
            )
            .andExpect(status().isOk());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeUpdate);
        Business testBusiness = businessList.get(businessList.size() - 1);
        assertThat(testBusiness.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testBusiness.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingBusiness() throws Exception {
        int databaseSizeBeforeUpdate = businessRepository.findAll().size();
        business.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBusinessMockMvc
            .perform(
                put(ENTITY_API_URL_ID, business.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(business))
            )
            .andExpect(status().isBadRequest());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBusiness() throws Exception {
        int databaseSizeBeforeUpdate = businessRepository.findAll().size();
        business.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(business))
            )
            .andExpect(status().isBadRequest());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBusiness() throws Exception {
        int databaseSizeBeforeUpdate = businessRepository.findAll().size();
        business.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(business)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBusinessWithPatch() throws Exception {
        // Initialize the database
        businessRepository.saveAndFlush(business);

        int databaseSizeBeforeUpdate = businessRepository.findAll().size();

        // Update the business using partial update
        Business partialUpdatedBusiness = new Business();
        partialUpdatedBusiness.setId(business.getId());

        partialUpdatedBusiness.name(UPDATED_NAME);

        restBusinessMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBusiness.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBusiness))
            )
            .andExpect(status().isOk());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeUpdate);
        Business testBusiness = businessList.get(businessList.size() - 1);
        assertThat(testBusiness.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testBusiness.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateBusinessWithPatch() throws Exception {
        // Initialize the database
        businessRepository.saveAndFlush(business);

        int databaseSizeBeforeUpdate = businessRepository.findAll().size();

        // Update the business using partial update
        Business partialUpdatedBusiness = new Business();
        partialUpdatedBusiness.setId(business.getId());

        partialUpdatedBusiness.code(UPDATED_CODE).name(UPDATED_NAME);

        restBusinessMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBusiness.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBusiness))
            )
            .andExpect(status().isOk());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeUpdate);
        Business testBusiness = businessList.get(businessList.size() - 1);
        assertThat(testBusiness.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testBusiness.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingBusiness() throws Exception {
        int databaseSizeBeforeUpdate = businessRepository.findAll().size();
        business.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBusinessMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, business.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(business))
            )
            .andExpect(status().isBadRequest());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBusiness() throws Exception {
        int databaseSizeBeforeUpdate = businessRepository.findAll().size();
        business.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(business))
            )
            .andExpect(status().isBadRequest());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBusiness() throws Exception {
        int databaseSizeBeforeUpdate = businessRepository.findAll().size();
        business.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(business)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBusiness() throws Exception {
        // Initialize the database
        businessRepository.saveAndFlush(business);

        int databaseSizeBeforeDelete = businessRepository.findAll().size();

        // Delete the business
        restBusinessMockMvc
            .perform(delete(ENTITY_API_URL_ID, business.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
