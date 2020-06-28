import ActionType from '../action-type';

export default function defaultLoop(state = 15, action) {
  if (action.type === ActionType.SetDefaultLoop) return action.loop;
  return state;
}
