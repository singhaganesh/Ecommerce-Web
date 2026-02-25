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

  /**
   * Unique cart key: productId + variantId.
   * Same product with different variants → separate cart items.
   * Products without variants → variantId is null.
   */
  const getCartKey = (item) => `${item.productId}_${item.variantId || "base"}`;

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const cartKey = getCartKey(product);
      const existingItem = prevCart.find((item) => getCartKey(item) === cartKey);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const maxQty = product.maxQuantity || product.quantity;
        if (newQuantity > maxQty) {
          toast.error(`Only ${maxQty} items available in stock`);
          return prevCart;
        }
        return prevCart.map((item) =>
          getCartKey(item) === cartKey
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      const maxQty = product.maxQuantity || product.quantity;
      if (quantity > maxQty) {
        toast.error(`Only ${maxQty} items available in stock`);
        return prevCart;
      }

      return [...prevCart, { ...product, quantity }];
    });

    const label = product.variantLabel ? ` (${product.variantLabel})` : "";
    toast.success(`${quantity} x ${product.productName}${label} added to cart!`);
  };

  const removeFromCart = (productId, variantId = null) => {
    const key = `${productId}_${variantId || "base"}`;
    setCart((prevCart) => prevCart.filter((item) => getCartKey(item) !== key));
    toast.info("Item removed from cart");
  };

  const updateQuantity = (productId, quantity, variantId = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    const key = `${productId}_${variantId || "base"}`;
    setCart((prevCart) =>
      prevCart.map((item) =>
        getCartKey(item) === key ? { ...item, quantity } : item
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
