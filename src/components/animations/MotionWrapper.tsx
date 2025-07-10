"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface MotionWrapperProps {
  children: React.ReactNode;
  className?: string;
  variant?: "fadeIn" | "fadeInUp" | "slideIn" | "scaleIn";
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

export function MotionWrapper({
  children,
  className = "",
  variant = "fadeInUp",
  delay = 0,
  duration = 0.4,
  threshold = 0.1,
  triggerOnce = true,
}: MotionWrapperProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: triggerOnce,
    margin: "-100px",
    amount: threshold,
  });

  const getVariantProps = () => {
    switch (variant) {
      case "fadeIn":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        };
      case "fadeInUp":
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
        };
      case "slideIn":
        return {
          initial: { opacity: 0, x: -100 },
          animate: { opacity: 1, x: 0 },
        };
      case "scaleIn":
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
        };
      default:
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
        };
    }
  };

  const variantProps = getVariantProps();

  return (
    <motion.div
      ref={ref}
      initial={variantProps.initial}
      animate={isInView ? variantProps.animate : variantProps.initial}
      transition={{ delay, duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggeredMotionWrapper({
  children,
  className = "",
  staggerDelay = 0.1,
  initialDelay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-50px",
    amount: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ delay: initialDelay }}
      className={className}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ 
              delay: initialDelay + (index * staggerDelay),
              duration: 0.4,
              ease: "easeOut"
            }}
          >
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ 
            delay: initialDelay,
            duration: 0.4,
            ease: "easeOut"
          }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}