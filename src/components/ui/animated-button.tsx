import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps {
  loading?: boolean;
  children: React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  loading = false, 
  children, 
  className,
  disabled,
  ...props 
}) => {
  return (
    <motion.div
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
    >
      <Button
        className={cn('relative overflow-hidden', className)}
        disabled={disabled || loading}
        {...props}
      >
        <motion.span
          className="flex items-center justify-center gap-2"
          animate={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading && (
            <motion.div
              className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}
          {children}
        </motion.span>
      </Button>
    </motion.div>
  );
};