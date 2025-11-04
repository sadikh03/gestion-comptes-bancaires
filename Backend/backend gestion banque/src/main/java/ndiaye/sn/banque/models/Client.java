package ndiaye.sn.banque.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id ;
    private String lastName ;
    private String firstName ;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date birthday ;
    private String phoneNumbers ;
    private String email ;
    private String address;
    @JsonBackReference
    @OneToMany(mappedBy = "client" , fetch = FetchType.LAZY)
    private Collection<BankAccount> accounts = new ArrayList<>();
}
