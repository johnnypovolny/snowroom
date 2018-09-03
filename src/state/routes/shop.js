import { set } from '../../utils/objectUtils';

export const RESET_SHOP_STATE = 'shop/RESET_SHOP_STATE';
export const SET_SHOP_STATE = 'shop/SET_SHOP_STATE';

export const resetShopState = () => ({
  type: RESET_SHOP_STATE
});

export const setShopState = (key, value) => ({
  type: SET_SHOP_STATE,
  key,
  value
});

const initialState = {
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case RESET_SHOP_STATE:
      return initialState;
    case SET_SHOP_STATE:
      return set(action.key, action.value, state);
    default:
      return state;
  }
};

export default reducer;