package ndiaye.sn.banque.services.interfaces;

import ndiaye.sn.banque.DTO.BankAccountDTO;
import ndiaye.sn.banque.models.BankAccount;
import ndiaye.sn.banque.models.CurrentAccount;
import ndiaye.sn.banque.models.SavingsAccount;

import java.util.List;

public interface BankAccountServiceInterface {

    void createNewBankAccount(BankAccountDTO bankAccountDTO);

    List<BankAccount> findAllBankAccounts();

    BankAccount findBankAccountByAccountNumber(String accountNumber);

    boolean statusAction(String accountNumber);

    List<BankAccount> getAccountsByClientId(long id);
}
