import React from 'react';
import { motion } from 'framer-motion';
import { RomanticButton } from '@/components/ui/romantic-button';
import { RomanticInput } from '@/components/ui/romantic-input';
import { RomanticCard } from '@/components/ui/romantic-card';
import { FloatingHearts, SparkleEffect } from '@/components/ui/FloatingHearts';
import { SakuraPetals, RomanticBackground } from '@/components/ui/SakuraPetals';
import { Heart, Star, Sparkles, Flower, Sun, Moon } from 'lucide-react';

export const UIShowcaseSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Enhanced Romantic Background Effects */}
      <RomanticBackground variant="all" intensity="moderate" enabled />
      <FloatingHearts count={3} enabled />
      <SakuraPetals count={12} intensity="light" enabled />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-romantic-fluid font-romantic text-romantic-gradient mb-6">
            Enhanced UI Components
          </h2>
          <p className="text-romantic-fluid text-elegant-shadow max-w-3xl mx-auto">
            Experience our beautifully crafted romantic interface elements with enhanced colors, animations, and interactions.
          </p>
        </motion.div>

        {/* Button Showcase */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-2xl font-romantic text-dreamy-glow mb-8 text-center">
            Enhanced Romantic Buttons
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sunset Romance */}
            <RomanticCard variant="sunset" shimmer glow className="p-6 text-center relative">
              <SparkleEffect count={6} size="sm" enabled />
              <h4 className="text-lg font-elegant mb-4 text-pearl-elegant">Sunset Romance</h4>
              <div className="space-y-4">
                <RomanticButton variant="sunset" size="lg" romantic shimmer>
                  <Heart className="w-5 h-5 mr-2" />
                  Sunset Dreams
                </RomanticButton>
                <RomanticButton variant="sunset" size="md" glow>
                  <Sun className="w-4 h-4 mr-2" />
                  Warm Embrace
                </RomanticButton>
                <RomanticButton variant="sunset" size="sm" sparkles>
                  Golden Hour
                </RomanticButton>
              </div>
            </RomanticCard>

            {/* Aurora Dreams */}
            <RomanticCard variant="aurora" shimmer breathe className="p-6 text-center relative">
              <SparkleEffect count={8} colors={['⭐', '✨', '💫']} size="md" enabled />
              <h4 className="text-lg font-elegant mb-4 text-pearl-elegant">Aurora Dreams</h4>
              <div className="space-y-4">
                <RomanticButton variant="aurora" size="lg" romantic shimmer>
                  <Star className="w-5 h-5 mr-2" />
                  Mystical Aurora
                </RomanticButton>
                <RomanticButton variant="aurora" size="md" glow>
                  <Moon className="w-4 h-4 mr-2" />
                  Night Magic
                </RomanticButton>
                <RomanticButton variant="aurora" size="sm" sparkles>
                  Starlight
                </RomanticButton>
              </div>
            </RomanticCard>

            {/* Garden Whispers */}
            <RomanticCard variant="garden" floating sparkles className="p-6 text-center relative">
              <SparkleEffect count={5} colors={['🌸', '🌺', '🌼', '🌻']} size="sm" enabled />
              <h4 className="text-lg font-elegant mb-4 text-pearl-elegant">Garden Whispers</h4>
              <div className="space-y-4">
                <RomanticButton variant="garden" size="lg" romantic shimmer>
                  <Flower className="w-5 h-5 mr-2" />
                  Garden Bloom
                </RomanticButton>
                <RomanticButton variant="garden" size="md" glow>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Fresh Breeze
                </RomanticButton>
                <RomanticButton variant="garden" size="sm" sparkles>
                  Nature's Kiss
                </RomanticButton>
              </div>
            </RomanticCard>

            {/* Romantic Blush */}
            <div className="card-romantic-blush p-6 text-center">
              <h4 className="text-lg font-elegant mb-4 text-pearl-elegant">Romantic Blush</h4>
              <div className="space-y-4">
                <RomanticButton variant="blush" size="lg" romantic shimmer>
                  <Heart className="w-5 h-5 mr-2" />
                  Sweet Blush
                </RomanticButton>
                <RomanticButton variant="blush" size="md" glow>
                  Tender Love
                </RomanticButton>
                <RomanticButton variant="blush" size="sm" sparkles>
                  Gentle Kiss
                </RomanticButton>
              </div>
            </div>

            {/* Dreamy Mist */}
            <div className="card-dreamy-mist p-6 text-center">
              <h4 className="text-lg font-elegant mb-4 text-pearl-elegant">Dreamy Mist</h4>
              <div className="space-y-4">
                <RomanticButton variant="mist" size="lg" romantic shimmer>
                  <Star className="w-5 h-5 mr-2" />
                  Dreamy Clouds
                </RomanticButton>
                <RomanticButton variant="mist" size="md" glow>
                  Soft Whisper
                </RomanticButton>
                <RomanticButton variant="mist" size="sm" sparkles>
                  Misty Dawn
                </RomanticButton>
              </div>
            </div>

            {/* Pearl Elegance */}
            <div className="card-elegant-pearl p-6 text-center">
              <h4 className="text-lg font-elegant mb-4 text-pearl-elegant">Pearl Elegance</h4>
              <div className="space-y-4">
                <RomanticButton variant="pearl" size="lg" shimmer>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Pearl Shine
                </RomanticButton>
                <RomanticButton variant="pearl" size="md" glow>
                  Elegant Grace
                </RomanticButton>
                <RomanticButton variant="pearl" size="sm">
                  Pure Beauty
                </RomanticButton>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Animation Showcase */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h3 className="text-2xl font-romantic text-dreamy-glow mb-8 text-center">
            Enhanced Romantic Animations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Floating Hearts Demo */}
            <RomanticCard variant="blush" className="p-6 text-center relative h-48">
              <FloatingHearts count={2} colors={['💖', '💕']} enabled />
              <h4 className="text-lg font-elegant mb-2">Floating Hearts</h4>
              <p className="text-sm text-muted-foreground">Interactive love animations</p>
            </RomanticCard>

            {/* Sparkle Effect Demo */}
            <RomanticCard variant="mist" className="p-6 text-center relative h-48">
              <SparkleEffect count={10} size="lg" enabled />
              <h4 className="text-lg font-elegant mb-2">Sparkle Magic</h4>
              <p className="text-sm text-muted-foreground">Magical sparkle effects</p>
            </RomanticCard>

            {/* Breathing Glow Demo */}
            <RomanticCard variant="aurora" breathe className="p-6 text-center h-48">
              <h4 className="text-lg font-elegant mb-2">Breathing Glow</h4>
              <p className="text-sm text-muted-foreground">Gentle pulsing animations</p>
              <div className="mt-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-pink-400 breathing-glow"></div>
              </div>
            </RomanticCard>

            {/* Shimmer Effect Demo */}
            <RomanticCard variant="pearl" shimmer className="p-6 text-center h-48">
              <h4 className="text-lg font-elegant mb-2">Shimmer Effect</h4>
              <p className="text-sm text-muted-foreground">Elegant light sweeps</p>
              <div className="mt-4">
                <div className="w-full h-8 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg enhanced-shimmer"></div>
              </div>
            </RomanticCard>
          </div>
        </motion.div>

        {/* Input Showcase */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-2xl font-romantic text-dreamy-glow mb-8 text-center">
            Enhanced Romantic Inputs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-glass-romantic p-6">
              <h4 className="text-lg font-elegant mb-4 text-center">Aurora Dreams</h4>
              <RomanticInput
                variant="aurora"
                label="Your Name"
                placeholder="Enter your name..."
                floating
                romantic
                shimmer
              />
            </div>

            <div className="card-glass-romantic p-6">
              <h4 className="text-lg font-elegant mb-4 text-center">Sunset Romance</h4>
              <RomanticInput
                variant="sunset"
                label="Love Message"
                placeholder="Write your message..."
                floating
                romantic
                glow
              />
            </div>

            <div className="card-glass-romantic p-6">
              <h4 className="text-lg font-elegant mb-4 text-center">Garden Whispers</h4>
              <RomanticInput
                variant="garden"
                label="Special Date"
                placeholder="Select a date..."
                floating
                romantic
              />
            </div>
          </div>
        </motion.div>

        {/* Typography Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-2xl font-romantic text-dreamy-glow mb-8 text-center">
            Enhanced Typography
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-champagne-elegant p-8 text-center">
              <h4 className="heading-romantic-fluid font-romantic text-romantic-gradient mb-4">
                Fluid Romantic Heading
              </h4>
              <p className="text-romantic-fluid text-elegant-shadow mb-4">
                Beautiful fluid typography that scales perfectly across all devices with enhanced readability and romantic styling.
              </p>
              <p className="text-script-romantic text-xl">
                Elegant script accents for special moments
              </p>
            </div>

            <div className="card-romantic-mauve p-8 text-center">
              <h4 className="text-dreamy-glow text-2xl font-romantic mb-4">
                Dreamy Text Effects
              </h4>
              <p className="text-pearl-elegant text-lg mb-4">
                Sophisticated text with elegant shadows and perfect contrast ratios for accessibility.
              </p>
              <p className="text-romantic-gradient text-xl font-semibold">
                Gradient text effects that captivate
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};