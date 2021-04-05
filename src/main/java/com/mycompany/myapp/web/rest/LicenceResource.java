package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Licence;
import com.mycompany.myapp.repository.LicenceRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Licence}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LicenceResource {

    private final Logger log = LoggerFactory.getLogger(LicenceResource.class);

    private static final String ENTITY_NAME = "licence";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LicenceRepository licenceRepository;

    public LicenceResource(LicenceRepository licenceRepository) {
        this.licenceRepository = licenceRepository;
    }

    /**
     * {@code POST  /licences} : Create a new licence.
     *
     * @param licence the licence to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new licence, or with status {@code 400 (Bad Request)} if the licence has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/licences")
    public ResponseEntity<Licence> createLicence(@RequestBody Licence licence) throws URISyntaxException {
        log.debug("REST request to save Licence : {}", licence);
        if (licence.getId() != null) {
            throw new BadRequestAlertException("A new licence cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Licence result = licenceRepository.save(licence);
        return ResponseEntity
            .created(new URI("/api/licences/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /licences/:id} : Updates an existing licence.
     *
     * @param id the id of the licence to save.
     * @param licence the licence to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated licence,
     * or with status {@code 400 (Bad Request)} if the licence is not valid,
     * or with status {@code 500 (Internal Server Error)} if the licence couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/licences/{id}")
    public ResponseEntity<Licence> updateLicence(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Licence licence
    ) throws URISyntaxException {
        log.debug("REST request to update Licence : {}, {}", id, licence);
        if (licence.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, licence.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!licenceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Licence result = licenceRepository.save(licence);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, licence.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /licences/:id} : Partial updates given fields of an existing licence, field will ignore if it is null
     *
     * @param id the id of the licence to save.
     * @param licence the licence to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated licence,
     * or with status {@code 400 (Bad Request)} if the licence is not valid,
     * or with status {@code 404 (Not Found)} if the licence is not found,
     * or with status {@code 500 (Internal Server Error)} if the licence couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/licences/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Licence> partialUpdateLicence(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Licence licence
    ) throws URISyntaxException {
        log.debug("REST request to partial update Licence partially : {}, {}", id, licence);
        if (licence.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, licence.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!licenceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Licence> result = licenceRepository
            .findById(licence.getId())
            .map(
                existingLicence -> {
                    if (licence.getPrice() != null) {
                        existingLicence.setPrice(licence.getPrice());
                    }
                    if (licence.getReference() != null) {
                        existingLicence.setReference(licence.getReference());
                    }

                    return existingLicence;
                }
            )
            .map(licenceRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, licence.getId()));
    }

    /**
     * {@code GET  /licences} : get all the licences.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of licences in body.
     */
    @GetMapping("/licences")
    public List<Licence> getAllLicences() {
        log.debug("REST request to get all Licences");
        return licenceRepository.findAll();
    }

    /**
     * {@code GET  /licences/:id} : get the "id" licence.
     *
     * @param id the id of the licence to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the licence, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/licences/{id}")
    public ResponseEntity<Licence> getLicence(@PathVariable String id) {
        log.debug("REST request to get Licence : {}", id);
        Optional<Licence> licence = licenceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(licence);
    }

    /**
     * {@code DELETE  /licences/:id} : delete the "id" licence.
     *
     * @param id the id of the licence to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/licences/{id}")
    public ResponseEntity<Void> deleteLicence(@PathVariable String id) {
        log.debug("REST request to delete Licence : {}", id);
        licenceRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
