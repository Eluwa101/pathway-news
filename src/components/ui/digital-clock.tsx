import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());
  const [timezoneAbbr, setTimezoneAbbr] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Get short timezone abbreviation
    const tz = new Date().toLocaleTimeString('en-US', {
      timeZoneName: 'short'
    });
    // Extract just the abbreviation (last part after the time)
    setTimezoneAbbr(tz.split(' ').pop() || '');

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Current Time</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-2">
          <div className="text-4xl font-mono font-bold text-primary">
            {formatTime(time)}
          </div>
          <div className="text-lg text-muted-foreground">
            {formatDate(time)}
          </div>
          <div className="text-sm text-muted-foreground">
            Local Time ({timezoneAbbr})
          </div>
        </div>
      </CardContent>
    </Card>
  );
}