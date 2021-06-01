import axios from 'axios';
import { toast } from 'react-toastify';
import {
  ADD_LEVEL,
  DELETE_LEVEL,
  EDIT_LEVEL,
  GET_ALL_LEVELS,
  GET_LEVEL,
  AUTH_ERRORS,
} from '../constants/ActionTypes';

// get all Levels
export const getAllLevels = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/levels');

    dispatch({
      type: GET_ALL_LEVELS,
      payload: res.data, //{ msg: 'all levels', allLevels }
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

// get one Level
export const getOneLevel = (idLevel) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/levels/${idLevel}`);
    dispatch({
      type: GET_LEVEL,
      payload: res.data, //{ msg: 'level found by id', findLevel }
    });
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

// add new level

export const addLevel = (formData) => async (dispatch) => {
  try {
    const res = await axios.post('/api/levels', formData);
    dispatch({
      type: ADD_LEVEL,
      payload: res.data, // { msg: 'level addedd', newLevel }
    });
    toast(res.data.msg);
    dispatch(getAllLevels());
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

// Edit level

export const eidtLevel = (idLevel, editedLevel) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/levels/${idLevel}`, editedLevel);
    dispatch({
      type: EDIT_LEVEL,
      payload: res.data, // { msg: 'level edited with success', allLevels }
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

// Edit level

export const deleteLevel = (idLevel) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/levels/${idLevel}`);
    dispatch({
      type: DELETE_LEVEL,
      payload: res.data, // { msg: 'level deleted(with courses and quizzes)', allLevels }
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
