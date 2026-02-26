import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MainLayout } from "../components";
import { PublicLayout } from "../components/layout/PublicLayout";

const UnauthorizedContent: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center relative overflow-hidden">
      <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center opacity-10 text-primary">
        <span className="text-[9rem] md:text-[16rem] font-extrabold leading-none">
          403
        </span>
      </div>

      <div className="relative z-10 max-w-xl mx-auto space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-primary/70 mb-2">
          Access / Restricted
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          You are not authorized
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
          You do not have permission to access this section. If you think this is
          an error, please contact the administrator.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth();

  const content = <UnauthorizedContent />;

  return user ? (
    <MainLayout>{content}</MainLayout>
  ) : (
    <PublicLayout>{content}</PublicLayout>
  );
};

export default UnauthorizedPage;
