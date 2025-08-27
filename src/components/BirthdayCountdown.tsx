import { useEffect, useState } from 'react';
import { Calendar, Gift, Cake, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface BirthdayCountdownProps {
  person: 'tomoe' | 'nanami';
  birthday: string; // Format: 'MM-DD'
  name: string;
}

export const BirthdayCountdown = ({ person, birthday, name }: BirthdayCountdownProps) => {
  const [daysUntil, setDaysUntil] = useState(0);
  const [isBirthday, setIsBirthday] = useState(false);
  const [nextBirthdayYear, setNextBirthdayYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const [month, day] = birthday.split('-').map(Number);
      
      // Create birthday date for current year
      let birthdayThisYear = new Date(currentYear, month - 1, day);
      
      // If birthday has passed this year, use next year
      if (birthdayThisYear < now) {
        birthdayThisYear = new Date(currentYear + 1, month - 1, day);
        setNextBirthdayYear(currentYear + 1);
      } else {
        setNextBirthdayYear(currentYear);
      }
      
      const difference = birthdayThisYear.getTime() - now.getTime();
      const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
      
      setDaysUntil(days);
      setIsBirthday(days === 0);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(interval);
  }, [birthday]);

  const getBirthdayMessage = () => {
    if (isBirthday) {
      return `🎉 Happy Birthday ${name}! 🎉`;
    } else if (daysUntil === 1) {
      return `${name}'s birthday is tomorrow! 🎂`;
    } else if (daysUntil <= 7) {
      return `${name}'s birthday is in ${daysUntil} days! 🎈`;
    } else if (daysUntil <= 30) {
      return `${name}'s birthday is in ${daysUntil} days 🗓️`;
    } else {
      return `${daysUntil} days until ${name}'s birthday`;
    }
  };

  const getColorClass = () => {
    if (person === 'tomoe') {
      return 'from-primary to-secondary';
    } else {
      return 'from-secondary to-accent';
    }
  };

  const shouldHighlight = daysUntil <= 30 || isBirthday;

  return (
    <motion.div 
      className={`glass-romantic-3d p-6 rounded-2xl ${
        shouldHighlight ? 'ring-2 ring-primary/50 shadow-glow-3d' : ''
      }`}
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {isBirthday ? (
            <Cake className="w-6 h-6 text-primary animate-bounce" />
          ) : (
            <Calendar className="w-6 h-6 text-primary" />
          )}
          <h4 className="font-elegant font-bold text-lg text-title-3d">
            {isBirthday ? 'Birthday Today!' : 'Birthday Countdown'}
          </h4>
        </div>
        <Gift className={`w-6 h-6 ${
          shouldHighlight ? 'text-primary animate-pulse' : 'text-muted-foreground'
        }`} />
      </div>

      <div className="text-center">
        <div className={`text-3xl font-bold font-display mb-2 bg-gradient-to-r ${
          getColorClass()
        } bg-clip-text text-transparent`}>
          {isBirthday ? '🎂' : daysUntil}
        </div>
        <div className="text-sm text-muted-foreground font-elegant">
          {getBirthdayMessage()}
        </div>
        {!isBirthday && (
          <div className="text-xs text-muted-foreground mt-2">
            {new Date(nextBirthdayYear, parseInt(birthday.split('-')[0]) - 1, parseInt(birthday.split('-')[1]))
              .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        )}
      </div>

      {isBirthday && (
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                className="text-2xl"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: i * 0.1 + 0.5, duration: 0.5 }}
              >
                🎈
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};