import { Resource } from "react-admin";
import { BrandList } from "./BrandList";
import { BrandEdit } from "./BrandEdit";
import { BrandCreate } from "./BrandCreate";

export const BrandResource = () => (
  <Resource
    name="brands"
    list={BrandList}
    edit={BrandEdit}
    create={BrandCreate}
  />
);
