package com.ecommerce.project.service;

import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.AddressDTO;

import java.util.List;

public interface AddressService {
    AddressDTO createAddress(AddressDTO addressDTO, User user);

    List<AddressDTO> getAllAddress();

    AddressDTO getAddressById(Long addressId);

    List<AddressDTO> getUSerAddresses(User user);

    AddressDTO updateAddress(Long addressId, AddressDTO addressDTO);

    String deleteAddress(Long addressId);
}
