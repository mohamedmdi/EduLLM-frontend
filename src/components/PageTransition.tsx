"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,      transition: {
        duration: 0.3,
      },
    },
  };
  const childVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="min-h-screen"
      >
        <motion.div variants={childVariants}>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Component for animating individual sections
export function AnimatedSection({ 
  children, 
  delay = 0,
  className = ""
}: { 
  readonly children: ReactNode; 
  readonly delay?: number;
  readonly className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Component for hover animations
export function HoverCard({ 
  children, 
  className = "",
  scale = 1.02
}: { 
  readonly children: ReactNode; 
  readonly className?: string;
  readonly scale?: number;
}) {
  return (
    <motion.div
      whileHover={{ 
        scale,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Loading animation for buttons
export function AnimatedButton({ 
  children, 
  className = "",
  isLoading = false,
  ...props
}: { 
  readonly children: ReactNode; 
  readonly className?: string;
  readonly isLoading?: boolean;
  readonly [key: string]: unknown;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={isLoading ? { scale: [1, 1.02, 1] } : {}}
      transition={{ 
        duration: isLoading ? 1 : 0.2,
        repeat: isLoading ? Infinity : 0,
        ease: "easeInOut"
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}
