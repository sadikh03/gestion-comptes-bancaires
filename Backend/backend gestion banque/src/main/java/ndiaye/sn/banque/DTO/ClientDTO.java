package ndiaye.sn.banque.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClientDTO {

    private String lastName ;
    private String firstName ;
    private Date birthday ;
    private String phoneNumbers ;
    private String email ;
    private String address;
}
