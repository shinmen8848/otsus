import { SakuraPetals } from './SakuraPetals';

export const EnhancedFloralElements = () => {
  return (
    <>
      {/* Enhanced Sakura Petals */}
      <SakuraPetals />

      {/* Static decorative elements for depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-5">
        <div className="absolute top-10 left-5 w-6 h-6 bg-romantic-rose rounded-full opacity-30 dreamy-float" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-32 right-10 w-4 h-4 bg-romantic-blush rounded-t-full opacity-25 dreamy-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/4 left-1/3 w-5 h-5 bg-romantic-lavender rounded-full opacity-35 dreamy-float" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-7 h-7 bg-romantic-mint rounded-t-full opacity-20 dreamy-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/5 w-4 h-4 bg-romantic-peach rounded-full opacity-40 dreamy-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-6 h-6 bg-romantic-rose rounded-t-full opacity-30 dreamy-float" style={{animationDelay: '5s'}}></div>

        {/* Additional romantic elements */}
        <div className="absolute top-1/2 left-10 w-3 h-3 bg-romantic-lavender rounded-full opacity-50 love-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 right-20 w-5 h-5 bg-romantic-blush rounded-full opacity-40 love-pulse" style={{animationDelay: '2s'}}></div>
      </div>
    </>
  );
};