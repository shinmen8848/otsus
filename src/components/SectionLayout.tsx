import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/BreadcrumbNav';
import { SectionTransition } from '@/components/PageTransition';

interface BreadcrumbItem {
  label: string;
  id: string;
  icon?: React.ReactNode;
}

interface SectionLayoutProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  activeSection: string;
  onNavigate?: (id: string) => void;
  children: React.ReactNode;
  className?: string;
  backgroundVariant?: 'default' | 'sunset' | 'aurora' | 'garden';
  showHeader?: boolean;
}

export const SectionLayout: React.FC<SectionLayoutProps> = ({
  title,
  subtitle,
  icon,
  breadcrumbs = [],
  activeSection,
  onNavigate = () => {},
  children,
  className = '',
  backgroundVariant = 'default',
  showHeader = true
}) => {
  const getBackgroundClass = () => {
    switch (backgroundVariant) {
      case 'sunset':
        return 'bg-romantic-sunset';
      case 'aurora':
        return 'bg-dreamy-aurora';
      case 'garden':
        return 'bg-cherry-garden';
      default:
        return 'bg-cherry-garden';
    }
  };

  return (
    <SectionTransition>
      <section className={`min-h-screen py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${getBackgroundClass()} ${className}`}>
        {/* Background Elements */}
        <div className="absolute inset-0 bg-floral-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/5 to-background/20" />
        
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-4 h-4 bg-romantic-rose rounded-full opacity-40"
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-3 h-3 bg-romantic-blush rounded-full opacity-50"
            animate={{
              y: [0, -15, 0],
              opacity: [0.5, 0.9, 0.5],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute bottom-40 left-20 w-5 h-5 bg-romantic-lavender rounded-full opacity-30"
            animate={{
              y: [0, -25, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section Header */}
          {showHeader && (
            <SectionHeader
              title={title}
              subtitle={subtitle}
              icon={icon}
              breadcrumbs={breadcrumbs}
              activeSection={activeSection}
              onNavigate={onNavigate}
            />
          )}

          {/* Main Content */}
          <div className="relative">
            {children}
          </div>
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
      </section>
    </SectionTransition>
  );
};

interface ContentCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'sunset' | 'dreamy' | 'romantic';
  delay?: number;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  children,
  className = '',
  variant = 'default',
  delay = 0
}) => {
  const getCardClass = () => {
    switch (variant) {
      case 'sunset':
        return 'card-romantic-sunset';
      case 'dreamy':
        return 'card-romantic-dreamy';
      case 'romantic':
        return 'card-romantic-3d romantic-glow';
      default:
        return 'card-romantic-3d';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={`${getCardClass()} ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface GridLayoutProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  columns = 2,
  gap = 'md',
  className = ''
}) => {
  const getGridClass = () => {
    const colClass = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }[columns];

    const gapClass = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8'
    }[gap];

    return `grid ${colClass} ${gapClass}`;
  };

  return (
    <div className={`${getGridClass()} ${className}`}>
      {children}
    </div>
  );
};

interface FlexLayoutProps {
  children: React.ReactNode;
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  gap?: 'sm' | 'md' | 'lg';
  wrap?: boolean;
  className?: string;
}

export const FlexLayout: React.FC<FlexLayoutProps> = ({
  children,
  direction = 'row',
  align = 'start',
  justify = 'start',
  gap = 'md',
  wrap = false,
  className = ''
}) => {
  const getFlexClass = () => {
    const dirClass = direction === 'col' ? 'flex-col' : 'flex-row';
    const alignClass = `items-${align}`;
    const justifyClass = `justify-${justify}`;
    const gapClass = {
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6'
    }[gap];
    const wrapClass = wrap ? 'flex-wrap' : '';

    return `flex ${dirClass} ${alignClass} ${justifyClass} ${gapClass} ${wrapClass}`;
  };

  return (
    <div className={`${getFlexClass()} ${className}`}>
      {children}
    </div>
  );
};
