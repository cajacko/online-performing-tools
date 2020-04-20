import { applyMiddleware, createStore, Dispatch as RDispatch } from "redux";
import logger from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export interface IChecklistItem {
  id: string;
  text: string;
}
export interface IChecklist {
  id: string;
  title: string;
  items: IChecklistItem[] | null;
  checklists: string[] | null;
}

export interface IState {
  showEditMode: boolean;
  startingChecklists: string[];
  checklistsById: {
    [key: string]: undefined | IChecklist;
  };
  checksByChecklistId: {
    [key: string]:
      | undefined
      | {
          [key: string]: undefined | boolean;
        };
  };
  hiddenItemsByChecklistId: {
    [key: string]:
      | undefined
      | {
          [key: string]: undefined | boolean;
        };
  };
  expandedByChecklistId: {
    [key: string]: undefined | boolean;
  };
}

interface ISetShowEditMode {
  type: "SET_SHOW_EDIT_MODE";
  payload: boolean;
}

interface ISetExpandedAction {
  type: "SET_IS_EXPANDED";
  payload: {
    checklistId: string;
    isExpanded: boolean;
  };
}

interface ISetCheckedAction {
  type: "SET_CHECKED";
  payload: {
    checklistId: string;
    checklistItemId: string;
    checked: boolean;
  };
}

interface IClearChecksAction {
  type: "CLEAR_CHECKS";
  payload: {
    checklistId: string;
  };
}

interface ICloseAllChecklists {
  type: "CLOSE_ALL_CHECKLISTS";
  payload: {};
}

export interface ISetChecklists {
  type: "SET_CHECKLISTS";
  payload: {
    checklistsById: IState["checklistsById"];
    startingChecklists: IState["startingChecklists"];
  };
}

type Actions =
  | ISetExpandedAction
  | ISetCheckedAction
  | IClearChecksAction
  | ISetChecklists
  | ICloseAllChecklists
  | ISetShowEditMode;

export type Dispatch = RDispatch<Actions>;

const initialState: IState = {
  showEditMode: false,
  startingChecklists: [],
  checklistsById: {},
  checksByChecklistId: {},
  expandedByChecklistId: {},
  hiddenItemsByChecklistId: {}
};

const reducer = (state: IState = initialState, action: Actions) => {
  switch (action.type) {
    case "SET_IS_EXPANDED": {
      return {
        ...state,
        expandedByChecklistId: {
          ...state.expandedByChecklistId,
          [action.payload.checklistId]: action.payload.isExpanded
        }
      };
    }

    case "SET_CHECKED": {
      const key = state.showEditMode
        ? "hiddenItemsByChecklistId"
        : "checksByChecklistId";

      const checklistChecks = state[key][action.payload.checklistId] || {};

      return {
        ...state,
        [key]: {
          ...state[key],
          [action.payload.checklistId]: {
            ...checklistChecks,
            [action.payload.checklistItemId]: action.payload.checked
          }
        }
      };
    }

    case "CLEAR_CHECKS": {
      const key = state.showEditMode
        ? "hiddenItemsByChecklistId"
        : "checksByChecklistId";

      return {
        ...state,
        [key]: {
          ...state[key],
          [action.payload.checklistId]: undefined
        }
      };
    }

    case "SET_CHECKLISTS": {
      return {
        ...state,
        ...action.payload
      };
    }

    case "CLOSE_ALL_CHECKLISTS": {
      return {
        ...state,
        expandedByChecklistId: {}
      };
    }

    case "SET_SHOW_EDIT_MODE": {
      return {
        ...state,
        showEditMode: action.payload
      };
    }

    default:
      return state;
  }
};

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = createStore(persistedReducer, applyMiddleware(logger));

export const persistor = persistStore(store);
