package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.Status;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Demand.
 */
@Entity
@Table(name = "demand")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Demand implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "email")
    private String email;

    @Column(name = "number")
    private Integer number;

    @OneToMany(mappedBy = "demand")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "demand", "businesses" }, allowSetters = true)
    private Set<Licence> licences = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "people", "demands", "licence" }, allowSetters = true)
    private Business business;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Demand id(Long id) {
        this.id = id;
        return this;
    }

    public Status getStatus() {
        return this.status;
    }

    public Demand status(Status status) {
        this.status = status;
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getEmail() {
        return this.email;
    }

    public Demand email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getNumber() {
        return this.number;
    }

    public Demand number(Integer number) {
        this.number = number;
        return this;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public Set<Licence> getLicences() {
        return this.licences;
    }

    public Demand licences(Set<Licence> licences) {
        this.setLicences(licences);
        return this;
    }

    public Demand addLicence(Licence licence) {
        this.licences.add(licence);
        licence.setDemand(this);
        return this;
    }

    public Demand removeLicence(Licence licence) {
        this.licences.remove(licence);
        licence.setDemand(null);
        return this;
    }

    public void setLicences(Set<Licence> licences) {
        if (this.licences != null) {
            this.licences.forEach(i -> i.setDemand(null));
        }
        if (licences != null) {
            licences.forEach(i -> i.setDemand(this));
        }
        this.licences = licences;
    }

    public Business getBusiness() {
        return this.business;
    }

    public Demand business(Business business) {
        this.setBusiness(business);
        return this;
    }

    public void setBusiness(Business business) {
        this.business = business;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Demand)) {
            return false;
        }
        return id != null && id.equals(((Demand) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Demand{" +
            "id=" + getId() +
            ", status='" + getStatus() + "'" +
            ", email='" + getEmail() + "'" +
            ", number=" + getNumber() +
            "}";
    }
}
