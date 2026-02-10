import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./ProductReducer";
import { categoryReducer } from "./CategoryReducer";
import { authReducer } from "./AuthReducer";

export const store = configureStore({
  reducer: {
    products: productReducer,
    category: categoryReducer,
    auth: authReducer,
  },
});

export default store;
