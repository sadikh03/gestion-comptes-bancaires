package ndiaye.sn.banque.repository;

import ndiaye.sn.banque.models.Operation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OperationRepository extends JpaRepository<Operation,Long> {

    //findBy+Nom attribut de jointure + nom de la colonne pour la recuperation
    List<Operation> findByAccount_AccountNumber(String accountNumber);
}
