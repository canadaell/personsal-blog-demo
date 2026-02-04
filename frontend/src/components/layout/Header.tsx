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

import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
// Using a book icon for Rednote (Little Red Book) as a placeholder, or you can import a specific icon if available
import { BiBookHeart } from "react-icons/bi"; 

const socialLinks = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/ryanc37.5?igsh=MWxpNTViY3AwOWFxeA%3D%3D&utm_source=qr",
    icon: <FaInstagram className="w-5 h-5" />,
  },
  {
    name: "Rednote",
    url: "https://xhslink.com/m/66EWUiDEhfK",
    icon: <BiBookHeart className="w-5 h-5" />, // Placeholder for Rednote
  },
  {
    name: "GitHub",
    url: "https://github.com/canadaell",
    icon: <FaGithub className="w-5 h-5" />,
  },
  {
    name: "LinkedIn",
    url: "#",
    icon: <FaLinkedin className="w-5 h-5" />,
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
                    &quot;Debug code, and debug myself.&quot;
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
                                className={`pb-2 text-sm md:text-base transition-colors duration-200 ${pathname === item.path
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
                                {link.icon}
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
                                    className={`text-lg transition-colors duration-200 ${pathname === item.path
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


