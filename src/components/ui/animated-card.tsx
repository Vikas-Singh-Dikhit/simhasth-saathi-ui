import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className,
  hover = true,
  delay = 0,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={hover ? { y: -2, scale: 1.01 } : {}}
      className="w-full"
    >
      <Card
        className={cn(
          'transition-all duration-200 hover:shadow-lg border-card-border bg-card/95 backdrop-blur-sm',
          className
        )}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
};