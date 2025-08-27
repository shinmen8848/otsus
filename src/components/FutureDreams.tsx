import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Heart, 
  Plane, 
  Home, 
  Briefcase, 
  Baby, 
  GraduationCap,
  Plus,
  Star,
  Calendar,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import floralTexture from '@/assets/floral-texture-light.jpg';

interface Dream {
  id: string;
  title: string;
  description: string;
  category: 'travel' | 'life' | 'career' | 'family' | 'personal';
  priority: 'high' | 'medium' | 'low';
  timeline: 'soon' | 'year' | 'future';
  status: 'planning' | 'progress' | 'achieved';
}

export const FutureDreams = () => {
  const [dreams, setDreams] = useState<Dream[]>([
    {
      id: '1',
      title: 'Visit Japan Together',
      description: 'Experience the cherry blossom season in Kyoto and Tokyo, visit anime locations, and immerse ourselves in the culture we both love.',
      category: 'travel',
      priority: 'high',
      timeline: 'year',
      status: 'planning'
    },
    {
      id: '2',
      title: 'Our First Home',
      description: 'Find and decorate our perfect little home where we can build our life together, with a garden and space for all our memories.',
      category: 'life',
      priority: 'high',
      timeline: 'soon',
      status: 'progress'
    },
    {
      id: '3',
      title: 'Learn Cooking Together',
      description: 'Master the art of cooking traditional dishes from around the world, starting with Japanese cuisine.',
      category: 'personal',
      priority: 'medium',
      timeline: 'soon',
      status: 'progress'
    },
    {
      id: '4',
      title: 'Adventure Photography Project',
      description: 'Document our travels and adventures through a joint photography project, creating beautiful photo books.',
      category: 'personal',
      priority: 'medium',
      timeline: 'year',
      status: 'planning'
    }
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'travel': return <Plane className="w-5 h-5" />;
      case 'life': return <Home className="w-5 h-5" />;
      case 'career': return <Briefcase className="w-5 h-5" />;
      case 'family': return <Baby className="w-5 h-5" />;
      case 'personal': return <GraduationCap className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'bg-green-500';
      case 'progress': return 'bg-yellow-500';
      case 'planning': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredDreams = filter === 'all' 
    ? dreams 
    : dreams.filter(dream => dream.category === filter);

  return (
    <section className="min-h-screen py-24 px-6 bg-cherry-garden relative">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${floralTexture})` }}
      />
      <div className="absolute inset-0 bg-floral-pattern opacity-30" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-accent text-6xl md:text-7xl font-bold text-gradient-romantic-3d text-title-3d mb-6">
            Our Future Dreams
          </h2>
          <p className="text-2xl text-foreground/80 max-w-3xl mx-auto font-elegant font-medium text-enhanced">
            Building our tomorrow together, one dream at a time
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['all', 'travel', 'life', 'career', 'family', 'personal'].map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(category)}
              className={`rounded-full px-6 py-2 font-elegant font-semibold transition-3d ${
                filter === category
                  ? 'btn-romantic-3d'
                  : 'btn-romantic-outline-3d'
              }`}
            >
              {category === 'all' ? 'All Dreams' : 
               category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Dreams Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredDreams.map((dream, index) => (
            <motion.div
              key={dream.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-romantic-3d h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-3d-secondary flex items-center justify-center shadow-3d-soft">
                      {getCategoryIcon(dream.category)}
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(dream.status)}`} />
                  </div>
                  <Badge className={`text-xs ${getPriorityColor(dream.priority)}`}>
                    {dream.priority}
                  </Badge>
                </div>
                
                <h3 className="font-elegant font-bold text-lg text-title-3d mb-3">
                  {dream.title}
                </h3>
                
                <p className="text-muted-foreground font-elegant text-enhanced leading-relaxed mb-4">
                  {dream.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs font-elegant">
                    <Calendar className="w-3 h-3 mr-1" />
                    {dream.timeline}
                  </Badge>
                  <Badge variant="outline" className="text-xs font-elegant">
                    {dream.status}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Add New Dream Button */}
        <div className="text-center">
          <Button
            onClick={() => setIsAddingNew(true)}
            className="btn-romantic-3d"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Dream
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <Card className="p-4 text-center card-romantic-3d">
            <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
              {dreams.length}
            </div>
            <div className="text-sm text-muted-foreground font-elegant">Total Dreams</div>
          </Card>
          <Card className="p-4 text-center card-romantic-3d">
            <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
              {dreams.filter(d => d.status === 'progress').length}
            </div>
            <div className="text-sm text-muted-foreground font-elegant">In Progress</div>
          </Card>
          <Card className="p-4 text-center card-romantic-3d">
            <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
              {dreams.filter(d => d.status === 'achieved').length}
            </div>
            <div className="text-sm text-muted-foreground font-elegant">Achieved</div>
          </Card>
          <Card className="p-4 text-center card-romantic-3d">
            <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
              {dreams.filter(d => d.priority === 'high').length}
            </div>
            <div className="text-sm text-muted-foreground font-elegant">High Priority</div>
          </Card>
        </div>
      </div>
    </section>
  );
};