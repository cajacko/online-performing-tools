import React from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

export interface IMapStateProps {
  showEditMode: boolean;
}

export interface IMapDispatchProps {
  setShowEditMode: (showEditMode: boolean) => void;
}

export interface IProps extends IMapStateProps, IMapDispatchProps {}

const ToggleShowHide: React.FC<IProps> = ({
  showEditMode,
  setShowEditMode
}: IProps) => {
  const onClickHandler = () => setShowEditMode(!showEditMode);

  return (
    <React.Fragment>
      {showEditMode && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            background: "#f50057",
            padding: 10,
            display: "flex",
            justifyContent: "center"
          }}
        >
          <Typography style={{ color: "white" }}>Edit Mode</Typography>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: "20px"
        }}
      >
        <Button
          variant="contained"
          color={showEditMode ? "secondary" : "primary"}
          onClick={onClickHandler}
        >
          {showEditMode ? "Toggle Off Edit Mode" : "Toggle On Edit Mode"}
        </Button>
      </div>
    </React.Fragment>
  );
};

export default ToggleShowHide;
