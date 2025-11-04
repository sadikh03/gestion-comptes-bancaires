package ndiaye.sn.banque.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
//discriminent de 1
@DiscriminatorValue("1")
//on genere les methode equals et hashcode tenant compte des attributs de la super class
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public class CurrentAccount extends BankAccount {
	
	private double  overdraft ; //decouvert
}
