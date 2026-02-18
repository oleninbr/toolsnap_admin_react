import { Resource } from "react-admin";
import { ToolList } from "./ToolList";
import { ToolEdit } from "./ToolEdit";
import { ToolCreate } from "./ToolCreate";

export const ToolResource = () => (
  <Resource
    name="tools"
    list={ToolList}
    edit={ToolEdit}
    create={ToolCreate}
  />
);
