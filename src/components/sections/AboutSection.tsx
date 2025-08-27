import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ElegantContentCard, DreamyContentCard, GlassContentCard } from '@/components/ui/romantic-card';
import { RomanticButton, ElegantPearlButton } from '@/components/ui/romantic-button';
import { Calendar, Heart, Star, MapPin, Gift, Sparkles, Camera, User } from 'lucide-react';
import { BirthdayCountdown } from '@/components/BirthdayCountdown';
import { SectionHeader } from '@/components/BreadcrumbNav';
import { SectionTransition, StaggeredChildren } from '@/components/PageTransition';
import { RomanticBackground, LayeredRomanticBackground } from '@/components/RomanticBackgrounds';
import { FloatingDecorations, RomanticBorder } from '@/components/RomanticIcons';
// Using CSS background class instead of import

interface AboutSectionProps {
  person: 'tomoe' | 'nanami';
}

export const AboutSection = ({ person }: AboutSectionProps) => {
  const isNanami = person === 'nanami';
  
  const personData = {
    tomoe: {
      name: 'Tomoe',
      birthday: import.meta.env.VITE_TOMOE_BIRTHDAY?.split('-').slice(1).join('-') || '03-15', // MM-DD format
      fullBirthday: import.meta.env.VITE_TOMOE_BIRTHDAY || '2000-03-15',
      zodiac: 'Pisces ♓',
      personality: 'Gentle, creative, and deeply romantic',
      bio: 'A gentle soul with an artistic heart, Tomoe finds beauty in the smallest moments and has an incredible gift for photography that captures the essence of our love.',
      hobbies: ['Photography', 'Anime', 'Cooking', 'Stargazing', 'Watercolor Painting'],
      favoriteAnime: ['Your Name', 'Spirited Away', 'Weathering with You', 'A Silent Voice', 'Garden of Words'],
      achievements: ['Published photographer', 'Graduated with honors', 'Speaks 3 languages'],
      dreams: 'To travel the world and capture beautiful memories together, documenting our love story through photography',
      quote: '"In your eyes, I found my home"',
      color: 'from-primary to-secondary',
      favoriteFood: 'Homemade ramen and cherry blossom mochi',
      petPeeve: 'Messy photo albums',
      perfectDate: 'Sunset photography session followed by stargazing'
    },
    nanami: {
      name: 'Nanami',
      birthday: import.meta.env.VITE_NANAMI_BIRTHDAY?.split('-').slice(1).join('-') || '08-22', // MM-DD format
      fullBirthday: import.meta.env.VITE_NANAMI_BIRTHDAY || '2001-08-22',
      zodiac: 'Leo ♌',
      personality: 'Warm, passionate, and adventurous',
      bio: 'A vibrant spirit full of creativity and warmth, Nanami brings joy and laughter to every moment and has an amazing talent for turning ordinary days into magical adventures.',
      hobbies: ['Digital Art', 'Music Production', 'Gaming', 'Dancing', 'Anime Sketching'],
      favoriteAnime: ['Attack on Titan', 'Demon Slayer', 'My Hero Academia', 'Jujutsu Kaisen', 'Hunter x Hunter'],
      achievements: ['Digital art featured in galleries', 'Music producer', 'Gaming tournament winner'],
      dreams: 'To create art that tells our love story and maybe start our own animation studio together',
      quote: '"With you, every day feels like a new adventure"',
      color: 'from-secondary to-accent',
      favoriteFood: 'Spicy curry and matcha ice cream',
      petPeeve: 'Unfinished artwork',
      perfectDate: 'Art museum followed by a cozy gaming night'
    }
  };

  const data = personData[person];

  return (
    <section className="min-h-screen flex items-center justify-center py-16 sm:py-24 px-4 sm:px-6 bg-romantic-champagne relative">
      {/* Sophisticated Romantic Background */}
      <LayeredRomanticBackground />
      <FloatingDecorations />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/5 to-background/20" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16 elegant-fade-in">
          <h2 className="font-romantic text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-romantic mb-4 sm:mb-6 romantic-breathe">
            About {data.name}
          </h2>
          <RomanticBorder className="mb-6" />
          <p className="text-lg sm:text-xl md:text-2xl text-elegant max-w-3xl mx-auto font-elegant font-medium mb-4 sm:mb-6 elegant-slide-up">
            {data.personality}
          </p>
          <p className="text-base sm:text-lg text-elegant/80 max-w-4xl mx-auto font-elegant leading-relaxed px-2 elegant-slide-up" style={{animationDelay: '0.2s'}}>
            {data.bio}
          </p>
        </div>

        {/* Birthday Countdown Section */}
        <div className="mb-12 max-w-md mx-auto">
          <BirthdayCountdown 
            person={person}
            birthday={data.birthday}
            name={data.name}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10">
          {/* Enhanced Profile Card */}
          <div className="card-romantic-3d">
            <div className="text-center mb-6 sm:mb-8">
              <div className={`w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full bg-gradient-to-br ${data.color} flex items-center justify-center mb-4 sm:mb-6 shadow-3d-medium`}>
                <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-white/95 drop-shadow-lg" />
              </div>
              <h3 className="font-accent text-3xl sm:text-4xl font-bold text-gradient-romantic-3d text-title-3d">
                {data.name}
              </h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-center text-foreground/80">
                <Calendar className="w-6 h-6 mr-4 text-primary" />
                <span className="text-lg font-elegant font-medium text-enhanced">
                  {new Date(data.fullBirthday).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric'
                  })} • {data.zodiac}
                </span>
              </div>
              
              <div className="glass-romantic-3d p-6 rounded-2xl">
                <p className="text-center italic text-foreground/90 text-lg font-elegant leading-relaxed text-enhanced">
                  {data.quote}
                </p>
              </div>

              {/* Additional Profile Info */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-elegant">Favorite Food:</span>
                  <span className="text-foreground font-elegant font-medium">{data.favoriteFood}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-elegant">Perfect Date:</span>
                  <span className="text-foreground font-elegant font-medium text-right max-w-[200px]">{data.perfectDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Details Cards */}
          <div className="space-y-8">
            {/* Achievements Card */}
            <div className="card-romantic-3d">
              <div className="flex items-center mb-6">
                <Sparkles className="w-6 h-6 mr-4 text-primary" />
                <h4 className="font-elegant font-bold text-xl text-title-3d">Achievements</h4>
              </div>
              <div className="space-y-3">
                {data.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center text-foreground/80 font-elegant text-enhanced">
                    <span className="w-3 h-3 bg-gradient-3d-primary rounded-full mr-4 shadow-3d-soft"></span>
                    <span className="text-base">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-romantic-3d">
              <div className="flex items-center mb-6">
                <Star className="w-6 h-6 mr-4 text-primary" />
                <h4 className="font-elegant font-bold text-xl text-title-3d">Hobbies & Interests</h4>
              </div>
              <div className="flex flex-wrap gap-3">
                {data.hobbies.map((hobby, index) => (
                  <span 
                    key={index}
                    className="px-4 py-2 bg-3d-primary text-white rounded-full text-sm font-elegant font-semibold shadow-3d-soft"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>

            <div className="card-romantic-3d">
              <div className="flex items-center mb-6">
                <Heart className="w-6 h-6 mr-4 text-primary" />
                <h4 className="font-elegant font-bold text-xl text-title-3d">Favorite Anime</h4>
              </div>
              <ul className="space-y-3">
                {data.favoriteAnime.map((anime, index) => (
                  <li key={index} className="text-foreground/80 flex items-center font-elegant text-enhanced">
                    <span className="w-3 h-3 bg-gradient-3d-primary rounded-full mr-4 shadow-3d-soft"></span>
                    <span className="text-lg">{anime}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-romantic-3d">
              <div className="flex items-center mb-6">
                <MapPin className="w-6 h-6 mr-4 text-primary" />
                <h4 className="font-elegant font-bold text-xl text-title-3d">Dreams & Aspirations</h4>
              </div>
              <p className="text-foreground/80 leading-relaxed text-lg font-elegant text-enhanced">
                {data.dreams}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-12 sm:mt-16 px-4">
          <Button className="btn-romantic-3d text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto min-h-[44px]">
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
            Birthday Memories
          </Button>
          <Button variant="outline" className="btn-romantic-outline-3d text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto min-h-[44px]">
            <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
            Photo Gallery
          </Button>
        </div>
      </div>
    </section>
  );
};