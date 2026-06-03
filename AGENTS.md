# AGENTS.md - Development Guidelines

This file provides guidelines for AI coding agents operating in this repository.

---

## Project Overview

Full-stack e-commerce application with:
- **Frontend**: React 19 + Vite + Redux Toolkit + Tailwind CSS 4 + MUI
- **Backend**: Spring Boot 3.4.3 (Java 21) + Spring Security + JWT
- **Database**: PostgreSQL/MySQL (via Spring Data JPA)
- **Three user roles**: User, Seller, Admin

---

## 1. Build/Lint/Test Commands

### Frontend (ecom-frontend/)

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

> **Note**: No test framework is currently configured. Do not add tests unless explicitly requested.

Run lint on specific files:
```bash
npm run lint -- src/pages/user/Home.jsx
```

### Backend (ecom-backend/)

| Command | Description |
|---------|-------------|
| `./mvnw spring-boot:run` | Run Spring Boot application |
| `./mvnw clean package` | Build JAR file |
| `./mvnw test` | Run tests |
| `./mvnw clean` | Clean build artifacts |

Build and run:
```bash
cd ecom-backend
./mvnw clean package
java -jar target/SpringBootEcommerce-0.0.1-SNAPSHOT.jar
```

---

## 2. Directory Structure

### Frontend (`ecom-frontend/src/`)
```
src/
├── api/              # Axios configuration
├── auth/             # Login & seller registration pages
├── components/       # Reusable UI components
│   ├── layout/       # Layout components (Sidebar, Topbar)
│   ├── product-shared/  # Shared product components
│   └── product-templates/  # Category-specific views
├── context/          # React Context (Auth, Cart)
├── lib/              # Utility libraries
├── pages/
│   ├── user/         # Customer-facing pages
│   └── seller/       # Seller dashboard pages
├── routes/          # Route definitions
├── store/           # Redux state management
│   └── actions/     # Redux actions
└── utils/           # Helper functions
```

### Backend (`ecom-backend/src/main/java/com/ecommerce/project/`)
```
├── config/           # Security & app configuration
├── controller/      # REST API controllers
├── exception/        # Custom exceptions & handlers
├── model/           # JPA entities
├── payload/         # Request/Response DTOs
├── repository/      # Data access interfaces
├── security/        # JWT, Auth filters, Config
├── service/         # Business logic
└── util/           # Utility classes
```

---

## 3. Code Style Guidelines

### Frontend (React/JavaScript)

#### File Extensions
- Use `.jsx` for React components with JSX
- Use `.js` for utility files without JSX
- No TypeScript is currently used

#### Imports Ordering
1. External libraries (React, react-router-dom, redux, MUI, etc.)
2. Local components/utils (relative imports)
3. Asset imports (images, styles)

```jsx
// 1. External libraries
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@mui/material";
import axios from "axios";

// 2. Local imports
import ProductCard from "../../components/ProductCard";
import { fetchProducts } from "../../store/actions";

// 3. Assets
import logo from "../../assets/logo.png";
```

#### Component Patterns
- Use arrow functions with `export default`
- Use PascalCase for component names
- Destructure props at function parameter level

```jsx
const ProductCard = ({
  productId,
  productName,
  price,
}) => {
  // component code
  return (
    <div>{productName}</div>
  );
};

export default ProductCard;
```

#### Conditional Rendering
- Use ternary operators for simple conditions
- Use early returns for loading/error states

```jsx
if (loading) {
  return <Spinner />;
}

return (
  <div>{/* content */}</div>
);
```

#### State Management
- Use Redux Toolkit for global state
- Use React Context for auth state (see `AuthContext.jsx`)
- Use local `useState` for component-level state

#### Tailwind CSS Usage
- Use utility classes for styling
- Combine with MUI for complex components
- Use `clsx` or `tailwind-merge` for conditional classes

```jsx
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

<div className={cn("base-class", isActive && "active-class")} />
```

### Backend (Java/Spring Boot)

#### Naming Conventions
- Classes: PascalCase (e.g., `ProductController`)
- Methods: camelCase (e.g., `getProducts`)
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Packages: lowercase (e.g., `com.ecommerce.project.controller`)

#### Entity Annotations
- Use JPA annotations for ORM mapping
- Use Lombok to reduce boilerplate

```java
@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
```

#### Service Layer
- Define interface in `service/` folder
- Implementation in `service/` folder with `Impl` suffix

```java
// Interface
public interface ProductService {
    ProductDTO createProduct(ProductRequest request);
    List<ProductDTO> getAllProducts();
}

// Implementation
@Service
@Transactional
public class ProductServiceImpl implements ProductService {
    @Override
    public ProductDTO createProduct(ProductRequest request) {
        // implementation
    }
}
```

#### REST Controllers
- Use `@RestController` for REST endpoints
- Use `@RequestMapping` for base path
- Return DTOs, not entities

```java
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
}
```

#### Error Handling
- Use custom exceptions in `exception/` folder
- Use `@ControllerAdvice` for global exception handling

```java
@RestControllerAdvice
public class MyGlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<APIResponse> handleException(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new APIResponse(ex.getMessage(), false));
    }
}
```

---

## 4. API Conventions

### Frontend API Calls
- Use configured axios instance from `api/` folder
- Include JWT token in Authorization header
- Handle errors with try/catch and user notifications

```javascript
import api from "../api";

const fetchProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
```

### Backend API Endpoints
- Public endpoints: authentication, product listing
- Protected endpoints: cart, orders, seller operations
- Use role-based access control with `@PreAuthorize`

---

## 5. Authentication & Authorization

### JWT Flow
1. User logs in via `/api/auth/signin`
2. Backend validates credentials, returns JWT token
3. Frontend stores token in localStorage
4. All requests include `Authorization: Bearer <token>`
5. Backend validates token and extracts user roles

### Role-Based Access
- `ROLE_USER`: Customer (browse, cart, order)
- `ROLE_SELLER`: Seller (inventory, orders, reports)
- `ROLE_ADMIN`: Admin (full platform access)

### Protected Routes (Frontend)
Use the `ProtectedRoute` component with `allowedRoles`:

```jsx
<ProtectedRoute allowedRoles={['ROLE_SELLER', 'ROLE_ADMIN']}>
  <SellerLayout />
</ProtectedRoute>
```

---

## 6. Common Patterns

### Adding a New Page (Frontend)
1. Create component in appropriate `pages/` subfolder
2. Add route in `App.jsx` with proper path
3. Wrap with `ProtectedRoute` if needed

### Adding a New API Endpoint (Backend)
1. Create DTO in `payload/` folder
2. Add method to service interface
3. Implement in serviceImpl class
4. Add controller method with proper annotations

### Adding a New Entity
1. Create model class with JPA annotations
2. Create repository interface
3. Create DTO for API response
4. Add service methods
5. Add controller endpoints

---

## 7. Environment Configuration

### Frontend
Create `.env` in `ecom-frontend/`:
```env
VITE_BACK_END_URL=http://localhost:8080
```

### Backend
Configure in `application.properties`:
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/ecommerce

# JWT
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000

# File Upload
app.upload.dir=uploads
```

---

## 8. Running the Application

### Development Mode
```bash
# Backend (Terminal 1)
cd ecom-backend
./mvnw spring-boot:run

# Frontend (Terminal 2)
cd ecom-frontend
npm run dev
```

Access: `http://localhost:5173` (frontend), `http://localhost:8080` (backend API)

---

## 9. Important Notes

- Do NOT commit secrets, credentials, or API keys
- Always verify changes with lint before committing
- No test framework configured - do not add tests unless requested
- Use existing patterns in codebase for consistency
- Frontend uses `.jsx` (not `.tsx`) - no TypeScript
- Backend requires Java 21
- PostgreSQL is default database, MySQL and H2 also supported

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
