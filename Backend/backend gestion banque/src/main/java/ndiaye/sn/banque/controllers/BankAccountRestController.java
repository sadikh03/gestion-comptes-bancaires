package ndiaye.sn.banque.controllers;

import ndiaye.sn.banque.DTO.BankAccountDTO;
import ndiaye.sn.banque.models.BankAccount;
import ndiaye.sn.banque.models.CurrentAccount;
import ndiaye.sn.banque.models.SavingsAccount;
import ndiaye.sn.banque.services.implement.BankAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/v1")
public class BankAccountRestController {

    @Autowired
    private BankAccountService bankAccountService ;

    @PostMapping("/comptes")
    void createAccount(@RequestBody BankAccountDTO accountDTO){
        this.bankAccountService.createNewBankAccount(accountDTO);
    }

    @GetMapping("/comptes")
    List<BankAccount> findAll(){
        return this.bankAccountService.findAllBankAccounts();
    }

    @GetMapping("/comptes/{id}")
    List<BankAccount> findAllClientAccount(@PathVariable("id") long id){
        return this.bankAccountService.getAccountsByClientId(id);
    }

    @GetMapping("/comptes/{numCompte}/{type}")
    ResponseEntity<?> findOne(
            @PathVariable("numCompte") String accountNumber ,
            @PathVariable("type") String type){
        BankAccount bankAccount = this.bankAccountService.findBankAccountByAccountNumber(accountNumber);
        if(type.equals("CC") && bankAccount instanceof CurrentAccount)
            return ResponseEntity.ok((CurrentAccount) bankAccount);
        if(type.equals("CE") && bankAccount instanceof SavingsAccount)
            return ResponseEntity.ok((SavingsAccount) bankAccount);
        return null ;
    }

    @GetMapping("/comptes/status/{accountNumber}")
    public boolean statusAction(@PathVariable String accountNumber) {
        return this.bankAccountService.statusAction(accountNumber);
    }
}
