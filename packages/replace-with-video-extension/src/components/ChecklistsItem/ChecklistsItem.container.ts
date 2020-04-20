import { connect } from "react-redux";
import { IState, Dispatch } from "../../store";
import ChecklistsItem, {
  IOwnProps,
  IMapDispatchProps,
  IMapStateProps
} from "./ChecklistsItem.render";

const mapDispatchToProps = (
  dispatch: Dispatch,
  props: IOwnProps
): IMapDispatchProps => ({
  setIsExpanded: (isExpanded: boolean) =>
    dispatch({
      type: "SET_IS_EXPANDED",
      payload: {
        checklistId: props.id,
        isExpanded
      }
    }),
  clearChecks: () =>
    dispatch({
      type: "CLEAR_CHECKS",
      payload: {
        checklistId: props.id
      }
    })
});

const mapStateToProps = (state: IState, props: IOwnProps): IMapStateProps => {
  const checklist = state.checklistsById[props.id];

  if (!checklist) {
    return {
      exists: false,
      id: "NONE",
      isExpanded: false,
      title: "No Checklist",
      items: null,
      checklists: null,
      hasChecklistItems: false,
      showEditMode: state.showEditMode
    };
  }

  return {
    ...checklist,
    isExpanded: !!state.expandedByChecklistId[props.id],
    exists: true,
    hasChecklistItems: !!checklist.items && !!checklist.items.length,
    showEditMode: state.showEditMode
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChecklistsItem);
