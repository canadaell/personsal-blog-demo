"use client";

import React, { useState } from "react";
import Link from "next/link";

// Mock data shared with the homepage (ideally fetched from backend)
const initialPosts = [
  {
    id: 1,
    title: "Bartender 的替代品",
    category: "分享热爱",
    date: "2026/01/30",
    status: "Published",
  },
  {
    id: 2,
    title: "在 AI 浪潮中迷失的 Setapp",
    category: "杂文随笔",
    date: "2026/01/26",
    status: "Published",
  },
  {
    id: 3,
    title: "再谈 iA Writer",
    category: "分享热爱",
    date: "2026/01/25",
    status: "Draft",
  },
  {
    id: 4,
    title: "Plog 5 生活中的一点橙",
    category: "分享热爱",
    date: "2026/01/18",
    status: "Published",
  },
];

export default function AdminDashboard() {
  const [posts, setPosts] = useState(initialPosts);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6f1] text-gray-900 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Admin Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your blog content</p>
          </div>
          <div className="flex items-center gap-4">
             <Link href="/" className="text-sm text-gray-500 hover:text-black transition-colors">
                Back to Site
             </Link>
            <Link href="/admin/create" className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
              + New Post
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Total Posts</h3>
            <p className="text-3xl font-bold mt-2">{posts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Published</h3>
            <p className="text-3xl font-bold mt-2">
              {posts.filter(p => p.status === 'Published').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Drafts</h3>
            <p className="text-3xl font-bold mt-2">
              {posts.filter(p => p.status === 'Draft').length}
            </p>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-lg">Posts</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {post.title}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                      {post.date}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === 'Published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button className="text-blue-600 hover:text-blue-900 font-medium">
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {posts.length === 0 && (
             <div className="p-8 text-center text-gray-500">
                No posts found.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
