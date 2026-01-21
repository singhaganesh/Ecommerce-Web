import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./ProductReducer";
import { categoryReducer } from "./CategoryReducer";

export const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
  },
});

export default store;
