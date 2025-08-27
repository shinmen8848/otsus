import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Heart, Star, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import floralTexture from '@/assets/floral-texture-light.jpg';

export const InteractiveTimeline = () => {
  const timelineEvents = [
    {
      date: '2023-02-14',
      title: 'First Meeting',
      description: 'The day our hearts first connected under the cherry blossoms',
      type: 'milestone',
      location: 'Sakura Park'
    },
    {
      date: '2023-03-20',
      title: 'First Date',
      description: 'Our magical first official date - dinner and stargazing',
      type: 'romantic',
      location: 'Rooftop Restaurant'
    },
    {
      date: '2023-05-15',
      title: 'First "I Love You"',
      description: 'The moment we both knew this was forever',
      type: 'milestone',
      location: 'Our Special Place'
    },
    {
      date: '2023-08-14',
      title: 'Six Months Anniversary',
      description: 'Celebrating our beautiful journey together',
      type: 'anniversary',
      location: 'Memory Lane'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <Star className="w-5 h-5" />;
      case 'romantic': return <Heart className="w-5 h-5" />;
      case 'anniversary': return <Calendar className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'from-yellow-400 to-orange-500';
      case 'romantic': return 'from-pink-400 to-red-500';
      case 'anniversary': return 'from-purple-400 to-blue-500';
      default: return 'from-green-400 to-teal-500';
    }
  };

  return (
    <section className="min-h-screen py-24 px-6 bg-cherry-garden relative">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${floralTexture})` }}
      />
      <div className="absolute inset-0 bg-floral-pattern opacity-30" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-accent text-6xl md:text-7xl font-bold text-gradient-romantic-3d text-title-3d mb-6">
            Our Love Timeline
          </h2>
          <p className="text-2xl text-foreground/80 max-w-3xl mx-auto font-elegant font-medium text-enhanced">
            Every moment of our journey together, beautifully preserved
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent opacity-50" />
          
          <div className="space-y-12">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative flex items-center"
              >
                {/* Timeline Node */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getTypeColor(event.type)} flex items-center justify-center shadow-3d-strong z-10`}>
                  <div className="text-white drop-shadow-lg">
                    {getTypeIcon(event.type)}
                  </div>
                </div>
                
                {/* Event Card */}
                <Card className="ml-8 flex-1 card-romantic-3d">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-elegant font-bold text-xl text-title-3d mb-1">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-muted-foreground text-sm font-elegant">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(event.date).toLocaleDateString()}
                        {event.location && (
                          <>
                            <span className="mx-2">•</span>
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-foreground/80 font-elegant text-enhanced leading-relaxed">
                    {event.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};