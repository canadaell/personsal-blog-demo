import React from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { MainLayout } from "@/components/layout/MainLayout";
import { buildBackendURL } from "@/lib/server/backend";

// Define the shape of data from API
interface Post {
  id: string;
  type: string;
  sub_type?: string;
  title: string;
  summary: string;
  published_at: string;
}

interface ApiResponse {
  data: Post[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

// Function to fetch posts from backend
async function getPlogPosts(): Promise<Post[]> {
  try {
    // Add type=plog query param
    const res = await fetch(buildBackendURL("/posts?type=plog"), {
      cache: "no-store", 
    });

    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }

    const json: ApiResponse = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

function formatDate(isoString: string) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatCategory(type: string, subType?: string) {
  if (type === 'plog') return 'PLOG';
  
  if (type === 'article') {
    if (subType === 'tech') return 'Tech notes';
    if (subType === 'life') return 'Life';
    return 'Essay';
  }
  if (type === 'project') return 'PROJECT';
  return type.toUpperCase();
}

export default async function Plog() {
  const posts = await getPlogPosts();

  return (
    <MainLayout>
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 border-b pb-4 border-gray-200">
          Daily Plog
        </h2>
        
        {/* Plog List */}
        <div className="space-y-12">
           {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>No plogs found.</p>
            </div>
          ) : (
            posts.map((post) => (
              <ArticleCard
                key={post.id}
                id={post.id}
                date={formatDate(post.published_at)}
                category={formatCategory(post.type, post.sub_type)}
                title={post.title}
                summary={post.summary}
              />
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
