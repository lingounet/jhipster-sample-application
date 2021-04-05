package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Business.
 */
@Entity
@Table(name = "business")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Business implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "business")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "roles", "business" }, allowSetters = true)
    private Set<Person> people = new HashSet<>();

    @OneToMany(mappedBy = "business")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "licences", "business" }, allowSetters = true)
    private Set<Demand> demands = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "demand", "businesses" }, allowSetters = true)
    private Licence licence;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Business id(Long id) {
        this.id = id;
        return this;
    }

    public String getCode() {
        return this.code;
    }

    public Business code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return this.name;
    }

    public Business name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Person> getPeople() {
        return this.people;
    }

    public Business people(Set<Person> people) {
        this.setPeople(people);
        return this;
    }

    public Business addPerson(Person person) {
        this.people.add(person);
        person.setBusiness(this);
        return this;
    }

    public Business removePerson(Person person) {
        this.people.remove(person);
        person.setBusiness(null);
        return this;
    }

    public void setPeople(Set<Person> people) {
        if (this.people != null) {
            this.people.forEach(i -> i.setBusiness(null));
        }
        if (people != null) {
            people.forEach(i -> i.setBusiness(this));
        }
        this.people = people;
    }

    public Set<Demand> getDemands() {
        return this.demands;
    }

    public Business demands(Set<Demand> demands) {
        this.setDemands(demands);
        return this;
    }

    public Business addDemand(Demand demand) {
        this.demands.add(demand);
        demand.setBusiness(this);
        return this;
    }

    public Business removeDemand(Demand demand) {
        this.demands.remove(demand);
        demand.setBusiness(null);
        return this;
    }

    public void setDemands(Set<Demand> demands) {
        if (this.demands != null) {
            this.demands.forEach(i -> i.setBusiness(null));
        }
        if (demands != null) {
            demands.forEach(i -> i.setBusiness(this));
        }
        this.demands = demands;
    }

    public Licence getLicence() {
        return this.licence;
    }

    public Business licence(Licence licence) {
        this.setLicence(licence);
        return this;
    }

    public void setLicence(Licence licence) {
        this.licence = licence;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Business)) {
            return false;
        }
        return id != null && id.equals(((Business) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Business{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", name='" + getName() + "'" +
            "}";
    }
}
