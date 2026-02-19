import { Resource } from "react-admin";

// Tools
import { ToolList } from "../../features/tools/ToolList";
import { ToolEdit } from "../../features/tools/ToolEdit";
import { ToolCreate } from "../../features/tools/ToolCreate";

// Action Types
import { ActionTypeList } from "../../features/action-types/ActionTypeList";
import { ActionTypeEdit } from "../../features/action-types/ActionTypeEdit";
import { ActionTypeCreate } from "../../features/action-types/ActionTypeCreate";

// Location Types
import { LocationTypeList } from "../../features/locationTypes/LocationTypeList";
import { LocationTypeEdit } from "../../features/locationTypes/LocationTypeEdit";
import { LocationTypeCreate } from "../../features/locationTypes/LocationTypeCreate";

// Roles
import { RoleList } from "../../features/roles/RoleList";
import { RoleEdit } from "../../features/roles/RoleEdit";
import { RoleCreate } from "../../features/roles/RoleCreate";

// Photo Types
import { PhotoTypeList } from "../../features/photoTypes/PhotoTypeList";
import { PhotoTypeEdit } from "../../features/photoTypes/PhotoTypeEdit";
import { PhotoTypeCreate } from "../../features/photoTypes/PhotoTypeCreate";

// Tool Statuses
import { ToolStatusList } from "../../features/toolStatuses/ToolStatusList";
import { ToolStatusEdit } from "../../features/toolStatuses/ToolStatusEdit";
import { ToolStatusCreate } from "../../features/toolStatuses/ToolStatusCreate";

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

    <Resource
      name="location-types"
      list={LocationTypeList}
      edit={LocationTypeEdit}
      create={LocationTypeCreate}
    />

    <Resource
      name="roles"
      list={RoleList}
      edit={RoleEdit}
      create={RoleCreate}
    />

    <Resource
      name="photo-types"
      list={PhotoTypeList}
      edit={PhotoTypeEdit}
      create={PhotoTypeCreate}
    />

    <Resource
      name="tool-statuses"
      list={ToolStatusList}
      edit={ToolStatusEdit}
      create={ToolStatusCreate}
    />
  </>
);
