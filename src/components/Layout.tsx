import { FC, ReactNode } from "react";
import { Nav } from "./Nav";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Nav />
      {children}
    </div>
  );
};
