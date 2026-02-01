import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";

export default function Photography() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 border-b pb-4 border-gray-200">
          PLOG
        </h2>
        <div className="prose max-w-none text-gray-600">
          <p>A collection of my photos.</p>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                
           </div>
        </div>
      </div>
    </MainLayout>
  );
}
