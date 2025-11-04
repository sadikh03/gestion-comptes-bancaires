package ndiaye.sn.banque.services.implement;

import jakarta.persistence.EntityNotFoundException;
import ndiaye.sn.banque.DTO.ClientDTO;
import ndiaye.sn.banque.models.Client;
import ndiaye.sn.banque.repository.ClientRepository;
import ndiaye.sn.banque.services.interfaces.ClientServicesInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientServices implements ClientServicesInterface {

    @Autowired
    ClientRepository clientRepository ;


    @Override
    public void createNewClient(ClientDTO clientDTO) {
        Client client = new Client();
        try{
            client.setLastName(clientDTO.getLastName());
            client.setFirstName(clientDTO.getFirstName());
            client.setEmail(clientDTO.getEmail());
            client.setBirthday(clientDTO.getBirthday());
            client.setPhoneNumbers(clientDTO.getPhoneNumbers());
            client.setAddress(clientDTO.getAddress());

            this.clientRepository.save(client);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Client> findAll() {
        try{
            return  this.clientRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Client findClientById(long id) {
        try{
            return  this.clientRepository.getReferenceById(id);
        } catch (EntityNotFoundException e) {
            throw new RuntimeException("Entite introuvable");
        }
    }
}
