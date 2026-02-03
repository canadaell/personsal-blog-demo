"use client";

import React, { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "Tech Notes", path: "/tech-notes" },
  { name: "CV", path: "/cv" },
  { name: "PLOG", path: "/plog" },
  { name: "About me", path: "/about-me" },
];

const socialLinks = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/ryanc37.5?igsh=MWxpNTViY3AwOWFxeA%3D%3D&utm_source=qr",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    name: "Rednote", // Placeholder icon (Book)
    url: "https://xhslink.com/m/66EWUiDEhfK",
    path: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 17v-13H20M6.5 17l11.5 1.5M20 4v14.5",
    viewBox: "0 0 24 24",
    stroke: true,
  },
  {
    name: "GitHub",
    url: "https://github.com/canadaell",
    path: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
  },
  {
    name: "LinkedIn",
    url: "#",
    path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
  },
];

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* Header Section */}
            <header className="mb-12 md:mb-16">
                <h1 className="text-4xl font-semibold text-gray-900 mb-3 tracking-tight">
                    Another Mingde
                </h1>
                <p className="text-gray-500 italic font-serif text-sm md:text-base">
                    "Debug code, and debug myself."
                </p>
            </header>

            {/* Navigation Bar Container */}
            <div className="flex flex-row items-center justify-between border-gray-200 mb-16">
                {/* Left Side: Mobile Menu Button & Desktop Nav */}
                <div className="flex items-center">
                    {/* Mobile Menu Button - Visible Only on Mobile */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="md:hidden p-2 -ml-2 mr-2 text-gray-600 hover:text-black focus:outline-none"
                        aria-label="Open menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    {/* Desktop Navigation - Hidden on Mobile */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {categories.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`pb-2 text-sm md:text-base transition-colors duration-200 ${
                                    pathname === item.path
                                        ? "font-semibold text-gray-900 border-b-2 border-gray-900"
                                        : "text-gray-500 hover:text-gray-800"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right Side: Social Icons & Search - Always Visible */}
                <div className="flex items-center space-x-4 md:space-x-6">
                    {/* Social Icons */}
                    <div className="flex items-center space-x-2 md:space-x-4">
                        {socialLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-black transition-colors"
                                title={link.name}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill={link.stroke ? "none" : "currentColor"}
                                    stroke={link.stroke ? "currentColor" : "none"}
                                    viewBox={link.viewBox || "0 0 24 24"}
                                    xmlns="http://www.w3.org/2000/svg"
                                    strokeWidth={link.stroke ? 2 : 0}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d={link.path} />
                                </svg>
                            </a>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder=""
                            className="w-20 md:w-24 border-b border-gray-200 focus:w-32 md:focus:w-40 bg-transparent transition-all outline-none"
                        />
                        <svg
                            className="w-4 h-4 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar (Drawer) */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/20 transition-opacity"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Sidebar Content */}
                    <aside className="relative w-64 max-w-[80vw] bg-[#faf6f1] h-full shadow-2xl p-6 flex flex-col transform transition-transform duration-300 ease-in-out">
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-lg font-semibold text-gray-900">Menu</span>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 text-gray-500 hover:text-black"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <nav className="flex flex-col space-y-6">
                            {categories.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    className={`text-lg transition-colors duration-200 ${
                                        pathname === item.path
                                            ? "font-semibold text-gray-900"
                                            : "text-gray-500 hover:text-gray-800"
                                        }`}
                                    onClick={() => setIsMenuOpen(false)} // Close menu on click
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-auto pt-8 border-t border-gray-200 text-sm text-gray-400">
                            <p>&copy; {new Date().getFullYear()} Another Mingde</p>
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
};
