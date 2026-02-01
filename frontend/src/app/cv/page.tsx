import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";

export default function CV() {
  return (
    <MainLayout>
      <div className="space-y-8">
         <h2 className="text-3xl font-bold text-gray-900 border-b pb-4 border-gray-200">
          Curriculum Vitae
        </h2>
        <div className="prose max-w-none text-gray-600">
           {/* Simple CV structure */}
           <section className="mb-8">
               <h3 className="text-xl font-bold text-gray-800 mb-2">Experience</h3>
               <div className="mb-4">
                   <h4 className="font-semibold">Software Engineer - Company X</h4>
                   <p className="text-sm text-gray-500">2023 - Present</p>
                   <p className="mt-1">Working on full-stack web applications...</p>
               </div>
           </section>

           <section className="mb-8">
               <h3 className="text-xl font-bold text-gray-800 mb-2">Education</h3>
               <div className="mb-4">
                   <h4 className="font-semibold">University Name</h4>
                   <p className="text-sm text-gray-500">Degree in Computer Science</p>
               </div>
           </section>
        </div>
      </div>
    </MainLayout>
  );
}
