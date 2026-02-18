import { Admin, Resource } from "react-admin";
import dataProvider from "./dataProvider";
import { MyLayout } from "./layout/Layout";

// Tools
import { ToolList } from "../features/tools/ToolList";
import { ToolEdit } from "../features/tools/ToolEdit";
import { ToolCreate } from "../features/tools/ToolCreate";

// Action Types
import { ActionTypeList } from "../features/action-types/ActionTypeList";
import { ActionTypeEdit } from "../features/action-types/ActionTypeEdit";
import { ActionTypeCreate } from "../features/action-types/ActionTypeCreate";

export const AdminApp = () => (
  <Admin dataProvider={dataProvider} layout={MyLayout}>
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
  </Admin>
);
