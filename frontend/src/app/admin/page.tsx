"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define Types
interface Post {
  id: string; // UUID
  title: string;
  type: string;
  sub_type?: string;
  status: string;
  published_at?: string;
  created_at: string;
}

interface DashboardStats {
  total: number;
  published: number;
  draft: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ total: 0, published: 0, draft: 0 });
  const [loading, setLoading] = useState(true);

  // Helper to format date
  const formatDate = (isoString?: string) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleDateString("zh-CN");
  };

  useEffect(() => {
    const fetchData = async () => {
      // Get Token
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch Stats
        const statsRes = await fetch("http://localhost:8080/admin/stats", { headers });
        if (statsRes.ok) {
          setStats(await statsRes.json());
        }

        // 2. Fetch Posts
        const postsRes = await fetch("http://localhost:8080/admin/posts", { headers });
        if (postsRes.ok) {
          const json = await postsRes.json();
          setPosts(json.data || []);
        }

      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    // Get Token
    const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

    if (!token) {
        alert("Not authenticated");
        return;
    }

    try {
        const res = await fetch(`http://localhost:8080/admin/posts/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (res.ok) {
            // Remove from state locally
            setPosts(posts.filter((post) => post.id !== id));
            // Update stats locally (simple approximation)
            // Or just re-fetch stats? Re-fetching is safer.
            // For now, let's just decrement total locally to be snappy.
            // But we don't know if it was draft or published without checking post object.
            // Let's refetch stats.
            const statsRes = await fetch("http://localhost:8080/admin/stats", { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            if (statsRes.ok) {
                setStats(await statsRes.json());
            }
        } else {
            alert("Failed to delete post");
        }
    } catch (error) {
        console.error("Delete failed", error);
        alert("Error deleting post");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

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
            <p className="text-3xl font-bold mt-2">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Published</h3>
            <p className="text-3xl font-bold mt-2 text-green-600">
              {stats.published}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Drafts</h3>
            <p className="text-3xl font-bold mt-2 text-yellow-600">
              {stats.draft}
            </p>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-lg">Recent Posts</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Created Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <Link href={`/posts/${post.id}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-500 capitalize">
                      {post.type} {post.sub_type ? `(${post.sub_type})` : ''}
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link 
                        href={`/admin/edit/${post.id}`}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Edit
                      </Link>
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
