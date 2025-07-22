import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Calendar, Clock, Play, Download } from 'lucide-react';

const devotionals = [
  {
    id: 1,
    title: "Faith and Learning: The Divine Connection",
    speaker: "Elder David A. Bednar",
    date: "2024-01-22",
    time: "7:00 PM MT",
    status: "upcoming",
    description: "Explore how faith enhances our capacity to learn and grow intellectually and spiritually.",
    topics: ["Faith", "Learning", "Spiritual Growth"],
    liveLink: "https://example.com/live",
    isLive: false
  },
  {
    id: 2,
    title: "Finding Joy in the Journey of Education",
    speaker: "Sister Joy D. Jones",
    date: "2024-01-25",
    time: "8:00 PM MT",
    status: "upcoming",
    description: "Discover how to maintain joy and perspective during challenging academic pursuits.",
    topics: ["Joy", "Education", "Perseverance"],
    liveLink: "https://example.com/live2",
    isLive: false
  },
  {
    id: 3,
    title: "The Purpose of Education",
    speaker: "President Russell M. Nelson",
    date: "2024-01-15",
    time: "7:00 PM MT",
    status: "completed",
    description: "Understanding the eternal significance of learning and education in our lives.",
    topics: ["Education", "Purpose", "Eternal Perspective"],
    recordingLink: "https://example.com/recording1",
    downloadLink: "https://example.com/download1"
  },
  {
    id: 4,
    title: "Overcoming Academic Challenges",
    speaker: "Elder Dieter F. Uchtdorf",
    date: "2024-01-08",
    time: "8:00 PM MT",
    status: "completed",
    description: "Practical and spiritual insights for overcoming difficulties in our educational journey.",
    topics: ["Challenges", "Resilience", "Faith"],
    recordingLink: "https://example.com/recording2",
    downloadLink: "https://example.com/download2"
  }
];

export default function DevotionalsPage() {
  const upcomingDevotionals = devotionals.filter(d => d.status === "upcoming");
  const pastDevotionals = devotionals.filter(d => d.status === "completed");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const DevotionalCard = ({ devotional, isPast = false }: { devotional: typeof devotionals[0], isPast?: boolean }) => (
    <Card className="mb-6 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <CardTitle className="text-xl">{devotional.title}</CardTitle>
          </div>
          <Badge variant={isPast ? "secondary" : "default"}>
            {isPast ? "Completed" : "Upcoming"}
          </Badge>
        </div>
        <div className="text-lg font-medium text-primary">
          {devotional.speaker}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(devotional.date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{devotional.time}</span>
            </div>
          </div>
          
          <p className="text-muted-foreground">
            {devotional.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {devotional.topics.map((topic, index) => (
              <Badge key={index} variant="outline">{topic}</Badge>
            ))}
          </div>
          
          <div className="flex space-x-2 pt-2">
            {!isPast ? (
              <Button className="flex items-center space-x-2">
                <Play className="h-4 w-4" />
                <span>Watch Live</span>
              </Button>
            ) : (
              <>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Play className="h-4 w-4" />
                  <span>Watch Recording</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Devotionals</h1>
            <p className="text-muted-foreground">
              Spiritual guidance and inspiration for your educational journey
            </p>
          </div>

          {/* Upcoming Devotionals */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
              <Heart className="h-6 w-6 text-red-500" />
              <span>Upcoming Devotionals</span>
            </h2>
            {upcomingDevotionals.length > 0 ? (
              <div className="space-y-4">
                {upcomingDevotionals.map(devotional => (
                  <DevotionalCard key={devotional.id} devotional={devotional} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No upcoming devotionals scheduled.</p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Past Devotionals */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Past Devotionals</h2>
            <div className="space-y-4">
              {pastDevotionals.map(devotional => (
                <DevotionalCard key={devotional.id} devotional={devotional} isPast={true} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}