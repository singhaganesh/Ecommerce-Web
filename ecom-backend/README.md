# 🛒 E-Commerce Spring Boot Backend

This is a backend application for an E-Commerce platform built with **Spring Boot**. It supports three user roles: **User**, **Seller**, and **Admin**. Users can browse products by category, place orders, manage addresses, and make payments. Sellers can manage their products, and Admins oversee the entire platform.

---

## 🚀 Features

### 👤 User Roles

#### User
- Browse products by category
- View product details
- Add products to cart
- Place orders to an address
- Make payments
- View order history

#### Seller
- Add, update, and delete products
- View their product listings
- View orders for their products

#### Admin
- Manage all users and sellers
- Approve or block sellers
- Manage all products and categories
- Monitor orders and transactions

---

## 🧱 Tech Stack

- **Backend**: Spring Boot, Spring Data JPA, Spring Security
- **Database**: MySQL / PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Build Tool**: Maven / Gradle

---

## 📦 API Modules

### 🗂️ Category
- Create, update, delete categories (Admin)
- List categories (All users)

### 📦 Product
- CRUD operations (Seller)
- List/search/filter products (All users)

### 🛒 Order
- Place order (User)
- Assign delivery address
- View order history (User)
- View orders for their products (Seller)
- Track order status (All roles)

### 💰 Payment
- Integrate with payment gateway (mock or real)
- Track payment status per order

### 📍 Address
- Add/manage user addresses
- Select address during checkout

---

## 🔐 Authentication

- Login/Signup using email & password
- JWT Token-based Authentication
- Role-based access control (User, Seller, Admin)

---

## 🛠️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ecommerce-backend.git
   cd ecommerce-backend
