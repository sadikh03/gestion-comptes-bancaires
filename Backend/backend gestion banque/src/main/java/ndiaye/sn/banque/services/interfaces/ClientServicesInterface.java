package ndiaye.sn.banque.services.interfaces;

import ndiaye.sn.banque.DTO.ClientDTO;
import ndiaye.sn.banque.models.Client;

import java.util.List;

public interface ClientServicesInterface {

    void createNewClient(ClientDTO clientDTO) ;

    List<Client> findAll();

    Client findClientById(long id) ;
}
