import { Admin, Resource, ListGuesser, EditGuesser } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

const dataProvider = simpleRestProvider("https://localhost:5001/api");

const AdminPanel = () => (
  <Admin dataProvider={dataProvider}>
    <Resource
      name="tools"
      list={ListGuesser}
      edit={EditGuesser}
    />
  </Admin>
);

export default AdminPanel;
