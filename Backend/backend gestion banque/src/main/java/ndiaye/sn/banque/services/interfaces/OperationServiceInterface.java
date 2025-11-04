package ndiaye.sn.banque.services.interfaces;

import ndiaye.sn.banque.DTO.OperationDTO;
import ndiaye.sn.banque.models.BankAccount;
import ndiaye.sn.banque.models.Operation;

import java.util.List;

public interface OperationServiceInterface {

    boolean makeADeposit(OperationDTO operationDTO);

    boolean makeATransfertBool(OperationDTO operationDTO);

    boolean makeAWithdrawal(OperationDTO operationDTO);

    List<Operation> findOperationsByAccountNumber (String accountNumber);

    List<Operation> findAllOperations();

}
