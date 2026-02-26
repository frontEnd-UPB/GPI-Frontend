import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MainLayout } from "../components";
import { PublicLayout } from "../components/layout/PublicLayout";
import { ROUTE_PATHS } from "../../routes/routes";

const NotFoundContent: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center relative overflow-hidden">
      <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center opacity-10 text-primary">
        <span className="text-[9rem] md:text-[16rem] font-extrabold leading-none">
          404
        </span>
      </div>

      <div className="relative z-10 max-w-xl mx-auto space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-primary/70 mb-2">
          Home / Error
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          Page not Found
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
          Please contact Support if you think we made a mistake or use the button
          below to return to your main dashboard.
        </p>
        <div className="mt-6">
          <Link
            to={ROUTE_PATHS.HOME}
            className="inline-flex items-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

const NotFoundPage: React.FC = () => {
  const { user } = useAuth();

  const content = <NotFoundContent />;

  return user ? (
    <MainLayout>{content}</MainLayout>
  ) : (
    <PublicLayout>{content}</PublicLayout>
  );
};

export default NotFoundPage;
