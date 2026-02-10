import api from '../../api/api';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

// Login action
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const response = await api.post('/auth/signin', {
      username: credentials.username,
      password: credentials.password
    });

    const { id, jwtToken, username, roles } = response.data;
    
    // Create user object
    const user = {
      userId: id,
      userName: username,
      roles: roles
    };

    // Store JWT in localStorage
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(user));

    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user, token: jwtToken }
    });

    return {
      success: true,
      user,
      token: jwtToken
    };

  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    
    dispatch({
      type: LOGIN_FAILURE,
      payload: errorMessage
    });

    return {
      success: false,
      message: errorMessage
    };
  }
};

// Logout action
export const logoutUser = () => async (dispatch) => {
  try {
    await api.post('/auth/signout');
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  dispatch({ type: LOGOUT });
};
