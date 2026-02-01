import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";

export default function Projects() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 border-b pb-4 border-gray-200">
          Projects
        </h2>
        <div className="prose max-w-none text-gray-600">
          <p>Here you can showcase your projects.</p>
          {/* Add project list or grid here */}
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <div className="border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow">
               <h3 className="text-xl font-bold mb-2">Project A</h3>
               <p className="text-sm">Description of project A...</p>
            </div>
            <div className="border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow">
               <h3 className="text-xl font-bold mb-2">Project B</h3>
               <p className="text-sm">Description of project B...</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
