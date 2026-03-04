import { useState, useEffect } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";

export default function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeLeft({
        days: differenceInDays(targetDate, now),
        hours: differenceInHours(targetDate, now) % 24,
        minutes: differenceInMinutes(targetDate, now) % 60,
        seconds: differenceInSeconds(targetDate, now) % 60,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex justify-center space-x-4 md:space-x-8 text-center">
      <div className="flex flex-col items-center">
        <span className="text-4xl md:text-6xl font-serif font-bold text-amber-800">{timeLeft.days}</span>
        <span className="text-sm md:text-base text-stone-600 uppercase tracking-widest mt-2">Days</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-4xl md:text-6xl font-serif font-bold text-amber-800">{timeLeft.hours}</span>
        <span className="text-sm md:text-base text-stone-600 uppercase tracking-widest mt-2">Hours</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-4xl md:text-6xl font-serif font-bold text-amber-800">{timeLeft.minutes}</span>
        <span className="text-sm md:text-base text-stone-600 uppercase tracking-widest mt-2">Minutes</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-4xl md:text-6xl font-serif font-bold text-amber-800">{timeLeft.seconds}</span>
        <span className="text-sm md:text-base text-stone-600 uppercase tracking-widest mt-2">Seconds</span>
      </div>
    </div>
  );
}
