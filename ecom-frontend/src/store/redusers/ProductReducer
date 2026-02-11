const initialState = {
  products: [],
  filteredProducts: [],
  featuredProduct: [],
  bestSellerProduct: [],
  pagination: {},
  stats: {
    totalProducts: 0,
    outOfStock: 0,
    lowStock: 0,
  },
  statsLoading: false,

  loading: false,
  error: null,
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {

    /* ================= SELLER PRODUCTS ================= */

    case "FETCH_SELLER_PRODUCTS_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "FETCH_SELLER_PRODUCTS_SUCCESS":
      return {
        ...state,
        loading: false,
        products: action.payload, // 🔥 seller products stored here
        pagination: {
          pageNumber: action.pageNumber,
          pageSize: action.pageSize,
          totalElements: action.totalElements,
          totalPages: action.totalPages,
          lastPage: action.lastPage,
        },
      };

    case "FETCH_SELLER_PRODUCTS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    /* ================= CREATE PRODUCT ================= */

    case "CREATE_PRODUCT_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "CREATE_PRODUCT_SUCCESS":
      return {
        ...state,
        loading: false,
        products: [action.payload, ...state.products],
      };

    case "CREATE_PRODUCT_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    /* ================= SELLER STATISTICS ================= */

    case "FETCH_SELLER_STATS_REQUEST":
      return {
        ...state,
        statsLoading: true,
        error: null,
      };

    case "FETCH_SELLER_STATS_SUCCESS":
      return {
        ...state,
        statsLoading: false,
        stats: {
          totalProducts: action.payload.totalProducts || 0,
          outOfStock: action.payload.outOfStock || 0,
          lowStock: action.payload.lowStock || 0,
        },
      };

    case "FETCH_SELLER_STATS_FAILURE":
      return {
        ...state,
        statsLoading: false,
        error: action.payload,
      };

    /* ================= UPDATE PRODUCT ================= */

    case "UPDATE_PRODUCT_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "UPDATE_PRODUCT_SUCCESS":
      return {
        ...state,
        loading: false,
        products: state.products.map((product) =>
          product.productId === action.payload.productId
            ? action.payload
            : product
        ),
      };

    case "UPDATE_PRODUCT_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    /* ================= DELETE PRODUCT ================= */

    case "DELETE_PRODUCT_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "DELETE_PRODUCT_SUCCESS":
      return {
        ...state,
        loading: false,
        products: state.products.filter((product) =>
          product.productId !== action.payload
        ),
      };

    case "DELETE_PRODUCT_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    /* ================= FETCH FILTERED PRODUCTS (Featured/Best Seller) ================= */

    case "IS_FETCHING":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "FETCH_FILTERED_PRODUCTS":
      return {
        ...state,
        loading: false,
        [action.target]: action.payload, // featuredProduct or bestSellerProduct
        pagination: {
          pageNumber: action.pageNumber,
          pageSize: action.pageSize,
          totalElements: action.totalElements,
          totalPages: action.totalPages,
          lastPage: action.lastPage,
        },
      };

    case "IS_SUCCESS":
      return {
        ...state,
        loading: false,
      };

    case "IS_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
