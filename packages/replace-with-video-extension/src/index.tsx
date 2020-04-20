import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Checklists from "./components/Checklists";
import ActionButtons from "./components/ActionButtons";
import ToggleShowHide from "./components/ToggleShowHide";
import { store, persistor } from "./store";
import fetchChecklists from "./utils/fetchChecklists";

fetchChecklists();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ActionButtons />
      <Checklists />
      <ToggleShowHide />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
