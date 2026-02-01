"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/editor/TiptapEditor";

const categories = [
  "分享热爱 (Sharing Love)",
  "杂文随笔 (Essays)",
  "技术笔记 (Tech Notes)",
  "摄影 (Photography)",
];

export default function CreatePost() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    category: categories[0],
    summary: "",
    content: "<p>Start writing your amazing story...</p>", // Initial content for Tiptap
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting post:", formData);
    // Here you would typically call your API to save the post
    alert("Post created successfully! (Mock)");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#faf6f1] text-gray-900 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
            <p className="text-gray-500 mt-1">Write something amazing today.</p>
          </div>
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            Cancel & Back
          </Link>
        </div>

        {/* Editor Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Title & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter post title..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Summary (Tian Xie Content) */}
            <div className="space-y-2">
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                Summary / Excerpt
              </label>
              <textarea
                id="summary"
                name="summary"
                rows={3}
                required
                value={formData.summary}
                onChange={handleChange}
                placeholder="Write a brief summary description..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
              />
              <p className="text-xs text-gray-400 text-right">
                {formData.summary.length} characters
              </p>
            </div>

            {/* 3. Main Content (Tiptap Editor) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Main Content
              </label>
              
              <TiptapEditor 
                content={formData.content} 
                onChange={(html) => setFormData(prev => ({ ...prev, content: html }))} 
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2 bg-black text-white text-sm font-bold rounded-md hover:bg-gray-800 transition-transform active:scale-95 shadow-md"
              >
                Publish Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
