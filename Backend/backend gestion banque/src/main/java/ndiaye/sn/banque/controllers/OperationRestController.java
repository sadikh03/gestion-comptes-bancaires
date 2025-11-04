package ndiaye.sn.banque.controllers;

import ndiaye.sn.banque.DTO.OperationDTO;
import ndiaye.sn.banque.models.Operation;
import ndiaye.sn.banque.services.implement.OperationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/v1/operations")
public class OperationRestController {

    @Autowired
    OperationService operationService ;

    @PostMapping("/depot")
    boolean makeAdeposit(@RequestBody OperationDTO operationDTO){
        return this.operationService.makeADeposit(operationDTO);
    }

    @PostMapping("/retrait")
    boolean makeAWithdrawal(@RequestBody OperationDTO operationDTO){
        return this.operationService.makeAWithdrawal(operationDTO);
    }

    @PostMapping("/virement")
    boolean transfert(@RequestBody OperationDTO operationDTO){
        return this.operationService.makeATransfertBool(operationDTO);
    }

    @GetMapping("/client/{numCompte}")
    List<Operation> findAllOperationByClient(@PathVariable("numCompte") String  accountNumber) {
        return this.operationService.findOperationsByAccountNumber(accountNumber);
    }

    @GetMapping("")
    List<Operation> getAllOperations() {
        return this.operationService.findAllOperations();
    }
}
