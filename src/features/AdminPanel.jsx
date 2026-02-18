import { Admin } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import { resources } from "./resources";
import { customMenu } from "./menu";

const dataProvider = simpleRestProvider("https://localhost:5001/api");

const AdminPanel = () => (
  <Admin dataProvider={dataProvider} menu={customMenu}>
    {resources}
  </Admin>
);

export default AdminPanel;
