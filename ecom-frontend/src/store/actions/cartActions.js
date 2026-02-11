import api from "../../api/api";
import { SET_CART, ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_QUANTITY, CLEAR_CART } from "../types";

export const setCart = (cartItems) => ({
  type: SET_CART,
  payload: cartItems
});

export const addToCart = (product, quantity = 1) => ({
  type: ADD_TO_CART,
  payload: { product, quantity }
});

export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId
});

export const updateCartQuantity = (productId, quantity) => ({
  type: UPDATE_CART_QUANTITY,
  payload: { productId, quantity }
});

export const clearCart = () => ({
  type: CLEAR_CART
});

// Async actions for server-side cart
export const fetchCart = () => async (dispatch) => {
  try {
    const response = await api.get("/cart");
    dispatch(setCart(response.data));
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
};

export const saveCartToServer = (cartItems) => async (dispatch) => {
  try {
    await api.post("/cart", { items: cartItems });
  } catch (error) {
    console.error("Error saving cart:", error);
  }
};
