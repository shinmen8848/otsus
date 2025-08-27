import { RelationshipCounter } from '@/components/RelationshipCounter';
import { Button } from '@/components/ui/button';
import { RomanticButton, SunsetRomanticButton, ElegantPearlButton } from '@/components/ui/romantic-button';
import { SakuraPetals } from '@/components/ui/SakuraPetals';
import { FloatingHearts, RomanticTrail } from '@/components/FloatingHearts';
import { Heart, ArrowDown, Sparkles } from 'lucide-react';
// Using CSS background images instead of imports for better performance

interface HeroSectionProps {
  onExplore: () => void;
}

export const HeroSection = ({ onExplore }: HeroSectionProps) => {
  return (
    <RomanticTrail enabled>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-romantic-pearl">
        {/* Sophisticated Background Layers */}
        <div className="absolute inset-0 bg-hero-background bg-cover bg-center bg-no-repeat opacity-20" />
        <div className="absolute inset-0 bg-cherry-tulip bg-cover bg-center bg-no-repeat opacity-15" />
        <div className="absolute inset-0 bg-floral-pattern opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/3 to-background/20" />

        {/* Enhanced Floating Hearts Animation */}
        <FloatingHearts count={15} romantic className="opacity-60" />
        <SakuraPetals count={8} intensity="light" enabled />

        {/* Sophisticated floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-6 h-6 bg-romantic-rose rounded-full elegant-fade-in romantic-breathe opacity-50" style={{animationDelay: '0s'}} />
          <div className="absolute top-40 right-20 w-4 h-4 bg-romantic-blush rounded-full elegant-fade-in romantic-breathe opacity-60" style={{animationDelay: '2s'}} />
          <div className="absolute bottom-40 left-20 w-8 h-8 bg-romantic-lavender rounded-full elegant-fade-in romantic-breathe opacity-40" style={{animationDelay: '4s'}} />
          <div className="absolute bottom-60 right-10 w-3 h-3 bg-romantic-peach rounded-full elegant-fade-in romantic-breathe opacity-70" style={{animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-1/4 w-5 h-5 bg-romantic-champagne rounded-full elegant-fade-in romantic-breathe opacity-45" style={{animationDelay: '3s'}} />
          <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-romantic-mauve rounded-full elegant-fade-in romantic-breathe opacity-55" style={{animationDelay: '5s'}} />
        </div>

      {/* Sophisticated Content - Enhanced Typography */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-12 lg:mb-16 elegant-fade-in">
          <h1 className="font-romantic text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-romantic mb-4 sm:mb-6 lg:mb-8 drop-shadow-2xl romantic-breathe">
            Tomoe & Nanami
          </h1>
          <div className="relative">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-elegant font-elegant font-medium max-w-4xl mx-auto leading-relaxed px-2 sm:px-4 elegant-slide-up">
              A love story written in cherry blossoms and painted in sunset hues
            </p>
            <div className="absolute -top-2 -right-2 text-2xl animate-pulse">✨</div>
          </div>
          <div className="mt-6 sm:mt-8 flex justify-center items-center space-x-3 sm:space-x-4">
            <span className="text-2xl sm:text-3xl lg:text-4xl gentle-bounce">💕</span>
            <span className="text-xl sm:text-2xl lg:text-3xl font-script text-script">Forever</span>
            <span className="text-2xl sm:text-3xl lg:text-4xl gentle-bounce" style={{animationDelay: '0.5s'}}>🌸</span>
            <span className="text-xl sm:text-2xl lg:text-3xl font-script text-script">Together</span>
            <span className="text-2xl sm:text-3xl lg:text-4xl gentle-bounce" style={{animationDelay: '1s'}}>💖</span>
          </div>
        </div>

        {/* Enhanced Relationship Counter */}
        <div className="mb-12 sm:mb-16">
          <RelationshipCounter />
        </div>

        {/* Enhanced CTA Buttons with New Variants */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-10 justify-center items-center px-4 sm:px-6">
          <RomanticButton
            onClick={onExplore}
            variant="sunset"
            size="lg"
            icon={<Heart className="w-5 h-5 sm:w-6 sm:h-6" />}
            iconPosition="left"
            romantic
            shimmer
            className="w-full sm:w-auto min-w-[200px] elegant-fade-in"
          >
            <span className="font-elegant font-semibold">Explore Our Journey</span>
          </RomanticButton>

          <RomanticButton
            variant="aurora"
            size="lg"
            icon={<Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />}
            iconPosition="left"
            romantic
            glow
            className="w-full sm:w-auto min-w-[180px] elegant-fade-in"
            style={{animationDelay: '0.2s'}}
          >
            <span className="font-elegant font-semibold">Our Love Story</span>
          </RomanticButton>

          <RomanticButton
            variant="garden"
            size="md"
            icon={<ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />}
            iconPosition="right"
            sparkles
            className="w-full sm:w-auto elegant-fade-in"
            style={{animationDelay: '0.4s'}}
          >
            <span className="font-elegant">Discover More</span>
          </RomanticButton>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="glass-romantic-3d p-4 rounded-full">
            <ArrowDown className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Enhanced Decorative Elements with cherry blossoms and tulips */}
      <div className="absolute top-20 left-10 w-24 h-24 sakura-petal opacity-40 shadow-3d-soft"></div>
      <div className="absolute top-40 right-20 w-20 h-20 tulip-petal opacity-50 shadow-3d-soft"></div>
      <div className="absolute bottom-40 left-20 w-28 h-28 sakura-petal opacity-35 shadow-3d-soft"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 tulip-petal opacity-45 shadow-3d-soft"></div>
      <div className="absolute bottom-1/3 left-1/3 w-18 h-18 sakura-petal opacity-50 shadow-3d-soft"></div>
      <div className="absolute top-2/3 right-1/3 w-22 h-22 tulip-petal opacity-40 shadow-3d-soft"></div>
    </section>
    </RomanticTrail>
  );
};