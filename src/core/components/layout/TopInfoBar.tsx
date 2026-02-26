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
      <div className="container mx-auto px-5 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold font-heading">
            <span className="text-primary">MED</span>
            <span className="text-info">DICAL</span>
          </div>

          {/* Info Items */}
          <div className="flex items-center gap-8">
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
            <div className="flex items-center gap-3">
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
