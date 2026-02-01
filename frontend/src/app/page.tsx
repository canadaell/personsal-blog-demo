import React from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { MainLayout } from "@/components/layout/MainLayout";

// Mock Data mimicking the screenshot
const posts = [
  {
    id: 1,
    date: "2026/01/30",
    category: "分享热爱",
    title: "Bartender 的替代品",
    summary:
      "之前写过一篇文章介绍我的菜单栏配置：一点点展开我的 macOS，那时我还很喜欢 Bartender。macOS Tahoe 更新重写了菜单栏相关的底层交互逻辑，很多第三方菜单栏管理软件开始频繁出问题，直到现在 Bartender 依然偶尔会崩溃。自从被收购之后，Bartender 的稳定性肉眼可见地下滑，慢慢降...",
  },
  {
    id: 2,
    date: "2026/01/26",
    category: "杂文随笔",
    title: "在 AI 浪潮中迷失的 Setapp",
    summary:
      "引 看到 Setapp 要求新上架的软件具备 AI 功能，忍不住吐槽几句。过去两年上线的新工具里，我印象较好的有 LookAway、Bike、Strongbox、Supercharge、Muse 和 Spark。它们的共同特点是：用途明确，解决实际问题。都不以 AI 为主。期间 Setapp 接连上架了一批评分低、用途模糊的 AI 软...",
  },
  {
    id: 3,
    date: "2026/01/25",
    category: "分享热爱",
    title: "再谈 iA Writer",
    summary:
      "引 去年写过一篇文章聊 iA Writer 的手感，但它的优秀之处不仅于此。iA Writer 与 Obsidian 这种偏重的笔记软件不同，定位在 Apple Notes、Typora、Drafts、FSNotes 这类轻输入编辑器之间，解决的是一个具体问题：舒适的用 Markdown 在 iOS、iPadOS 和 macOS 写作，本地优先，轻量易用...",
  },
  {
    id: 4,
    date: "2026/01/18",
    category: "分享热爱",
    title: "Plog 5 生活中的一点橙",
    summary:
      "最近发现自己除了黑白灰，还对橙色有一些偏爱，点缀在生活中的一些小物件上。",
  },
];

export default function Home() {
  return (
    <MainLayout>
      {/* Blog Post List */}
      <main className="space-y-16">
        {posts.map((post) => (
          <ArticleCard
            key={post.id}
            date={post.date}
            category={post.category}
            title={post.title}
            summary={post.summary}
          />
        ))}
      </main>
    </MainLayout>
  );
}
