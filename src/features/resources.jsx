import { Resource, ListGuesser, EditGuesser, CreateGuesser } from "react-admin";
import { ToolList } from "./tools/ToolList";
import { ToolEdit } from "./tools/ToolEdit";
import { ToolCreate } from "./tools/ToolCreate";

<Resource
  name="tools"
  list={ToolList}
  edit={ToolEdit}
  create={ToolCreate}
/>

export const resources = [
 // <Resource key="tools" name="tools" list={ListGuesser} edit={EditGuesser} create={CreateGuesser} />,
  <Resource key="brands" name="brands" list={ListGuesser} edit={EditGuesser} create={CreateGuesser} />,
  <Resource key="models" name="models" list={ListGuesser} edit={EditGuesser} create={CreateGuesser} />,
  <Resource key="tool-types" name="tool-types" list={ListGuesser} edit={EditGuesser} create={CreateGuesser} />,
  <Resource key="tool-statuses" name="tool-statuses" list={ListGuesser} edit={EditGuesser} create={CreateGuesser} />,

  <Resource key="users" name="users" list={ListGuesser} edit={EditGuesser} create={CreateGuesser} />,
  <Resource key="roles" name="roles" list={ListGuesser} edit={EditGuesser} create={CreateGuesser} />,

  <Resource key="locations" name="locations" list={ListGuesser} edit={EditGuesser} create={CreateGuesser} />,
  <Resource key="location-types" name="location-types" list={ListGuesser} edit={EditGuesser} create={CreateGuesser} />,

  <Resource key="tool-assignments" name="tool-assignments" list={ListGuesser} edit={EditGuesser} create={CreateGuesser} />,

  <Resource key="detected-tools" name="detected-tools" list={ListGuesser} edit={EditGuesser} create={CreateGuesser} />,
  <Resource key="photo-sessions" name="photo-sessions" list={ListGuesser} edit={EditGuesser} create={CreateGuesser} />,
  <Resource key="photos-for-detection" name="photos-for-detection" list={ListGuesser} edit={EditGuesser} create={CreateGuesser} />,
  <Resource key="tool-photos" name="tool-photos" list={ListGuesser} edit={EditGuesser} create={CreateGuesser} />,
  <Resource key="photo-types" name="photo-types" list={ListGuesser} edit={EditGuesser} create={CreateGuesser} />,
  <Resource key="action-types" name="action-types" list={ListGuesser} edit={EditGuesser} create={CreateGuesser} />,
];
