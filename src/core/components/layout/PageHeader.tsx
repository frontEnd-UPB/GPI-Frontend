import React from "react";
import { ChevronRight } from "lucide-react";
import PageHeaderImage from "../../assets/Page-Header.jpg";

export interface PageHeaderProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  backgroundImageUrl?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs = [],
  backgroundImageUrl,
}) => {
  const imageToUse = backgroundImageUrl ?? PageHeaderImage;
  return (
    <div className="relative w-full border-b border-border overflow-hidden bg-muted">
      {/* Fondo de imagen + overlay */}
      {imageToUse && (
        <div className="absolute inset-0">
          <img
            src={imageToUse}
            alt="Page header background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-muted/30 via-muted/70 to-muted/10" />
        </div>
      )}

      {/* Contenido */}
      <div className="container mx-auto px-2 py-1 md:py-4 relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1 text-sm mb-0.1 text-primary">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <ChevronRight className="size-4 text-primary/80" />
                )}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="hover:text-info transition-colors"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-muted-foreground">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Título */}
        <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight">
          {title}
        </h1>
      </div>
      {/* Barra inferior con los 3 colores principales */}
      <div className="flex h-[3px] w-full relative z-10">
        <div className="flex-1 bg-muted" />
        <div className="flex-[2] bg-primary" />
        <div className="flex-1 bg-info" />
      </div>
    </div>
  );
};

export { PageHeader };
