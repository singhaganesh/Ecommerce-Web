import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./ProductReducer";
import { categoryReducer } from "./CategoryReducer";
import { authReducer } from "./AuthReducer";
import cartReducer from "./CartReducer";

export const store = configureStore({
  reducer: {
    products: productReducer,
    category: categoryReducer,
    auth: authReducer,
    cart: cartReducer,
  },
});

export default store;
