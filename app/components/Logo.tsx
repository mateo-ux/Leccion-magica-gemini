import React from 'react';

const colombianColors = {
    blue: '#1E3A8A',
    yellow: '#F59E0B',
    red: '#EF4444',
};

export default function Logo() {
    return (
        <div className="flex items-center space-x-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M14.5 3.5C14.5 3.5 15.5 6 18 6C20.5 6 21.5 3.5 21.5 3.5"
                    stroke={colombianColors.yellow}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M18 6V1M18 11V8"
                    stroke={colombianColors.yellow}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M16 22.5H8C4.5 22.5 2 20 2 16.5V7.5C2 4 4.5 1.5 8 1.5H12"
                    stroke={colombianColors.blue}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M13 12H5"
                    stroke={colombianColors.red}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M10 16.5H5"
                    stroke={colombianColors.red}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M10 7.5H5"
                    stroke={colombianColors.red}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <span className="font-bold text-xl text-gray-800 dark:text-white">
                Lección Mágica
            </span>
        </div>
    );
}