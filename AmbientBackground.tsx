'use client';

import { motion } from 'framer-motion';

export default function AmbientBackground({ color }: { color?: string }) {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[-1]"
      animate={{
        background: color
          ? `radial-gradient(circle at 50% 50%, ${color}20 0%, transparent 70%)`
          : 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, transparent 70%)',
      }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
  );
}
