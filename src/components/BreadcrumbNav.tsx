import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  id: string;
  icon?: React.ReactNode;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  activeItem: string;
  onNavigate: (id: string) => void;
  className?: string;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  items,
  activeItem,
  onNavigate,
  className = ''
}) => {
  return (
    <nav className={`flex items-center space-x-2 ${className}`} aria-label="Breadcrumb">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-2"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-1 text-foreground/60 hover:text-foreground transition-colors rounded-full px-3 py-1"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm font-elegant">Home</span>
        </Button>
        
        {items.length > 0 && (
          <ChevronRight className="w-4 h-4 text-foreground/40" />
        )}
      </motion.div>

      <div className="flex items-center space-x-2">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-2"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(item.id)}
              className={`flex items-center space-x-1 transition-colors rounded-full px-3 py-1 ${
                item.id === activeItem
                  ? 'text-primary bg-primary/10 font-semibold'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              {item.icon && <span className="w-4 h-4">{item.icon}</span>}
              <span className="text-sm font-elegant">{item.label}</span>
            </Button>
            
            {index < items.length - 1 && (
              <ChevronRight className="w-4 h-4 text-foreground/40" />
            )}
          </motion.div>
        ))}
      </div>
    </nav>
  );
};

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  activeSection: string;
  onNavigate: (id: string) => void;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  breadcrumbs = [],
  activeSection,
  onNavigate,
  className = ''
}) => {
  return (
    <div className={`mb-8 sm:mb-12 ${className}`}>
      {/* Breadcrumb Navigation */}
      {breadcrumbs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <BreadcrumbNav
            items={breadcrumbs}
            activeItem={activeSection}
            onNavigate={onNavigate}
          />
        </motion.div>
      )}

      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <div className="flex items-center justify-center mb-4">
          {icon && (
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mr-4 text-primary"
            >
              {icon}
            </motion.div>
          )}
          <h1 className="font-accent text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-romantic-3d text-title-3d">
            {title}
          </h1>
          {icon && (
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="ml-4 text-primary"
            >
              {icon}
            </motion.div>
          )}
        </div>
        
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-foreground/80 font-elegant max-w-2xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
        
        {/* Decorative line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mt-6 max-w-xs mx-auto"
        />
      </motion.div>
    </div>
  );
};

interface QuickNavigationProps {
  sections: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    description?: string;
  }>;
  activeSection: string;
  onNavigate: (id: string) => void;
  className?: string;
}

export const QuickNavigation: React.FC<QuickNavigationProps> = ({
  sections,
  activeSection,
  onNavigate,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {sections.map((section, index) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="ghost"
            onClick={() => onNavigate(section.id)}
            className={`w-full h-auto p-4 flex flex-col items-center space-y-2 rounded-xl transition-all duration-300 ${
              section.id === activeSection
                ? 'bg-primary/10 text-primary border-primary/20 border-2'
                : 'hover:bg-primary/5 hover:scale-105'
            }`}
          >
            <div className="text-2xl">{section.icon}</div>
            <div className="text-center">
              <div className="font-elegant font-semibold text-sm">{section.label}</div>
              {section.description && (
                <div className="text-xs text-foreground/60 mt-1">{section.description}</div>
              )}
            </div>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};
