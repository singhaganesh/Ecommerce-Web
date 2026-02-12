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

    // Send JSON directly - images are already Cloudinary URLs in productData.images
    const { data } = await api.post(
      `/seller/categories/${categoryId}/${sellerId}/product`,
      productData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    dispatch({
      type: "CREATE_PRODUCT_SUCCESS",
      payload: data,
    });
    
    return data;

  } catch (error) {
    dispatch({
      type: "CREATE_PRODUCT_FAILURE",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
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

/* ================= SELLER PRODUCT STATISTICS ================= */

export const fetchSellerProductStats = (sellerId) => async (dispatch) => {
  try {
    dispatch({ type: "FETCH_SELLER_STATS_REQUEST" });

    const { data } = await api.get(`/seller/${sellerId}/products/stats`);

    console.log("Seller Stats Response:", data);

    dispatch({
      type: "FETCH_SELLER_STATS_SUCCESS",
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: "FETCH_SELLER_STATS_FAILURE",
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* ================= UPDATE PRODUCT ================= */

export const updateProduct = (productId, productData, newImages, existingImages) => async (dispatch) => {
  try {
    dispatch({ type: "UPDATE_PRODUCT_REQUEST" });

    console.log("Updating product:", productId, productData);
    console.log("Images:", productData.images);

    // Send JSON directly - images are Cloudinary URLs in productData.images
    const { data } = await api.put(`/seller/products/${productId}`, productData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Update response:", data);

    dispatch({
      type: "UPDATE_PRODUCT_SUCCESS",
      payload: data,
    });
    
    return data;

  } catch (error) {
    dispatch({
      type: "UPDATE_PRODUCT_FAILURE",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

/* ================= DELETE PRODUCT ================= */

export const deleteProduct = (productId, sellerId) => async (dispatch) => {
  try {
    dispatch({ type: "DELETE_PRODUCT_REQUEST" });

    await api.delete(`/seller/products/${productId}`);

    dispatch({
      type: "DELETE_PRODUCT_SUCCESS",
      payload: productId,
    });

    // Refresh products and stats after deletion
    dispatch(fetchSellerProducts(sellerId, 0, 5, "productId", "asc"));
    dispatch(fetchSellerProductStats(sellerId));

  } catch (error) {
    dispatch({
      type: "DELETE_PRODUCT_FAILURE",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};
