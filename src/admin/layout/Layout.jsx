import { Layout } from "react-admin";
import { CustomMenu } from "./Menu";

export const MyLayout = (props) => (
  <Layout {...props} menu={CustomMenu} />
);
