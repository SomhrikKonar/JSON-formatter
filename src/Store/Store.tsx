import React, { createContext, useContext, useReducer, Dispatch } from "react";
import {
  updateJson,
  updateError,
  initialState,
  stateInterface,
  updateJsonReducer,
  updateHideObjectIndex,
  changeInputFormat,
} from "./Reducers/Json";

//creating context
const Store = createContext<
  [
    stateInterface | undefined,
    Dispatch<
      updateJson | updateError | updateHideObjectIndex | changeInputFormat
    >
  ]
>([initialState, () => {}]);
Store.displayName = "Store";

//hook to access context
export const useStore = () => useContext(Store);

//wrapper for out context
// interface Props {
//   children: React.ReactElement;
//   initialState: state;
//   reducer: any;
// }
export const StoreProvider = (props: any) => {
  const [state, dispatch] = useReducer(updateJsonReducer, initialState);
  return (
    <Store.Provider value={[state, dispatch]}>{props.children}</Store.Provider>
  );
};
