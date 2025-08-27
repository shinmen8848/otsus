import { useState, Suspense, lazy } from 'react';
import { EnhancedFloralElements } from '@/components/EnhancedFloralElements';
import { Navigation } from '@/components/Navigation';
import { MobileOptimized } from '@/components/MobileOptimized';
import { PageTransition } from '@/components/PageTransition';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { MemoriesSection } from '@/components/sections/MemoriesSection';
import { JournalSection } from '@/components/sections/JournalSection';
// Lazy load the color grading section for better performance
const ColorGradingSection = lazy(() => import('@/components/sections/ColorGradingSection').then(module => ({ default: module.ColorGradingSection })));
import { AnimeTracker } from '@/components/sections/AnimeSection';
import { InteractiveGames } from '@/components/sections/InteractiveGames';
import { InteractiveTimeline } from '@/components/InteractiveTimeline';
import { FutureDreams } from '@/components/FutureDreams';
import { AISection } from '@/components/sections/AISection';
import { PremiumSection } from '@/components/sections/PremiumSection';
import { UIShowcaseSection } from '@/components/sections/UIShowcaseSection';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  const handleExplore = () => {
    setActiveSection('tomoe');
  };

  const getSectionTitle = (section: string) => {
    const titles = {
      home: 'Our Love Journey',
      tomoe: 'About Tomoe',
      nanami: 'About Nanami', 
      memories: 'Our Memories',
      story: 'Anime & Drama',
      timeline: 'Love Timeline',
      dreams: 'Our Dreams',
      interactive: 'Interactive Games',
      ai: 'AI Assistant',
      premium: 'Premium Suite',
      anniversary: 'Milestones',
      notes: 'Love Journal',
      showcase: 'UI Showcase'
    };
    return titles[section as keyof typeof titles] || 'Tomoe & Nanami';
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HeroSection onExplore={handleExplore} />;
      case 'tomoe':
        return <AboutSection person="tomoe" />;
      case 'nanami':
        return <AboutSection person="nanami" />;
      case 'memories':
        return <MemoriesSection />;
      case 'story':
        return <AnimeTracker />;
      case 'timeline':
        return <InteractiveTimeline />;
      case 'dreams':
        return <FutureDreams />;
      case 'interactive':
        return <InteractiveGames />;
      case 'ai':
        return <AISection />;
      case 'premium':
        return <PremiumSection isPremiumUser={true} />;
      case 'anniversary':
        return (
          <section className="min-h-screen flex items-center justify-center py-24 px-6 bg-gradient-to-br from-primary/20 to-secondary/20 relative">
            <div className="absolute inset-0 bg-floral-pattern opacity-50" />
            <div className="text-center max-w-3xl relative z-10">
              <h2 className="font-accent text-6xl font-bold text-gradient-romantic-3d text-title-3d mb-8">
                Anniversary Hub
              </h2>
              <p className="text-2xl text-foreground/80 mb-12 font-elegant font-medium text-enhanced">
                Celebrating every milestone and special moment - Coming Soon!
              </p>
              <div className="glass-romantic-3d p-10 rounded-3xl">
                <p className="text-foreground/80 leading-relaxed text-lg font-elegant text-enhanced">
                  "Here we'll track our anniversaries, celebrate achievements, 
                  and plan future milestones that mark our incredible journey together."
                </p>
              </div>
            </div>
          </section>
        );
      case 'notes':
        return <JournalSection />;
      case 'showcase':
        return <UIShowcaseSection />;
      case 'color-grading':
        return (
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground font-elegant">Loading Color Grading Studio...</p>
              </div>
            </div>
          }>
            <ColorGradingSection />
          </Suspense>
        );
      default:
        return <HeroSection onExplore={handleExplore} />;
    }
  };

  return (
    <MobileOptimized
      title={getSectionTitle(activeSection)}
      showShareButton={true}
      onShare={() => {
        // Handle sharing the current section
        console.log('Sharing section:', activeSection);
      }}
    >
      <div className="relative min-h-screen bg-cherry-garden">
        <EnhancedFloralElements />
        <Navigation
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        <main className="relative z-20">
          <PageTransition pageKey={activeSection}>
            {renderSection()}
          </PageTransition>
        </main>
      </div>
    </MobileOptimized>
  );
};

export default Index;
