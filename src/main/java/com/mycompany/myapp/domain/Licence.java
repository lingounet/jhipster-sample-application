package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Licence.
 */
@Entity
@Table(name = "licence")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Licence implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Column(name = "price")
    private Double price;

    @Column(name = "reference")
    private String reference;

    @ManyToOne
    @JsonIgnoreProperties(value = { "licences", "business" }, allowSetters = true)
    private Demand demand;

    @OneToMany(mappedBy = "licence")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "people", "demands", "licence" }, allowSetters = true)
    private Set<Business> businesses = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Licence id(String id) {
        this.id = id;
        return this;
    }

    public Double getPrice() {
        return this.price;
    }

    public Licence price(Double price) {
        this.price = price;
        return this;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getReference() {
        return this.reference;
    }

    public Licence reference(String reference) {
        this.reference = reference;
        return this;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public Demand getDemand() {
        return this.demand;
    }

    public Licence demand(Demand demand) {
        this.setDemand(demand);
        return this;
    }

    public void setDemand(Demand demand) {
        this.demand = demand;
    }

    public Set<Business> getBusinesses() {
        return this.businesses;
    }

    public Licence businesses(Set<Business> businesses) {
        this.setBusinesses(businesses);
        return this;
    }

    public Licence addBusiness(Business business) {
        this.businesses.add(business);
        business.setLicence(this);
        return this;
    }

    public Licence removeBusiness(Business business) {
        this.businesses.remove(business);
        business.setLicence(null);
        return this;
    }

    public void setBusinesses(Set<Business> businesses) {
        if (this.businesses != null) {
            this.businesses.forEach(i -> i.setLicence(null));
        }
        if (businesses != null) {
            businesses.forEach(i -> i.setLicence(this));
        }
        this.businesses = businesses;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Licence)) {
            return false;
        }
        return id != null && id.equals(((Licence) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Licence{" +
            "id=" + getId() +
            ", price=" + getPrice() +
            ", reference='" + getReference() + "'" +
            "}";
    }
}
