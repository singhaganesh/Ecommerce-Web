import api from "../../api/api";

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

/* Load main categories */
export const fetchMainCategories = () => async (dispatch) => {
  try {
    dispatch({ type: "FETCH_MAIN_CATEGORIES_REQUEST" });

    const { data } = await api.get("/public/categories/main");

    dispatch({
      type: "FETCH_MAIN_CATEGORIES_SUCCESS",
      payload: data
    });

  } catch (error) {
    dispatch({
      type: "FETCH_MAIN_CATEGORIES_FAIL",
      payload: error.message
    });
  }
};

/* Load children categories */
export const fetchChildrenCategories = (categoryId, level) => async (dispatch) => {
  try {
    dispatch({ type: "FETCH_CHILD_CATEGORIES_REQUEST", level });

    const { data } = await api.get(`/public/categories/${categoryId}/children`);

    dispatch({
      type: "FETCH_CHILD_CATEGORIES_SUCCESS",
      payload: data,
      level
    });

  } catch (error) {
    dispatch({
      type: "FETCH_CHILD_CATEGORIES_FAIL",
      payload: error.message,
      level
    });
  }
};
