import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const Logo = ({ className = "" }) => {
    const text = "MAAN-verse";

    // Split text into array of characters
    const letters = text.split("");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            x: -20,
            y: 10,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <motion.div
                initial={{ rotate: -10, y: 0 }}
                animate={{
                    rotate: [0, -10, 0, 10, 0],
                    y: [0, -2, 0, -2, 0]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative z-10"
            >
                <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg shadow-lg shadow-primary/30">
                    <GraduationCap className="text-white w-6 h-6 md:w-8 md:h-8" />
                </div>
            </motion.div>

            <motion.div
                className="flex overflow-hidden"
                variants={container}
                initial="hidden"
                animate="visible"
            >
                {letters.map((letter, index) => (
                    <motion.span
                        key={index}
                        variants={child}
                        className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-300"
                    >
                        {letter}
                    </motion.span>
                ))}
            </motion.div>
        </div>
    );
};

export default Logo;
