import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { arrayMoveMutable } from 'array-move';


Vue.use(Vuex)

/*
 * The authorization header is set for axios when you login but what happens when you come back or
 * the page is refreshed. When that happens you need to check for the token in local storage and if it
 * exists you should set the header so that it will be attached to each request
 */
const currentToken = localStorage.getItem('token')
const currentUser = JSON.parse(localStorage.getItem('user'));

if (currentToken != null) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
}

export default new Vuex.Store({
  state: {
    token: currentToken || '',
    user: currentUser || {},
    landmarks: [],
    itineraries: []
  },
  mutations: {
    SET_AUTH_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    LOGOUT(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.token = '';
      state.user = {};
      axios.defaults.headers.common = {};
    },
    POPULATE_LANDMARKS(state, payload) {
      state.landmarks = payload;
    },
    POPULATE_ITINERARIES(state, payload) {
      state.itineraries = payload;
    },
    ADD_TO_RATING(state, landmarkID) {
      console.log("ADD_TO_RATING: " + landmarkID);
      let index = state.landmarks.findIndex(object => {
        return object.landmarkID == landmarkID;
      })
      state.landmarks[index].upRatings = (state.landmarks[index].upRatings) + 1;
    },
    SUBTRACT_FROM_RATING(state, landmarkID) {
      console.log("ADD_TO_RATING: " + landmarkID);
      let index = state.landmarks.findIndex(object => {
        return object.landmarkID == landmarkID;
      })
      state.landmarks[index].downRatings = (state.landmarks[index].downRatings) + 1;
    },
    INCREMENT_LANDMARK_ORDER(state, payload) {
      let itineraryIndex = state.itineraries.findIndex(object => {
        return object.itineraryId == payload.itineraryId;
      });

      let landmarkIndex = state.itineraries[itineraryIndex].landmarkList.findIndex(object => {
        return object.landmarkID == payload.landmarkId;
      });
      arrayMoveMutable(state.itineraries[itineraryIndex].landmarkList, landmarkIndex, landmarkIndex + 1);

    },
    DECREMENT_LANDMARK_ORDER(state, payload) {
      let itineraryIndex = state.itineraries.findIndex(object => {
        return object.itineraryId == payload.itineraryId;
      });

      let landmarkIndex = state.itineraries[itineraryIndex].landmarkList.findIndex(object => {
        return object.landmarkID == payload.landmarkId;
      });
      arrayMoveMutable(state.itineraries[itineraryIndex].landmarkList, landmarkIndex, landmarkIndex - 1);

    },
  }
})
