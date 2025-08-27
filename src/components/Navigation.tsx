import { Heart, User, Camera, Star, Calendar, MapPin, Gamepad2, Trophy, BookOpen, Sparkles, Brain, Crown, Menu, X, Palette, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Navigation = ({ activeSection, onSectionChange }: NavigationProps) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'Home', icon: Heart, category: 'main' },
    { id: 'tomoe', label: 'Tomoe', icon: User, category: 'main' },
    { id: 'nanami', label: 'Nanami', icon: User, category: 'main' },
    { id: 'memories', label: 'Memories', icon: Camera, category: 'main' },
    { id: 'color-grading', label: 'Color Studio', icon: Palette, category: 'content' },
    { id: 'story', label: 'Anime & Drama', icon: Star, category: 'content' },
    { id: 'timeline', label: 'Timeline', icon: Calendar, category: 'content' },
    { id: 'dreams', label: 'Dreams', icon: MapPin, category: 'content' },
    { id: 'interactive', label: 'Games', icon: Gamepad2, category: 'content' },
    { id: 'ai', label: 'AI Assistant', icon: Brain, category: 'features' },
    { id: 'premium', label: 'Premium', icon: Crown, category: 'features' },
    { id: 'anniversary', label: 'Milestones', icon: Trophy, category: 'features' },
    { id: 'notes', label: 'Journal', icon: BookOpen, category: 'features' },
    { id: 'showcase', label: 'UI Showcase', icon: Layers, category: 'features' },
  ];
  
  const mainItems = navItems.filter(item => item.category === 'main');
  const otherItems = navItems.filter(item => item.category !== 'main');

  return (
    <>
      {/* Sophisticated Desktop Navigation */}
      <nav className="hidden lg:flex fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="card-elegant-pearl px-10 py-5 romantic-shimmer">
          <div className="flex items-center space-x-10">
            <div className="font-romantic text-xl font-bold text-romantic flex items-center space-x-3">
              <span className="text-2xl romantic-breathe">💕</span>
              <span className="elegant-fade-in">Tomoe & Nanami</span>
              <span className="text-2xl romantic-breathe" style={{animationDelay: '1s'}}>💕</span>
            </div>
            <div className="flex items-center space-x-4">
              {mainItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => onSectionChange(item.id)}
                    className={`rounded-full px-6 py-3 font-elegant font-semibold text-sm transition-elegant ${
                      activeSection === item.id
                        ? 'btn-elegant-pearl text-elegant shadow-pearl'
                        : 'text-elegant/70 hover:text-elegant hover:bg-white/30 backdrop-blur-sm hover:shadow-3d-soft hover:btn-romantic-mauve'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
              
              {/* More Menu for Other Items */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="rounded-full px-4 py-2 font-elegant font-semibold text-sm transition-3d text-foreground/80 hover:text-foreground hover:bg-gradient-glass backdrop-blur-sm hover:shadow-3d-soft text-enhanced"
                >
                  <Menu className="w-4 h-4 mr-2" />
                  More
                </Button>
                
                {/* Desktop Dropdown Menu */}
                {showMobileMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-background/95 backdrop-blur-lg border border-border rounded-xl shadow-3d-medium p-2 min-w-[200px] z-50">
                    {otherItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.id}
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onSectionChange(item.id);
                            setShowMobileMenu(false);
                          }}
                          className={`w-full justify-start rounded-lg px-3 py-2 font-elegant font-semibold text-sm transition-3d mb-1 ${
                            activeSection === item.id
                              ? 'bg-3d-primary text-white shadow-3d-medium'
                              : 'text-foreground/80 hover:text-foreground hover:bg-gradient-glass text-enhanced'
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {item.label}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sophisticated Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="card-glass-romantic mx-3 mb-3 px-4 py-4 romantic-shimmer">
          {/* Main Navigation Row - Enhanced Mobile */}
          <div className="grid grid-cols-5 gap-2 mb-3">
            {mainItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onSectionChange(item.id)}
                  className={`flex flex-col items-center justify-center py-4 px-3 rounded-2xl font-elegant font-semibold transition-elegant min-h-[64px] touch-target mobile-touch-feedback ${activeSection === item.id
                      ? 'btn-elegant-pearl text-elegant shadow-pearl scale-105'
                      : 'text-elegant/70 hover:bg-white/20 hover:scale-105 hover:shadow-3d-soft'
                    }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span className="text-[9px] font-semibold leading-tight">{item.label}</span>
                </Button>
              );
            })}
            
            {/* More Button - Enhanced */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl font-elegant font-semibold transition-3d min-h-[60px] touch-target mobile-touch-feedback ${
                showMobileMenu
                  ? 'btn-romantic-dreamy text-white shadow-dreamy scale-105'
                  : 'text-foreground/80 hover:bg-gradient-glass text-enhanced hover:scale-105'
              }`}
            >
              {showMobileMenu ? <X className="w-4 h-4 mb-1" /> : <Menu className="w-4 h-4 mb-1" />}
              <span className="text-[9px] font-semibold leading-tight">More</span>
            </Button>
          </div>
          
          {/* Extended Menu Row - Enhanced */}
          {showMobileMenu && (
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border/30">
              {otherItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onSectionChange(item.id);
                      setShowMobileMenu(false);
                    }}
                    className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl font-elegant font-semibold transition-3d min-h-[60px] touch-target mobile-touch-feedback ${activeSection === item.id
                        ? 'btn-romantic-sunset text-white shadow-romantic-glow scale-105'
                        : 'text-foreground/80 hover:bg-gradient-glass text-enhanced hover:scale-105'
                      }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-[9px] font-semibold leading-tight">{item.label.split(' ')[0]}</span>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};