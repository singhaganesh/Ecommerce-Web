const initialState = {
  mainCategories: [],
  subCategories: [],
  microCategories: [],
  loading: false,
  error: null,
};

export const categoryReducer = (state = initialState, action) => {

  switch (action.type) {

    case "FETCH_MAIN_CATEGORIES_REQUEST":
    case "FETCH_CHILD_CATEGORIES_REQUEST":
      return { ...state, loading: true };

    case "FETCH_MAIN_CATEGORIES_SUCCESS":
      return {
        ...state,
        loading: false,
        mainCategories: action.payload
      };

    case "FETCH_CHILD_CATEGORIES_SUCCESS":
      if (action.level === "sub") {
        return {
          ...state,
          loading: false,
          subCategories: action.payload,
          microCategories: []
        };
      }

      if (action.level === "micro") {
        return {
          ...state,
          loading: false,
          microCategories: action.payload
        };
      }

      return state;

    case "FETCH_MAIN_CATEGORIES_FAIL":
    case "FETCH_CHILD_CATEGORIES_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
