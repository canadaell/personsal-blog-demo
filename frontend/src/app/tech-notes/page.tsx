import React from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { MainLayout } from "@/components/layout/MainLayout";

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
async function getTechNotes(): Promise<Post[]> {
  try {
    // Add type=article&sub_type=tech
    const res = await fetch("http://127.0.0.1:8080/posts?type=article&sub_type=tech", {
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
  if (type === 'article') {
    if (subType === 'tech') return '技术笔记';
    if (subType === 'life') return '生活随笔';
    return '杂文随笔';
  }
  if (type === 'plog') return 'PLOG';
  if (type === 'project') return 'PROJECT';
  return type.toUpperCase();
}

export default async function TechNotes() {
  const posts = await getTechNotes();

  return (
    <MainLayout>
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 border-b pb-4 border-gray-200">
          Tech Notes
        </h2>
        
        {/* Tech Notes List */}
        <div className="space-y-16">
           {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>No tech notes found.</p>
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
