const initialState = {
  categories: [],
  pagination: {},
};

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_CATEGORIES":
      return {
        ...state,
        categories: action.payload,
        pagination: {
          pageNumber: action.pageNumber,
          pageSize: action.pageSize,
          totalElements: action.totalElements,
          totalPages: action.totalPages,
          lastPage: action.lastPage,
        },
      };

    default:
      return state;
  }
};
