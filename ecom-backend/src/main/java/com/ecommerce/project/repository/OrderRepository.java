package com.ecommerce.project.repository;

import com.ecommerce.project.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {
    
    @Query("SELECT DISTINCT o FROM Order o " +
           "JOIN OrderItem oi ON oi.order = o " +
           "JOIN Product p ON oi.product = p " +
           "WHERE p.user.id = :sellerId " +
           "ORDER BY o.orderId DESC")
    List<Order> findOrdersBySellerId(@Param("sellerId") Long sellerId);
    
    @Query("SELECT DISTINCT o FROM Order o " +
           "JOIN OrderItem oi ON oi.order = o " +
           "JOIN Product p ON oi.product = p " +
           "WHERE p.user.id = :sellerId " +
           "AND o.orderStatus = :status " +
           "ORDER BY o.orderId DESC")
    List<Order> findOrdersBySellerIdAndStatus(@Param("sellerId") Long sellerId, @Param("status") String status);
}
