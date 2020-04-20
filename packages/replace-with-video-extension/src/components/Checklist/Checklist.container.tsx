import { connect } from "react-redux";
import { IState, Dispatch } from "../../store";
import Checklist, {
  IOwnProps,
  IMapDispatchProps,
  IMapStateProps
} from "./Checklist.render";

const mapDispatchToProps = (
  dispatch: Dispatch,
  props: IOwnProps
): IMapDispatchProps => ({
  setChecked: (checklistItemId: string, checked: boolean) =>
    dispatch({
      type: "SET_CHECKED",
      payload: {
        checklistId: props.id,
        checklistItemId,
        checked
      }
    })
});

const mapStateToProps = (state: IState, props: IOwnProps): IMapStateProps => {
  const checklist = state.checklistsById[props.id];

  const key = state.showEditMode
    ? "hiddenItemsByChecklistId"
    : "checksByChecklistId";

  const checks = state[key][props.id] || {};

  if (!checklist) {
    return {
      showEditMode: state.showEditMode,
      items: null,
      checklists: null,
      exists: false
    };
  }

  const hiddenChecks = state.hiddenItemsByChecklistId[props.id] || {};

  return {
    showEditMode: state.showEditMode,
    exists: true,
    checklists: checklist.checklists,
    items: checklist.items
      ? checklist.items
          .filter(item => (state.showEditMode ? true : !hiddenChecks[item.id]))
          .map(item => {
            return {
              ...item,
              checked: !!checks[item.id]
            };
          })
      : null
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Checklist);
