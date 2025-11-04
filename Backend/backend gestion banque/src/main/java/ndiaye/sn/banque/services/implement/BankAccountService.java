package ndiaye.sn.banque.services.implement;

import ndiaye.sn.banque.DTO.BankAccountDTO;
import ndiaye.sn.banque.enums.AccountStatus;
import ndiaye.sn.banque.enums.AccountType;
import ndiaye.sn.banque.models.BankAccount;
import ndiaye.sn.banque.models.Client;
import ndiaye.sn.banque.models.CurrentAccount;
import ndiaye.sn.banque.models.SavingsAccount;
import ndiaye.sn.banque.repository.BankAccountRepository;
import ndiaye.sn.banque.repository.ClientRepository;
import ndiaye.sn.banque.services.interfaces.BankAccountServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BankAccountService implements BankAccountServiceInterface {

    @Autowired
    BankAccountRepository bankAccountRepository ;
    @Autowired
    ClientRepository clientRepository ;


    @Override
    public void createNewBankAccount(BankAccountDTO bankAccountDTO) {
        Optional<Client> client = this.clientRepository.findById(bankAccountDTO.getClientId());
        if(client.isPresent() && (bankAccountDTO.getOverdraft() > 0 && bankAccountDTO.getInterestRate() == 0)){
            CurrentAccount currentAccount = new CurrentAccount();
            currentAccount.setCreateAt(new Date());
            currentAccount.setBalance(bankAccountDTO.getBalance());
            currentAccount.setOverdraft(bankAccountDTO.getOverdraft());
            currentAccount.setClient(client.get());
            currentAccount.setCurrency(bankAccountDTO.getCurrency());
            currentAccount.setStatus(AccountStatus.ACTIVED);
            currentAccount.setAccountNumber(this.generateAccountNumber(client.get().getId(),AccountType.CURRENT));

            this.bankAccountRepository.save(currentAccount);
        }

        if(client.isPresent() && (bankAccountDTO.getOverdraft() == 0 && bankAccountDTO.getInterestRate() > 0)){
            SavingsAccount savingsAccount = new SavingsAccount();
            savingsAccount.setCreateAt(new Date());
            savingsAccount.setBalance(bankAccountDTO.getBalance());
            savingsAccount.setInterestRate(bankAccountDTO.getInterestRate());
            savingsAccount.setClient(client.get());
            savingsAccount.setCurrency(bankAccountDTO.getCurrency());
            savingsAccount.setStatus(AccountStatus.ACTIVED);
            savingsAccount.setAccountNumber(generateAccountNumber(client.get().getId(),AccountType.SAVINGS));

            this.bankAccountRepository.save(savingsAccount);
        }
    }

    @Override
    public List<BankAccount> findAllBankAccounts() {
        return this.bankAccountRepository.findAll();
    }

    @Override
    public BankAccount findBankAccountByAccountNumber(String accountNumber) {
        Optional<BankAccount> account = this.bankAccountRepository.findByAccountNumber(accountNumber);
        if(account.isPresent()){
            return account.get();
        }else {
            throw new RuntimeException("Compte introuvable");
        }
    }

    @Override
    public boolean statusAction(String accountNumber) {
        Optional<BankAccount> accountOptional = this.bankAccountRepository.findByAccountNumber(accountNumber);
        if(accountOptional.isPresent()) {
            BankAccount account = accountOptional.get();
            account.setStatus(account.getStatus() == AccountStatus.ACTIVED ? AccountStatus.SUSPENDED : AccountStatus.ACTIVED);
            this.bankAccountRepository.save(account);
            return true ;
        }
        return false;
    }

    @Override
    public List<BankAccount> getAccountsByClientId(long id) {
        return this.bankAccountRepository.findByClientId(id);
    }

    private String generateAccountNumber(Long clientId, AccountType accountType) {
        String clientPart = String.format("CLI-%04d", clientId);
        String accountNumber;
        Random random = new Random();

        // Boucle jusqu'à trouver un numéro unique
        do {
            int randomNumber = random.nextInt(10000); // 0 à 9999
            String accountPart = String.format("ACC-%04d", randomNumber);
            accountNumber = clientPart + "-" + accountPart + accountType;
        } while (bankAccountRepository.existsByAccountNumber(accountNumber));

        return accountNumber;
    }

}
