import React from "react";
import { cn } from "../../../ui/utils";

export interface MainContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const MainContainer: React.FC<MainContainerProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <main
      className={cn(
        "min-h-screen bg-background",
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
};

export { MainContainer };
