import * as React from "react";
import { cn } from "../../../ui/utils";
import welcomeImage from "../assets/auth_side_image.png";

interface ThemedContainerProps {
  children: React.ReactNode;
  className?: string;
}

// A reusable container styled with theme and UI conventions for forms in the authentication module
function ThemedContainer({ children, className }: ThemedContainerProps) {
  return (
    <div
      className={cn(
        "bg-primary text-card-foreground flex flex-col md:flex-row rounded-xl shadow-lg overflow-hidden", // theme classes
        "max-w-3xl w-full h-[650px] z-10", 
        className
      )}
    >
      {/* PARTE IZQUIERDA DEL CONTAINER CON LA IMAGEN */}
      <div className="hidden md:block bg-background w-1/2 relative">
        <img src={welcomeImage} alt="Welcome" className="absolute inset-0 w-full h-full object-cover object-[34%_50%] scale-110 translate-y-5" />
      </div>
      {/* PARTE DERECHA DEL CONTAINER QUE CONTENDRÁ EL FORMS */}
      <div className="flex-1 flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  );
}

export { ThemedContainer };