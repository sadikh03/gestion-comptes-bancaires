package ndiaye.sn.banque.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OperationDTO {

    private double amount ;
    private String sourceAccountNumber ;
    private String destinationAccountNumber ;
}
