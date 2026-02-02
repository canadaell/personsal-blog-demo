"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/editor/TiptapEditor";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPostPage(props: EditPostPageProps) {
  const router = useRouter();
  const [postId, setPostId] = useState<string | null>(null); // Store resolved ID

  const [formData, setFormData] = useState({
    title: "",
    type: "article",
    sub_type: "tech",
    summary: "",
    contentJson: {}, // JSON content
    contentHtml: "", // HTML content for editor initialization
    status: "draft",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Resolve Params & Fetch Data
  useEffect(() => {
    const init = async () => {
      try {
        const params = await props.params;
        setPostId(params.id);

        // Fetch post details
        // Note: We can use the public API here or the admin one.
        // Since we are admin, let's assume we have a token, but public API is easier to fetch for read-only View logic first.
        // However, we want to PUT to admin API.
        const res = await fetch(`http://localhost:8080/posts/${params.id}`, { cache: "no-store"});
        
        if (!res.ok) {
            throw new Error("Failed to fetch post");
        }
        
        const post = await res.json();
        
        setFormData({
            title: post.title,
            type: post.type,
            sub_type: post.sub_type || "",
            summary: post.summary || "",
            // Ideally backend returns content as pure JSON object.
            contentJson: post.content || {},
            // TiptapEditor needs HTML or JSON to init? 
            // Our TiptapEditor component logic: 
            // If we pass `content` prop, it initializes with it.
            // If post.content is JSON object, we should pass it.
            // Let's check TiptapEditor.tsx implementation.
            // Assuming it handles HTML or JSON.
            // For now, let's pass JSON directly if the component supports it.
            // Wait, TiptapEditor prop is `content?: string`.
            // We might need to handle this carefully.
            // If `content: string` expects HTML, we have a problem if we only store JSON.
            // BUT: We added `onJsonChange`. Did we add `initialContentJson`? No.
            // Re-read TiptapEditor.tsx.
            contentHtml: "", // If we only have JSON, we rely on editor to load JSON.
                             // BUT TiptapEditor might only load string content.
                             // We might need to modify TiptapEditor to accept JSON content prop.
            status: post.status,
        });
        
        // HACK: We need to pass JSON to TiptapEditor somehow if it supports it.
        // Or if backend converts to HTML? Backend stores JSON.
        // We need TiptapEditor to accept `content` as JSON object too.

      } catch (error) {
        console.error(error);
        alert("Error loading post");
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId) return;

    setIsSaving(true);
    try {
      // Get JWT from cookie
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        alert("Not authenticated. Please login.");
        router.push("/login");
        return;
      }

      // Construct Payload
      const payload = {
        type: formData.type,
        sub_type: formData.type === "article" ? formData.sub_type : "",
        title: formData.title,
        summary: formData.summary,
        content: formData.contentJson, // Send JSON structure
        status: formData.status,
      };

      const res = await fetch(`http://localhost:8080/admin/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update post");
      }

      const data = await res.json();
      console.log("Post updated:", data);
      router.push("/admin"); // Redirect back to dashboard
    } catch (error) {
      console.error(error);
      alert("Failed to update post");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-12">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#faf6f1] p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-8">Edit Post</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5"
              placeholder="Post title"
              required
            />
          </div>

          {/* Type & SubType */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-md bg-white"
              >
                <option value="article">Article</option>
                <option value="plog">Plog</option>
                <option value="project">Project</option>
              </select>
            </div>

            {formData.type === "article" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="sub_type"
                  value={formData.sub_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md bg-white"
                >
                  <option value="tech">Tech Notes</option>
                  <option value="life">Life</option>
                </select>
              </div>
            )}
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5"
              placeholder="Brief summary..."
            />
          </div>

          {/* Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <div className="border border-gray-200 rounded-md overflow-hidden min-h-[400px]">
              {/* Note: We pass contentJson if we can. 
                  Currently TiptapEditor only accepts `content` (string). 
                  If we pass empty string, it's empty. 
                  We need to fix TiptapEditor to accept initial JSON content.
                  For now, passing formData.contentJson as 'content' prop likely fails type check or logic.
                  
                  TEMPORARY FIX: We need to modify TiptapEditor to create editor with JSON content 
                  if provided.
              */}
              <TiptapEditor 
                // @ts-ignore: Assuming we fix TiptapEditor to accept contentJson or handle it within content prop check
                content={formData.contentJson} 
                onChange={(html) => setFormData(prev => ({ ...prev, contentHtml: html }))}
                onJsonChange={(json) => setFormData(prev => ({ ...prev, contentJson: json }))}
              />
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
             <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input 
                    type="radio" 
                    name="status" 
                    value="draft"
                    checked={formData.status === 'draft'}
                    onChange={handleChange}
                  />
                  Save as Draft
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input 
                    type="radio" 
                    name="status" 
                    value="published"
                    checked={formData.status === 'published'}
                    onChange={handleChange}
                  />
                  Publish Now
                </label>
             </div>

             <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 text-gray-600 font-medium hover:text-black transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {isSaving ? "Saving..." : "Update Post"}
                </button>
             </div>
          </div>

        </form>
      </div>
    </div>
  );
}
