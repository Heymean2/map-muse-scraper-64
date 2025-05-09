
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  fluid?: boolean; // Add this prop to allow full-width containers
}

export function Container({ 
  children, 
  className,
  as: Component = "div",
  fluid = false
}: ContainerProps) {
  return (
    <Component className={cn(
      "w-full mx-auto px-4 sm:px-6", 
      !fluid && "max-w-7xl lg:px-8",
      className
    )}>
      {children}
    </Component>
  );
}
