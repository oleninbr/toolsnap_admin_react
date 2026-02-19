import { Resource } from "react-admin";
import { ModelList } from "./ModelList";
import { ModelEdit } from "./ModelEdit";
import { ModelCreate } from "./ModelCreate";

export const ModelResource = () => (
  <Resource
    name="models"
    list={ModelList}
    edit={ModelEdit}
    create={ModelCreate}
  />
);
