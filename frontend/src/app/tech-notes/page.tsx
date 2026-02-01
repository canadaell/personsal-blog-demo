import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";

export default function TechNotes() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 border-b pb-4 border-gray-200">
          Tech Notes
        </h2>
        <div className="prose max-w-none text-gray-600">
          <p>Technical documentation and learning notes.</p>
           {/* Add tech notes list here */}
           <ul className="list-disc pl-5 space-y-3 mt-6">
                <li>
                    <span className="font-semibold text-gray-800">Note 1:</span> Learning Next.js App Router
                </li>
                <li>
                    <span className="font-semibold text-gray-800">Note 2:</span> Setting up Go with Gin and GORM
                </li>
           </ul>
        </div>
      </div>
    </MainLayout>
  );
}
