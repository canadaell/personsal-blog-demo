import React from "react";

export const Footer = () => {
    return (
        <footer className="mt-20 pt-8 border-t border-gray-200 flex flex-col items-center justify-center text-sm text-gray-400 space-y-2">
            <p className="font-serif italic">"Stay hungry, stay foolish."</p>
            <p>© {new Date().getFullYear()} Another Mingde. All rights reserved.</p>
        </footer>
    );
};
