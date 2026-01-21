package com.ecommerce.project.controller;

import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.AddressDTO;
import com.ecommerce.project.service.AddressService;
import com.ecommerce.project.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AddressController {
    private final AddressService addressService;
    private final AuthUtil authUtil;

    public AddressController(AddressService addressService, AuthUtil authUtil) {
        this.addressService = addressService;
        this.authUtil = authUtil;
    }

    @PostMapping("/addresses")
    public ResponseEntity<AddressDTO> createAddress(@Valid @RequestBody AddressDTO addressDTO){
        User user = authUtil.loggedInUser();
        AddressDTO savedAddressDTO = addressService.createAddress(addressDTO,user);
        return new ResponseEntity<>(savedAddressDTO, HttpStatus.CREATED);
    }
    @GetMapping("/addresses")
    public ResponseEntity<List<AddressDTO>> getAllAddresses(){
        List<AddressDTO> addressList = addressService.getAllAddress();

        return new ResponseEntity<>(addressList,HttpStatus.OK);
    }
    @GetMapping("/addresses/{address_id}")
    public ResponseEntity<AddressDTO> getAddressById(@PathVariable Long address_id){
        AddressDTO addressDTO = addressService.getAddressById(address_id);

        return new ResponseEntity<>(addressDTO,HttpStatus.OK);
    }

    @GetMapping("/users/addresses")
    public ResponseEntity<List<AddressDTO>> getUserAddresses(){
        User user = authUtil.loggedInUser();
        List<AddressDTO> addressList = addressService.getUSerAddresses(user);

        return new ResponseEntity<>(addressList,HttpStatus.OK);
    }
    @PutMapping("/addresses/{address_id}")
    public ResponseEntity<AddressDTO> updateAddressById(@PathVariable Long address_id,
                                                        @RequestBody AddressDTO addressDTO){
        AddressDTO updatedAddressDTO = addressService.updateAddress(address_id,addressDTO);
        return new ResponseEntity<>(updatedAddressDTO,HttpStatus.OK);

    }
    @DeleteMapping("/addresses/{address_id}")
    public ResponseEntity<String> deleteAddress(@PathVariable Long address_id){
        String status = addressService.deleteAddress(address_id);
        return new ResponseEntity<>(status,HttpStatus.OK);
    }

}
