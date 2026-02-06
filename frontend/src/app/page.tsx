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
async function getPosts(): Promise<Post[]> {
  // Prevent caching for now so you see updates immediately (for dev)
  // In production, you might want revalidate: 60 etc.
  try {
    const res = await fetch(buildBackendURL("/posts"), {
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

// Helper to format date: "2026-02-02T..." -> "2026/02/02"
function formatDate(isoString: string) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// Helper to map type/subtype to display category
function formatCategory(type: string, subType?: string) {
  if (type === 'article') {
    if (subType === 'tech') return 'Tech note';
    if (subType === 'life') return 'Life';
    return 'Essay';
  }
  if (type === 'plog') return 'PLOG';
  if (type === 'project') return 'PROJECT';
  return type.toUpperCase();
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <MainLayout>

      {/* Blog Post List */}
      <main className="space-y-16">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>还没有发布任何文章...</p>
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
      </main>
    </MainLayout>
  );
}
