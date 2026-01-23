import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./ProductReducer";
import { categoryReducer } from "./CategoryReducer";

export const store = configureStore({
  reducer: {
    products: productReducer,
    category: categoryReducer,
  },
});

export default store;
