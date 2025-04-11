import React from "react";
import { cn } from "../../lib/utils/cn";

const Card = ({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-md tdfsyWDTVMGl FG56T V bg-white text-gray-900 shadow",
      className
    )}
    {...props}
  />
);

const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1 p-5", className)} {...props} />
);

const CardDescription = ({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-gray-500", className)} {...props} />
);

const CardTitle = ({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-red-600 font-medium leading-none tracking-tight",
      className
    )}
    {...props}
  />
);

const CardContent = ({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
);

const CardFooter = ({ className, ...props }) => (
  <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
);

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
