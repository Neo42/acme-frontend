"use client";

import { ReactNode, useEffect } from "react";

import Navbar from "@/app/components/navbar";
import Sidebar from "@/app/components/sidebar";
import StoreProvider, { useAppSelector } from "@/app/redux";
import { cn } from "@/lib/utils";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      <Sidebar />
      <main
        className={cn(
          !isSidebarCollapsed && "md:pl-64",
          "flex w-full flex-col bg-gray-50 dark:bg-dark-bg",
        )}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;
