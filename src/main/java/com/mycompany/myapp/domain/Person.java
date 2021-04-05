package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Person.
 */
@Entity
@Table(name = "person")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Person implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sgid")
    private String sgid;

    @OneToMany(mappedBy = "person")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "person" }, allowSetters = true)
    private Set<Role> roles = new HashSet<>();

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

    public Person id(Long id) {
        this.id = id;
        return this;
    }

    public String getSgid() {
        return this.sgid;
    }

    public Person sgid(String sgid) {
        this.sgid = sgid;
        return this;
    }

    public void setSgid(String sgid) {
        this.sgid = sgid;
    }

    public Set<Role> getRoles() {
        return this.roles;
    }

    public Person roles(Set<Role> roles) {
        this.setRoles(roles);
        return this;
    }

    public Person addRole(Role role) {
        this.roles.add(role);
        role.setPerson(this);
        return this;
    }

    public Person removeRole(Role role) {
        this.roles.remove(role);
        role.setPerson(null);
        return this;
    }

    public void setRoles(Set<Role> roles) {
        if (this.roles != null) {
            this.roles.forEach(i -> i.setPerson(null));
        }
        if (roles != null) {
            roles.forEach(i -> i.setPerson(this));
        }
        this.roles = roles;
    }

    public Business getBusiness() {
        return this.business;
    }

    public Person business(Business business) {
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
        if (!(o instanceof Person)) {
            return false;
        }
        return id != null && id.equals(((Person) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Person{" +
            "id=" + getId() +
            ", sgid='" + getSgid() + "'" +
            "}";
    }
}
