import React from "react";
import Link from "next/link";

interface ArticleCardProps {
  id: string; // Add ID
  date: string;
  category: string;
  title: string;
  summary: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  date,
  category,
  title,
  summary,
}) => {
  return (
    <Link href={`/posts/${id}`} className="block group">
      <article>
        <div className="flex items-center space-x-3 text-xs md:text-sm text-gray-400 mb-2 font-mono">
          <span>{date}</span>
          <span className="w-8 h-[1px] bg-gray-300"></span>
          <span>{category}</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-black transition-colors">
          {title}
        </h2>

        <p className="text-gray-500 text-sm md:text-base leading-relaxed line-clamp-3">
          {summary}
        </p>
      </article>
    </Link>
  );
};
