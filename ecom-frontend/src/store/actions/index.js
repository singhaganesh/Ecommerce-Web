import api from "../../api/api"

export const fetchProducts = () => async (dispatch) => {
  try {
    console.log("Calling backend API...");
    
    const { data } = await api.get("/public/products");

    console.log("Backend Response:", data);   // 👈 DEBUG

    dispatch({
      type: "FETCH_PRODUCTS",
      payload: data.content,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      lastPage: data.lastPage,
    });
  } catch (error) {
    console.error("Backend error:", error);
  }
};

export const fetchCategories = () => async (dispatch) => {
  try {
    const { data } = await api.get("/public/categories");

    console.log("Backend Response of category:", data);   // 👈 DEBUG
    dispatch({
      type: "FETCH_CATEGORIES",
      payload: data.content,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      lastPage: data.lastPage,
    });
  } catch (error) {
    console.error("Failed to fetch categories", error);
  }
};

