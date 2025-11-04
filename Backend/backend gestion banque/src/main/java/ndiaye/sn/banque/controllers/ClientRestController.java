package ndiaye.sn.banque.controllers;

import ndiaye.sn.banque.DTO.ClientDTO;
import ndiaye.sn.banque.models.Client;
import ndiaye.sn.banque.services.implement.ClientServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/v1")
public class ClientRestController {

    @Autowired
    private ClientServices clientServices;

    @PostMapping("/clients")
    void createClient(@RequestBody ClientDTO clientDTO){
        this.clientServices.createNewClient(clientDTO);
    }

    @GetMapping("/clients")
    List<Client> findAll(){
        return this.clientServices.findAll();
    }
    @GetMapping("/clients/{id}")
    Client fingOne(@PathVariable("id") long id){
        return  this.clientServices.findClientById(id);
    }
}
