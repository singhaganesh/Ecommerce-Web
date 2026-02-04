import api from "../../api/api";

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

/* Filtered product fetch */
export const fetchFilteredProducts = (queryString, target) => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    console.log("FETCH_FILTERED_PRODUCTS");

    const { data } = await api.get(`/public/products/filter?${queryString}`);

    dispatch({
      type: "FETCH_FILTERED_PRODUCTS",
      payload: data.content,
      target, // where to store it
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      lastPage: data.lastPage,
    });

    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    console.error("Filter API error:", error);
    dispatch({ type: "IS_ERROR" });
  }
};

export const createProduct = (
  productData,
  images,
  categoryId,
  sellerId
) => async (dispatch) => {
  try {
    dispatch({ type: "CREATE_PRODUCT_REQUEST" });

    const formData = new FormData();

    // 🔹 product JSON
    formData.append(
      "product",
      new Blob([JSON.stringify(productData)], {
        type: "application/json",
      })
    );

    // 🔹 images
    images.forEach((file) => {
      formData.append("images", file);
    });

    const { data } = await api.post(
      `/seller/categories/${categoryId}/${sellerId}/product`,
      formData
    );

    dispatch({
      type: "CREATE_PRODUCT_SUCCESS",
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: "CREATE_PRODUCT_FAILURE",
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* ================= SELLER PRODUCTS ================= */

export const fetchSellerProducts = (sellerId, pageNumber = 0, pageSize = 5, sortBy = "productId", sortOrder = "asc") => async (dispatch) => {
  try {
    dispatch({ type: "FETCH_SELLER_PRODUCTS_REQUEST" });

    const { data } = await api.get(`/seller/${sellerId}/products`, {
      params: {
        pageNumber,
        pageSize,
        sortBy,
        sortOrder,
      },
    });

    console.log("Seller Products Response:", data);

    dispatch({
      type: "FETCH_SELLER_PRODUCTS_SUCCESS",
      payload: data.content,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      lastPage: data.lastPage,
    });

  } catch (error) {
    dispatch({
      type: "FETCH_SELLER_PRODUCTS_FAILURE",
      payload: error.response?.data?.message || error.message,
    });
  }
};
