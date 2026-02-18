import { Menu } from "react-admin";

export const CustomMenu = () => (
  <Menu>
    <Menu.Item to="/tools" primaryText="Tools" />
    <Menu.Item to="/action-types" primaryText="Action Types" />
  </Menu>
);
