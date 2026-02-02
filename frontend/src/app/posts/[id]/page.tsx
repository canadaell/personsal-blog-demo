import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import TiptapViewer from "@/components/editor/TiptapViewer";
import Link from "next/link";

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Fetch single post
async function getPost(id: string) {
  console.log("Fetching post ID:", id); // Debug Log
  try {
    const res = await fetch(`http://127.0.0.1:8080/posts/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch post");
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return null;
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

export default async function PostPage(props: PostPageProps) {
  const params = await props.params;
  const post = await getPost(params.id);

  if (!post) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold">Post Not Found</h1>
          <p className="text-gray-500 mt-2">ID: {params.id}</p>
          <Link href="/" className="text-blue-600 mt-4 block">
            Return Home
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <article className="max-w-3xl mx-auto py-12 px-6">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="text-sm text-gray-500 mb-3 space-x-2">
            <span>{formatDate(post.published_at)}</span>
            <span>·</span>
            <span className="uppercase tracking-wider">{post.type}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          {post.summary && (
            <p className="text-lg text-gray-600 italic max-w-2xl mx-auto">
              {post.summary}
            </p>
          )}
        </header>

        {/* Content */}
        <div className="mt-8">
           <TiptapViewer content={post.content} />
        </div>
      </article>
    </MainLayout>
  );
}
