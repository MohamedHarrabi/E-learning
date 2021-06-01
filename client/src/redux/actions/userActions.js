import axios from 'axios';
import { toast } from 'react-toastify';
import {
  USER_LOADING,
  LOGIN_USER,
  REGISTER_USER,
  LOGOUT_USER,
  GET_AUTH_USER,
  AUTH_ERRORS,
  EDIT_USER,
  GET_QUIZ,
  SET_ALERT,
  GET_ALL_USERS,
} from '../constants/ActionTypes';
import { setAlert } from './alertActions';

//Set the user loading
const userLoading = () => (dispatch) => {
  dispatch({
    type: USER_LOADING,
  });
};

// Register USer
export const registerUser = (formData) => async (dispatch) => {
  dispatch(userLoading());
  try {
    const res = await axios.post('/api/users/register', formData);
    dispatch({
      type: REGISTER_USER,
      payload: res.data, // { msg: 'user addedd', newUser, token }
    });
    toast(res.data.msg);
    dispatch(getAuthUser());
  } catch (error) {
    console.dir(error);

    const { errors, msg } = error.response.data;

    if (Array.isArray(errors)) {
      errors.forEach((err) => toast.error(err.msg));
    }
    console.log(errors);
    if (msg) {
      alert(msg);
    }
  }
};

// Login User
export const loginUser = (formData) => async (dispatch) => {
  dispatch(userLoading());

  try {
    const res = await axios.post('/api/users/login', formData);
    dispatch({
      type: LOGIN_USER,
      payload: res.data, // { msg: 'Logged in with success', user, token }
    });
    toast(res.data.msg);
  } catch (error) {
    console.dir(error);

    const { errors, msg } = error.response.data;

    if (Array.isArray(errors)) {
      errors.forEach((err) => toast.error(err.msg));
    }
    console.log(errors);
    if (msg) {
      alert(msg);
    }

    dispatch({
      type: AUTH_ERRORS,
    });
  }
};

// Edit user

export const edituser = (idUser, editedUser) => async (dispatch) => {
  console.log(idUser);
  console.log(editedUser);
  try {
    const res = await axios.put(`/api/users/${idUser}`, editedUser);
    console.log(res);
    dispatch({
      type: EDIT_USER,
      payload: res.data, // { msg: 'user modified', useraftermodif }
    });
    toast(res.data.msg);
    dispatch(getAuthUser());
  } catch (error) {
    console.dir(error);

    const { errors, msg } = error.response.data;

    if (Array.isArray(errors)) {
      errors.forEach((err) => toast.error(err.msg));
    }
    console.log(errors);
    if (msg) {
      alert(msg);
    }

    dispatch({
      type: AUTH_ERRORS,
    });
  }
};

// Get auth user
export const getAuthUser = () => async (dispatch) => {
  dispatch(userLoading());

  try {
    //headers
    const config = {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    };
    const res = await axios.get('/api/users/user', config);
    dispatch({
      type: GET_AUTH_USER,
      payload: res.data, //{user: req.user}
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: AUTH_ERRORS,
    });
  }
};

// Get all Users
export const getAllUsers = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/users');

    dispatch({
      type: GET_ALL_USERS,
      payload: res.data, //{ msg: 'all users', userslist }
    });
  } catch (error) {
    console.log(error);

    const { errors, msg } = error.response.data;

    if (Array.isArray(errors)) {
      errors.forEach((err) => toast.error(err.msg));
    }
    console.log(errors);
    if (msg) {
      alert(msg);
    }
  }
};

export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT_USER,
  });
};
