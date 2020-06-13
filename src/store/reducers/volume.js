import ActionType from '../action-type';

export default function volume(state = 0.7, action) {
  if (action.type === ActionType.SetVolume) return action.volume;
  return state;
}
