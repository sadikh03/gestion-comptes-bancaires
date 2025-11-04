package ndiaye.sn.banque.DTO;

import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ndiaye.sn.banque.enums.AccountStatus;
import ndiaye.sn.banque.models.Client;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BankAccountDTO {
    private String currency = "CFA" ; //devise
    private double interestRate ;
    private double balance ;
    private double overdraft ;
    private long clientId ;
}
