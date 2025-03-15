
// Animation variants for framer-motion
export const fadeIn = (direction: 'up' | 'down' | 'left' | 'right' | 'none' = 'none', delay = 0) => {
  return {
    hidden: {
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
      opacity: 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        duration: 0.8,
        delay,
      },
    },
  };
};

// Map for CSS animation classes
export const animationClasses = {
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  scaleIn: 'animate-scale-in',
  blurIn: 'animate-blur-in',
};

// Function to add multiple animation classes with delays
export function withDelay(animationClass: string, delayMs: number): string {
  return `${animationClass} transition-all duration-300 ease-out` + 
    (delayMs ? ` delay-[${delayMs}ms]` : '');
}

// Utility to create staggered animations for lists
export function staggerChildren(baseDelay = 100, increment = 100) {
  return (index: number) => baseDelay + (index * increment);
}
