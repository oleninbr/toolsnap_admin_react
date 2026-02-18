import { Resource } from "react-admin";

// tools
import { ToolList } from "../features/tools/ToolList";
import { ToolEdit } from "../features/tools/ToolEdit";
import { ToolCreate } from "../features/tools/ToolCreate";

// action-types
import { ActionTypeList } from "../features/action-types/ActionTypeList";
import { ActionTypeEdit } from "../features/action-types/ActionTypeEdit";
import { ActionTypeCreate } from "../features/action-types/ActionTypeCreate";

export const AdminResources = () => (
  <>
    <Resource
      name="tools"
      list={ToolList}
      edit={ToolEdit}
      create={ToolCreate}
    />

    <Resource
      name="action-types"
      list={ActionTypeList}
      edit={ActionTypeEdit}
      create={ActionTypeCreate}
    />
  </>
);
