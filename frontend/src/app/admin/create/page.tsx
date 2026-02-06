"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/editor/TiptapEditor";
import { getCsrfToken } from "@/lib/auth-client";

// Map UI Labels to DB Values
const contentTypes = [
  { label: "Article", value: "article" },
  { label: "Plog", value: "plog" },
  { label: "Project", value: "project" },
];

const articleSubTypes = [
  { label: "Tech Notes", value: "tech" },
  { label: "Life", value: "life" },
  { label: "Essay", value: "essay" },
];

export default function CreatePost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "article",
    sub_type: "tech", 
    summary: "",
    contentHtml: "<p></p>", // Just for editor preview
    contentJson: {},        // Real data to send
    status: "published",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const csrfToken = getCsrfToken();
    if (!csrfToken) {
      alert("Missing CSRF token, please login again.");
      router.push("/login");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        type: formData.type,
        sub_type: formData.type === "article" ? formData.sub_type : "", // Only article has subtype
        summary: formData.summary,
        status: formData.status,
        content: formData.contentJson, // Send JSON structure
        meta: {}, // Expand later if needed
      };

      const res = await fetch(`/api/admin/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.status === 403) {
        throw new Error("CSRF validation failed");
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create post");
      }

      alert("Post created successfully!");
      router.push("/admin");
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
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
            
            {/* 1. Title & Type Row */}
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
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type (Category)
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white"
                >
                  {contentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 1.5 SubType (Only for Article) & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.type === "article" && (
                <div className="space-y-2">
                  <label htmlFor="sub_type" className="block text-sm font-medium text-gray-700">
                    Sub Category
                  </label>
                  <select
                    id="sub_type"
                    name="sub_type"
                    value={formData.sub_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white"
                  >
                    {articleSubTypes.map((sub) => (
                      <option key={sub.value} value={sub.value}>
                        {sub.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
               <div className="space-y-2">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
            </div>

            {/* 2. Summary */}
            <div className="space-y-2">
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                Summary / Excerpt
              </label>
              <textarea
                id="summary"
                name="summary"
                rows={3}
                value={formData.summary}
                onChange={handleChange}
                placeholder="Write a brief summary description..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            {/* 3. Main Content (Tiptap Editor) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Main Content
              </label>
              
              <TiptapEditor 
                content={formData.contentHtml}
                onChange={(html) => setFormData(prev => ({ ...prev, contentHtml: html }))}
                onJsonChange={(json) => setFormData(prev => ({ ...prev, contentJson: json }))}
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
                disabled={loading}
                className="px-8 py-2 bg-black text-white text-sm font-bold rounded-md hover:bg-gray-800 transition-transform active:scale-95 shadow-md disabled:opacity-50"
              >
                {loading ? "Publishing..." : "Publish Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
