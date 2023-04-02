import { FC, ReactNode } from "react";
import { Nav } from "./Nav";
import { Toaster } from "react-hot-toast";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Nav />
      {children}
      <Toaster />
    </div>
  );
};
