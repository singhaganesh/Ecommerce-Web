package com.ecommerce.project.service;

import com.ecommerce.project.payload.OrderDTO;
import com.ecommerce.project.payload.OrderRequestDTO;
import jakarta.transaction.Transactional;

import java.util.List;

public interface OrderService {
    @Transactional
    OrderDTO placeOrder(String emailId, Long addressId, String paymentMethod, String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage);
    
    List<OrderDTO> getOrdersBySellerId(Long sellerId);
    
    OrderDTO getOrderById(Long orderId);
    
    OrderDTO updateOrderStatus(Long orderId, String status);
}
