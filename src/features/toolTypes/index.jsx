import { Resource } from "react-admin";
import { ToolTypeList } from "./ToolTypeList";
import { ToolTypeEdit } from "./ToolTypeEdit";
import { ToolTypeCreate } from "./ToolTypeCreate";

export const ToolTypeResource = () => (
  <Resource
    name="tool-types"
    list={ToolTypeList}
    edit={ToolTypeEdit}
    create={ToolTypeCreate}
  />
);
