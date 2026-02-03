import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";

export default function AboutMe() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 border-b pb-4 border-gray-200">
          About Me
        </h2>
        <div className="prose max-w-none text-gray-600 leading-relaxed">
          <p>
            Hello! I&apos;m Mingde. I&apos;m a passionate developer...
          </p>
          <p>
            &quot;Seize the day, gather ye rosebuds while ye may.&quot;
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
