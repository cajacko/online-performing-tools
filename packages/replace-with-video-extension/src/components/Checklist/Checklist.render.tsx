import * as React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import { IChecklistItem } from "../../store";
import Container from "./Checklist.container";

export interface IOwnProps {
  id: string;
}

export interface IExpandedChecklistItem extends IChecklistItem {
  checked: boolean;
}

export interface IMapStateProps {
  items: IExpandedChecklistItem[] | null;
  exists: boolean;
  checklists: string[] | null;
  showEditMode: boolean;
}

export interface IMapDispatchProps {
  setChecked: (checklistItemId: string, checked: boolean) => void;
}

export interface IProps extends IOwnProps, IMapStateProps, IMapDispatchProps {}

const Checklist = ({
  items,
  setChecked,
  exists,
  checklists,
  showEditMode
}: IProps) => {
  if (!exists) return null;

  const noContent = !checklists && !items;

  return (
    <List>
      {!!items &&
        !!items.length &&
        items.map(({ id, text, checked }) => (
          <ListItem
            key={id}
            dense
            button
            onClick={() => setChecked(id, !checked)}
          >
            <Checkbox
              checked={showEditMode ? !checked : checked}
              tabIndex={-1}
              disableRipple
            />
            <ListItemText primary={text} />
          </ListItem>
        ))}
      {!!checklists &&
        !!checklists.length &&
        checklists.map(id => <Container key={id} id={id} />)}
      {noContent && (
        <ListItem dense>
          <ListItemText primary="No checklist items" />
        </ListItem>
      )}
    </List>
  );
};

export default Checklist;
