package ndiaye.sn.banque.services.implement;

import ndiaye.sn.banque.DTO.OperationDTO;
import ndiaye.sn.banque.enums.AccountStatus;
import ndiaye.sn.banque.enums.TypeOfOperation;
import ndiaye.sn.banque.models.BankAccount;
import ndiaye.sn.banque.models.Operation;
import ndiaye.sn.banque.repository.BankAccountRepository;
import ndiaye.sn.banque.repository.OperationRepository;
import ndiaye.sn.banque.services.interfaces.OperationServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class OperationService implements OperationServiceInterface {

    @Autowired
    OperationRepository operationRepository ;
    @Autowired
    BankAccountRepository bankAccountRepository ;

    @Override
        public boolean makeADeposit(OperationDTO operationDTO) {

        Optional<BankAccount> accountOptional = this.bankAccountRepository.findByAccountNumber(operationDTO.getSourceAccountNumber());
        if(accountOptional.isPresent()){
            BankAccount account = accountOptional.get();
            if(account.getStatus().equals(AccountStatus.ACTIVED)){
                account.setBalance(account.getBalance() + operationDTO.getAmount());
                Operation operation = new Operation();
                operation.setOperationDate(new Date());
                operation.setAmount(operationDTO.getAmount());
                operation.setOperationType(TypeOfOperation.CREDIT);
                operation.setAccount(account);
                operation.setOpereationNumber(generateOperationNumber());
                this.bankAccountRepository.save(account);
                this.operationRepository.save(operation);
                return true ;
            }else{
                throw new RuntimeException("Impossible de faire une operation sur un compte suspendu !");
            }
        }else{
            throw new RuntimeException("Ce compte n'existe pas !");
        }
    }

    @Override
    public boolean makeATransfertBool(OperationDTO operationDTO) {
        String sourceAccountNumber = operationDTO.getSourceAccountNumber();
        String destinationAccountNumber = operationDTO.getDestinationAccountNumber();

        // Vérification rapide que les comptes existent avant de commencer
        if (!bankAccountRepository.findByAccountNumber(sourceAccountNumber).isPresent()) {
            throw new RuntimeException("Compte source n'existe pas !");
        }
        if (!bankAccountRepository.findByAccountNumber(destinationAccountNumber).isPresent()) {
            throw new RuntimeException("Compte destination n'existe pas !");
        }

        try {
            // Utilisation de vos méthodes existantes
            makeAWithdrawal(new OperationDTO(
                    operationDTO.getAmount(), sourceAccountNumber, null
            ));

            makeADeposit(new OperationDTO(
                    operationDTO.getAmount(), destinationAccountNumber, null
            ));

            return true;

        } catch (RuntimeException e) {
            throw new RuntimeException("Erreur lors du transfert: " + e.getMessage());
        }
    }

    @Override
    public boolean makeAWithdrawal(OperationDTO operationDTO) {
        Optional<BankAccount> accountOptional = this.bankAccountRepository.findByAccountNumber(operationDTO.getSourceAccountNumber());
        if(accountOptional.isPresent()){
            BankAccount account = accountOptional.get();
            if(account.getStatus().equals(AccountStatus.ACTIVED)){
                if(account.getBalance() > operationDTO.getAmount()){
                    account.setBalance(account.getBalance() - operationDTO.getAmount());
                    Operation operation = new Operation();
                    operation.setOperationDate(new Date());
                    operation.setAmount(operationDTO.getAmount());
                    operation.setOperationType(TypeOfOperation.DEBIT);
                    operation.setAccount(account);
                    operation.setOpereationNumber(generateOperationNumber());
                    this.bankAccountRepository.save(account);
                    this.operationRepository.save(operation);
                    return true ;
                }else{
                    throw new RuntimeException("Solde insuffisant !!");
                }
            }else{
                throw new RuntimeException("Impossible de faire une operation sur un compte suspendu !");
            }
        }else{
            throw new RuntimeException("Ce compte n'existe pas !");
        }
    }
    @Override
    public List<Operation> findOperationsByAccountNumber(String accountNumber){
        return this.operationRepository.findByAccount_AccountNumber(accountNumber);
    }

    @Override
    public List<Operation> findAllOperations() {
        return this.operationRepository.findAll();
    }

    private String generateOperationNumber() {
        final Random random = new Random();
        long randomNumber = 1000000000000L + random.nextLong(9000000000000L);
        return "OP" + randomNumber;
    }
}
