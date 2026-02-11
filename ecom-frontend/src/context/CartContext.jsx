import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    calculateTotals();
  }, [cart]);

  const calculateTotals = () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartTotal(total);
    setItemCount(count);
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === product.productId);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.quantity) {
          toast.error(`Only ${product.quantity} items available in stock`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      if (quantity > product.quantity) {
        toast.error(`Only ${product.quantity} items available in stock`);
        return prevCart;
      }
      
      return [...prevCart, { ...product, quantity }];
    });
    
    toast.success(`${quantity} x ${product.productName} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
    toast.info("Item removed from cart");
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    toast.success("Cart cleared");
  };

  const getCartItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const value = {
    cart,
    cartTotal,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
