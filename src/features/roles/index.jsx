import { Resource } from "react-admin";
import { RoleList } from "./RoleList";
import { RoleEdit } from "./RoleEdit";
import { RoleCreate } from "./RoleCreate";

export const RoleResource = () => (
  <Resource
    name="roles"
    list={RoleList}
    edit={RoleEdit}
    create={RoleCreate}
  />
);
