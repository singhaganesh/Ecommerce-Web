import { SET_CART, ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_QUANTITY, CLEAR_CART } from "../types";

const initialState = {
  cartItems: [],
  cartTotal: 0,
  itemCount: 0
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CART:
      return {
        ...state,
        cartItems: action.payload,
        cartTotal: calculateTotal(action.payload),
        itemCount: calculateCount(action.payload)
      };
    
    case ADD_TO_CART: {
      const { product, quantity } = action.payload;
      const existingItem = state.cartItems.find(item => item.productId === product.productId);
      
      let newCartItems;
      if (existingItem) {
        newCartItems = state.cartItems.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCartItems = [...state.cartItems, { ...product, quantity }];
      }
      
      return {
        ...state,
        cartItems: newCartItems,
        cartTotal: calculateTotal(newCartItems),
        itemCount: calculateCount(newCartItems)
      };
    }
    
    case REMOVE_FROM_CART: {
      const newCartItems = state.cartItems.filter(item => item.productId !== action.payload);
      return {
        ...state,
        cartItems: newCartItems,
        cartTotal: calculateTotal(newCartItems),
        itemCount: calculateCount(newCartItems)
      };
    }
    
    case UPDATE_CART_QUANTITY: {
      const { productId, quantity } = action.payload;
      const newCartItems = state.cartItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
      return {
        ...state,
        cartItems: newCartItems,
        cartTotal: calculateTotal(newCartItems),
        itemCount: calculateCount(newCartItems)
      };
    }
    
    case CLEAR_CART:
      return {
        ...state,
        cartItems: [],
        cartTotal: 0,
        itemCount: 0
      };
    
    default:
      return state;
  }
};

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const calculateCount = (items) => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

export default cartReducer;
