import { Resource } from "react-admin";
import { UserList } from "./UserList";
import { UserEdit } from "./UserEdit";
import { UserCreate } from "./UserCreate";

export const UserResource = () => (
  <Resource
    name="users"
    list={UserList}
    edit={UserEdit}
    create={UserCreate}
  />
);
