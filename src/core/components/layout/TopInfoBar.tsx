import React from "react";
import { Phone, Clock, MapPin } from "lucide-react";

export interface TopInfoBarProps {
  emergency?: string;
  workHour?: string;
  location?: string;
}

const TopInfoBar: React.FC<TopInfoBarProps> = ({
  emergency = "(237) 681-812-255",
  workHour = "09:00 - 20:00 Everyday",
  location = "0123 Some Place",
}) => {
  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Logo */}
          <div className="text-center text-2xl font-bold font-heading lg:text-left">
            <span className="text-primary">MED</span>
            <span className="text-info">DICAL</span>
          </div>

          {/* Info Items */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex xl:items-center xl:gap-8">
            {/* Emergency */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-full bg-muted">
                <Phone className="size-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-foreground uppercase">
                  Emergency
                </span>
                <span className="text-sm font-medium text-info">
                  {emergency}
                </span>
              </div>
            </div>

            {/* Work Hour */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-full bg-muted">
                <Clock className="size-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-foreground uppercase">
                  Work Hour
                </span>
                <span className="text-sm font-medium text-info">
                  {workHour}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 sm:col-span-2 xl:col-span-1">
              <div className="flex items-center justify-center size-10 rounded-full bg-muted">
                <MapPin className="size-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-foreground uppercase">
                  Location
                </span>
                <span className="text-sm font-medium text-info">
                  {location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TopInfoBar };
