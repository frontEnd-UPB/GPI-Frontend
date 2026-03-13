import * as React from "react";
import { cn } from "../../../ui/utils";
import welcomeImage from "../assets/auth_side_image.png";

interface ThemedContainerProps {
  children: React.ReactNode;
  className?: string;
  leftOverlay?: React.ReactNode;
}

// A reusable container styled with theme and UI conventions for forms in the authentication module
function ThemedContainer({ children, className, leftOverlay }: ThemedContainerProps) {
  return (
    <div
      className={cn(
        "bg-primary text-card-foreground relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-xl shadow-lg md:flex-row md:min-h-[620px]",
        className
      )}
    >
      {/* PARTE IZQUIERDA DEL CONTAINER CON LA IMAGEN */}
      <div className="relative hidden bg-background md:block md:w-1/2">
        <img
          src={welcomeImage}
          alt="Welcome"
          className="absolute inset-0 w-full h-full object-cover object-[34%_50%] scale-110 translate-y-5"
        />

        {leftOverlay && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto">
              {leftOverlay}
            </div>
          </div>
        )}
      </div>
      {/* PARTE DERECHA DEL CONTAINER QUE CONTENDRÁ EL FORMS */}
      <div className="flex min-w-0 flex-1 items-center justify-center px-5 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12">
        {children}
      </div>
    </div>
  );
}

export { ThemedContainer };