// import * as class from '../actions/class';

import { User } from "../user.model";

export interface State {
  user: User;
}

const initialState: State = {
  user: null,
};

export function authReducer(state = initialState, action) {
  return state;
}
