import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandLess from "@material-ui/icons/ExpandLess";
import Clear from "@material-ui/icons/Clear";
import Check from "@material-ui/icons/Check";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Checklist from "../Checklist";
import { IChecklist } from "../../store";
import Container from "./ChecklistsItem.container";

export interface IOwnProps {
  id: string;
  level: number;
}

export interface IMapStateProps extends IChecklist {
  isExpanded: boolean;
  exists: boolean;
  hasChecklistItems: boolean;
  checklists: string[] | null;
  showEditMode: boolean;
}

export interface IMapDispatchProps {
  setIsExpanded: (isExpanded: boolean) => void;
  clearChecks: () => void;
}

interface IProps extends IOwnProps, IMapStateProps, IMapDispatchProps {}

const ChecklistsItem = (props: IProps) => {
  if (!props.exists) return null;

  return (
    <React.Fragment>
      <ListItem
        button
        onClick={() => props.setIsExpanded(!props.isExpanded)}
        selected={props.isExpanded}
        style={{
          borderLeft:
            props.level === 0 ? undefined : `${props.level * 5}px solid #398eb1`
        }}
      >
        <ListItemIcon>
          {props.isExpanded ? <ExpandLess /> : <ExpandMore />}
        </ListItemIcon>
        <ListItemText primary={props.title} />

        {props.isExpanded && props.hasChecklistItems && (
          <ListItemSecondaryAction>
            <IconButton aria-label="Clear Checks" onClick={props.clearChecks}>
              {props.showEditMode ? <Check /> : <Clear />}
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>

      <Collapse in={props.isExpanded} timeout="auto" unmountOnExit>
        {props.hasChecklistItems && <Checklist id={props.id} />}
        {props.checklists &&
          props.checklists.map(id => (
            <Container key={id} id={id} level={props.level + 1} />
          ))}
      </Collapse>

      <Divider />
    </React.Fragment>
  );
};

export default ChecklistsItem;
