import { Resource } from "react-admin";
import { ToolStatusList } from "./ToolStatusList";
import { ToolStatusEdit } from "./ToolStatusEdit";
import { ToolStatusCreate } from "./ToolStatusCreate";

export const ToolStatusResource = () => (
  <Resource
    name="tool-statuses"
    list={ToolStatusList}
    edit={ToolStatusEdit}
    create={ToolStatusCreate}
  />
);
