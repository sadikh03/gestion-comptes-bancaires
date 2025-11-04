package ndiaye.sn.banque.repository;

import ndiaye.sn.banque.models.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount,Long> {
    Optional<BankAccount> findByAccountNumber(String accountNumber);

    List<BankAccount> findByClientId(long id);

    boolean existsByAccountNumber(String accountNumber);
}
