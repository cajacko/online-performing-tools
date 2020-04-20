/* eslint no-undef: 0 */
import React from "react";
import Button from "@material-ui/core/Button";

const ActionButtons: React.FC = () => {
  const onClickHandler = (enable: boolean) => () => {
    //@ts-ignore
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      //@ts-ignore
      chrome.tabs.sendMessage(tabs[0].id, {
        type: enable ? "enable" : "disable"
      });
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: "20px"
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={onClickHandler(true)}
      >
        Enable Buttons
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={onClickHandler(false)}
      >
        Disable Buttons
      </Button>
    </div>
  );
};

export default ActionButtons;
