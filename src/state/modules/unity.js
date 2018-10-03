import { set, merge } from '../../utils/objectUtils';
import { sendMessage } from "../../utils/unityUtils";

const RESET_UNITY_STATE = 'unity/RESET_STATE';
const SET_UNITY_STATE = 'unity/SET_UNITY_STATE';
const SET_UNITY_CONTROL_MODE = 'unity/SET_UNITY_CONTROL_MODE';
const TOGGLE_UNITY_VIEW_ANGLE = 'unity/TOGGLE_UNITY_VIEW_ANGLE';

export const resetUnityState = () => ({
  type: RESET_UNITY_STATE
});

export const showUnity = () => ({
  type: SET_UNITY_STATE,
  key: 'isVisible',
  value: true
});

export const hideUnity = () => ({
  type: SET_UNITY_STATE,
  key: 'isVisible',
  value: false
});

export const setUnityMaster = (masterInstance) => ({
  type: SET_UNITY_STATE,
  key: 'master',
  value: masterInstance
});

export const unityIsLoading = (value) => ({
  type: SET_UNITY_STATE,
  key: 'isLoading',
  value
});

export const unityIsReady = () => ({
  type: SET_UNITY_STATE,
  key: 'isLoaded',
  value: true
});

export const setUnityControlMode = (unityMaster, controlMode) => ({
  type: SET_UNITY_CONTROL_MODE,
  unityMaster,
  controlMode
});

export const toggleUnityViewAngle = (unityMaster) => ({
  type: TOGGLE_UNITY_VIEW_ANGLE,
  unityMaster
});

const initialState = {
  master: null,
  isLoaded: false,
  isVisible: false,
  isModelReady: false,
  unityControlMode: 'tumble',
  unityViewAngle: 'perspective'
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case RESET_UNITY_STATE:
      return {
        ...initialState,
        position: { ...initialState.position },
        master: state.master || null,
        isLoaded: state.isLoaded
      };

    case SET_UNITY_STATE:
      return set(action.key, action.value, state);

    case SET_UNITY_CONTROL_MODE:
      switch (action.controlMode) {
        case 'tumble':
          sendMessage(action.unityMaster, 'TumbleMode');
          break;
        case 'zoom':
          sendMessage(action.unityMaster, 'ZoomMode');
          break;
        case 'pan':
          sendMessage(action.unityMaster, 'PanMode');
          break;
        default:
          return state;
      }
      return set('unityControlMode', action.controlMode, state);

    case TOGGLE_UNITY_VIEW_ANGLE:
      let controlMode = state.unityControlMode;
      let shadowJSON = {
        enabled: false,
        distance: .1
      };

      switch (state.unityViewAngle) {
        case 'perspective':
          if(controlMode === 'tumble'){
            controlMode = 'pan';
            sendMessage(action.unityMaster, 'PanMode');
          }
          sendMessage(action.unityMaster, 'SetShadows', shadowJSON);
          sendMessage(action.unityMaster, 'SetView', 'TOP');
          sendMessage(action.unityMaster, 'FrameView');
          return merge(state, {unityViewAngle: 'top', unityControlMode: controlMode});
        case 'top':
          if(controlMode === 'tumble'){
            controlMode = 'pan';
            sendMessage(action.unityMaster, 'PanMode');
          }
          sendMessage(action.unityMaster, 'SetShadows', shadowJSON);
          sendMessage(action.unityMaster, 'SetView', 'BOTTOM');
          sendMessage(action.unityMaster, 'FrameView');
          return merge(state, {unityViewAngle: 'bottom', unityControlMode: 'pan'});
        case 'bottom':
          shadowJSON.enabled = true;
          sendMessage(action.unityMaster, 'SetShadows', shadowJSON);
          sendMessage(action.unityMaster, 'TumbleMode');
          sendMessage(action.unityMaster, 'ResetOBJPosition');
          sendMessage(action.unityMaster, 'SetView', 'Perspective');
          return merge(state, {unityViewAngle: 'perspective', unityControlMode: 'tumble'});
        default:
          return state;
      }
    default:
      return state;
  }
};

export default reducer;
