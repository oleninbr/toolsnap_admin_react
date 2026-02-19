import { Menu } from "react-admin";

export const CustomMenu = () => (
  <Menu>
    <Menu.Item to="/tools" primaryText="Tools" />
    <Menu.Item to="/action-types" primaryText="Action Types" />
    <Menu.Item to="/location-types" primaryText="Location Types" />
    <Menu.Item to="/roles" primaryText="Roles" />
    <Menu.Item to="/photo-types" primaryText="Photo Types" />
    <Menu.Item to="/tool-statuses" primaryText="Tool Statuses" />
    <Menu.Item to="/models" primaryText="Models" />
    <Menu.Item to="/brands" primaryText="Brands" />
    <Menu.Item to="/tool-types" primaryText="Tool Types" />
  </Menu>
);
