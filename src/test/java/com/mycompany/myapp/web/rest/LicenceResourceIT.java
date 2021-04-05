package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Licence;
import com.mycompany.myapp.repository.LicenceRepository;
import java.util.List;
import java.util.UUID;
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
 * Integration tests for the {@link LicenceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LicenceResourceIT {

    private static final Double DEFAULT_PRICE = 1D;
    private static final Double UPDATED_PRICE = 2D;

    private static final String DEFAULT_REFERENCE = "AAAAAAAAAA";
    private static final String UPDATED_REFERENCE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/licences";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private LicenceRepository licenceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLicenceMockMvc;

    private Licence licence;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Licence createEntity(EntityManager em) {
        Licence licence = new Licence().price(DEFAULT_PRICE).reference(DEFAULT_REFERENCE);
        return licence;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Licence createUpdatedEntity(EntityManager em) {
        Licence licence = new Licence().price(UPDATED_PRICE).reference(UPDATED_REFERENCE);
        return licence;
    }

    @BeforeEach
    public void initTest() {
        licence = createEntity(em);
    }

    @Test
    @Transactional
    void createLicence() throws Exception {
        int databaseSizeBeforeCreate = licenceRepository.findAll().size();
        // Create the Licence
        restLicenceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(licence)))
            .andExpect(status().isCreated());

        // Validate the Licence in the database
        List<Licence> licenceList = licenceRepository.findAll();
        assertThat(licenceList).hasSize(databaseSizeBeforeCreate + 1);
        Licence testLicence = licenceList.get(licenceList.size() - 1);
        assertThat(testLicence.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testLicence.getReference()).isEqualTo(DEFAULT_REFERENCE);
    }

    @Test
    @Transactional
    void createLicenceWithExistingId() throws Exception {
        // Create the Licence with an existing ID
        licence.setId("existing_id");

        int databaseSizeBeforeCreate = licenceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLicenceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(licence)))
            .andExpect(status().isBadRequest());

        // Validate the Licence in the database
        List<Licence> licenceList = licenceRepository.findAll();
        assertThat(licenceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLicences() throws Exception {
        // Initialize the database
        licenceRepository.saveAndFlush(licence);

        // Get all the licenceList
        restLicenceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(licence.getId())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].reference").value(hasItem(DEFAULT_REFERENCE)));
    }

    @Test
    @Transactional
    void getLicence() throws Exception {
        // Initialize the database
        licenceRepository.saveAndFlush(licence);

        // Get the licence
        restLicenceMockMvc
            .perform(get(ENTITY_API_URL_ID, licence.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(licence.getId()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.reference").value(DEFAULT_REFERENCE));
    }

    @Test
    @Transactional
    void getNonExistingLicence() throws Exception {
        // Get the licence
        restLicenceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLicence() throws Exception {
        // Initialize the database
        licenceRepository.saveAndFlush(licence);

        int databaseSizeBeforeUpdate = licenceRepository.findAll().size();

        // Update the licence
        Licence updatedLicence = licenceRepository.findById(licence.getId()).get();
        // Disconnect from session so that the updates on updatedLicence are not directly saved in db
        em.detach(updatedLicence);
        updatedLicence.price(UPDATED_PRICE).reference(UPDATED_REFERENCE);

        restLicenceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLicence.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLicence))
            )
            .andExpect(status().isOk());

        // Validate the Licence in the database
        List<Licence> licenceList = licenceRepository.findAll();
        assertThat(licenceList).hasSize(databaseSizeBeforeUpdate);
        Licence testLicence = licenceList.get(licenceList.size() - 1);
        assertThat(testLicence.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testLicence.getReference()).isEqualTo(UPDATED_REFERENCE);
    }

    @Test
    @Transactional
    void putNonExistingLicence() throws Exception {
        int databaseSizeBeforeUpdate = licenceRepository.findAll().size();
        licence.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLicenceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, licence.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(licence))
            )
            .andExpect(status().isBadRequest());

        // Validate the Licence in the database
        List<Licence> licenceList = licenceRepository.findAll();
        assertThat(licenceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLicence() throws Exception {
        int databaseSizeBeforeUpdate = licenceRepository.findAll().size();
        licence.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLicenceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(licence))
            )
            .andExpect(status().isBadRequest());

        // Validate the Licence in the database
        List<Licence> licenceList = licenceRepository.findAll();
        assertThat(licenceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLicence() throws Exception {
        int databaseSizeBeforeUpdate = licenceRepository.findAll().size();
        licence.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLicenceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(licence)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Licence in the database
        List<Licence> licenceList = licenceRepository.findAll();
        assertThat(licenceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLicenceWithPatch() throws Exception {
        // Initialize the database
        licenceRepository.saveAndFlush(licence);

        int databaseSizeBeforeUpdate = licenceRepository.findAll().size();

        // Update the licence using partial update
        Licence partialUpdatedLicence = new Licence();
        partialUpdatedLicence.setId(licence.getId());

        restLicenceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLicence.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLicence))
            )
            .andExpect(status().isOk());

        // Validate the Licence in the database
        List<Licence> licenceList = licenceRepository.findAll();
        assertThat(licenceList).hasSize(databaseSizeBeforeUpdate);
        Licence testLicence = licenceList.get(licenceList.size() - 1);
        assertThat(testLicence.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testLicence.getReference()).isEqualTo(DEFAULT_REFERENCE);
    }

    @Test
    @Transactional
    void fullUpdateLicenceWithPatch() throws Exception {
        // Initialize the database
        licenceRepository.saveAndFlush(licence);

        int databaseSizeBeforeUpdate = licenceRepository.findAll().size();

        // Update the licence using partial update
        Licence partialUpdatedLicence = new Licence();
        partialUpdatedLicence.setId(licence.getId());

        partialUpdatedLicence.price(UPDATED_PRICE).reference(UPDATED_REFERENCE);

        restLicenceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLicence.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLicence))
            )
            .andExpect(status().isOk());

        // Validate the Licence in the database
        List<Licence> licenceList = licenceRepository.findAll();
        assertThat(licenceList).hasSize(databaseSizeBeforeUpdate);
        Licence testLicence = licenceList.get(licenceList.size() - 1);
        assertThat(testLicence.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testLicence.getReference()).isEqualTo(UPDATED_REFERENCE);
    }

    @Test
    @Transactional
    void patchNonExistingLicence() throws Exception {
        int databaseSizeBeforeUpdate = licenceRepository.findAll().size();
        licence.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLicenceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, licence.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(licence))
            )
            .andExpect(status().isBadRequest());

        // Validate the Licence in the database
        List<Licence> licenceList = licenceRepository.findAll();
        assertThat(licenceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLicence() throws Exception {
        int databaseSizeBeforeUpdate = licenceRepository.findAll().size();
        licence.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLicenceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(licence))
            )
            .andExpect(status().isBadRequest());

        // Validate the Licence in the database
        List<Licence> licenceList = licenceRepository.findAll();
        assertThat(licenceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLicence() throws Exception {
        int databaseSizeBeforeUpdate = licenceRepository.findAll().size();
        licence.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLicenceMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(licence)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Licence in the database
        List<Licence> licenceList = licenceRepository.findAll();
        assertThat(licenceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLicence() throws Exception {
        // Initialize the database
        licenceRepository.saveAndFlush(licence);

        int databaseSizeBeforeDelete = licenceRepository.findAll().size();

        // Delete the licence
        restLicenceMockMvc
            .perform(delete(ENTITY_API_URL_ID, licence.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Licence> licenceList = licenceRepository.findAll();
        assertThat(licenceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
