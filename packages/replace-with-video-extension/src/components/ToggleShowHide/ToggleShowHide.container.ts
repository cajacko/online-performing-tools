import { connect } from "react-redux";
import { IState, Dispatch } from "../../store";
import ToggleShowHide, {
  IMapStateProps,
  IMapDispatchProps
} from "./ToggleShowHide.render";

const mapDispatchToProps = (dispatch: Dispatch): IMapDispatchProps => ({
  setShowEditMode: (showEditMode: boolean) =>
    dispatch({
      type: "SET_SHOW_EDIT_MODE",
      payload: showEditMode
    })
});

const mapStateToProps = (state: IState): IMapStateProps => {
  return {
    showEditMode: state.showEditMode
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToggleShowHide);
