import Dispatcher from '../dispatcher/';
import Constants from '../constants';
import { EventEmitter } from 'events';
import assign from 'object-assign';
import debug from 'debug';

const CHANGE_EVENT = 'change';
const logger = debug('store:movies');

let state = {
  movies: [],
  lastFetchFailed: false
};

let MovieStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    logger('addChangeListener');
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    logger('removeChangeListener');
    this.removeListener(CHANGE_EVENT, callback);
    logger('removeChangeListener', EventEmitter.listenerCount(this, CHANGE_EVENT));
  },

  get: function() {
    return state;
  }

});

MovieStore.dispatchToken = Dispatcher.register(function(action) {
  switch(action.type) {
    case Constants.MovieActions.SET_MOVIES:
      state.lastFetchFailed = false;
      state.movies = action.movies;
      MovieStore.emitChange();
      break;

    case Constants.MovieActions.GET_MOVIES_ERROR:
      state.lastFetchFailed = true;
      MovieStore.emitChange();
      break;

    default:
      // ignore
  }
});

export default MovieStore;
