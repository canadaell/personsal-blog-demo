import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen px-6 py-12 md:py-20 flex justify-center">
      <div className="w-full max-w-3xl">
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
};
