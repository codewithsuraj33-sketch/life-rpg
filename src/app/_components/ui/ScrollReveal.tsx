"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: "up" | "left" | "right" | "scale" | "fade";
  delay?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  animation = "up",
  delay = 0,
  threshold = 0.15,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once && domRef.current) {
              observer.unobserve(domRef.current);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold }
    );

    const currentEl = domRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [threshold, once]);

  const getAnimationClasses = () => {
    switch (animation) {
      case "left":
        return isVisible ? "scroll-visible-left" : "scroll-hidden-left";
      case "right":
        return isVisible ? "scroll-visible-right" : "scroll-hidden-right";
      case "scale":
        return isVisible ? "scroll-visible-scale" : "scroll-hidden-scale";
      case "fade":
        return isVisible ? "opacity-100" : "opacity-0 transition-opacity duration-700";
      case "up":
      default:
        return isVisible ? "scroll-visible" : "scroll-hidden";
    }
  };

  return (
    <div
      ref={domRef}
      className={`will-change-transform ${getAnimationClasses()} ${className}`}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
