import { Resource } from "react-admin";
import { ToolAssignmentList } from "./ToolAssignmentList";
import { ToolAssignmentEdit } from "./ToolAssignmentEdit";
import { ToolAssignmentCreate } from "./ToolAssignmentCreate";

export const ToolAssignmentResource = () => (
  <Resource
    name="tool-assignments"
    list={ToolAssignmentList}
    edit={ToolAssignmentEdit}
    create={ToolAssignmentCreate}
  />
);
