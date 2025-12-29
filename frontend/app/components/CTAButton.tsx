'use client'

import React from 'react';
import { motion } from 'framer-motion';

interface CTAButtonProps {
    children: React.ReactNode;
    primary?: boolean;
    onClick?: () => void;
    className?: string;
}

export default function CTAButton({
    children,
    primary = false,
    onClick,
    className = ''
}: CTAButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${primary
                    ? 'bg-[#1E3A8A] text-white hover:bg-blue-800'
                    : 'bg-white text-[#1E3A8A] hover:bg-gray-100'
                } ${className}`}
        >
            {children}
        </motion.button>
    );
}