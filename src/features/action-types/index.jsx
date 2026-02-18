import { Resource } from "react-admin";
import { ActionTypeList } from "./ActionTypeList";
import { ActionTypeEdit } from "./ActionTypeEdit";
import { ActionTypeCreate } from "./ActionTypeCreate";

export const ActionTypeResource = () => (
  <Resource
    name="action-types"
    list={ActionTypeList}
    edit={ActionTypeEdit}
    create={ActionTypeCreate}
  />
);
