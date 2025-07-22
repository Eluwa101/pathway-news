import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, GraduationCap, Briefcase, BookOpen, Code } from 'lucide-react';

const whatsappGroups = [
  {
    id: 1,
    name: "Business Administration",
    category: "Major",
    members: 450,
    description: "Connect with fellow business students, share resources, and discuss career opportunities.",
    icon: Briefcase,
    color: "bg-blue-100 text-blue-800",
    link: "https://chat.whatsapp.com/business-admin",
    active: true
  },
  {
    id: 2,
    name: "Computer Science & IT",
    category: "Major",
    members: 380,
    description: "Programming help, project collaboration, and tech career discussions.",
    icon: Code,
    color: "bg-green-100 text-green-800",
    link: "https://chat.whatsapp.com/computer-science",
    active: true
  },
  {
    id: 3,
    name: "Healthcare Administration",
    category: "Major",
    members: 220,
    description: "Healthcare industry insights, internship opportunities, and study groups.",
    icon: Users,
    color: "bg-red-100 text-red-800",
    link: "https://chat.whatsapp.com/healthcare-admin",
    active: true
  },
  {
    id: 4,
    name: "Education Studies",
    category: "Major",
    members: 180,
    description: "Teaching resources, classroom management tips, and education career paths.",
    icon: GraduationCap,
    color: "bg-purple-100 text-purple-800",
    link: "https://chat.whatsapp.com/education-studies",
    active: true
  },
  {
    id: 5,
    name: "General Studies - English",
    category: "Course",
    members: 520,
    description: "English composition help, writing tips, and literature discussions.",
    icon: BookOpen,
    color: "bg-yellow-100 text-yellow-800",
    link: "https://chat.whatsapp.com/english-course",
    active: true
  },
  {
    id: 6,
    name: "Mathematics Fundamentals",
    category: "Course",
    members: 340,
    description: "Math problem solving, study sessions, and exam preparation.",
    icon: BookOpen,
    color: "bg-indigo-100 text-indigo-800",
    link: "https://chat.whatsapp.com/math-fundamentals",
    active: true
  },
  {
    id: 7,
    name: "Finance & Accounting",
    category: "Major",
    members: 290,
    description: "Financial concepts, accounting principles, and career opportunities in finance.",
    icon: Briefcase,
    color: "bg-orange-100 text-orange-800",
    link: "https://chat.whatsapp.com/finance-accounting",
    active: true
  },
  {
    id: 8,
    name: "Study Group - Statistics",
    category: "Course",
    members: 150,
    description: "Statistics homework help, group study sessions, and exam prep.",
    icon: BookOpen,
    color: "bg-teal-100 text-teal-800",
    link: "https://chat.whatsapp.com/statistics-study",
    active: true
  },
  {
    id: 9,
    name: "Psychology Studies",
    category: "Major",
    members: 200,
    description: "Psychology research, case studies, and mental health resources.",
    icon: Users,
    color: "bg-pink-100 text-pink-800",
    link: "https://chat.whatsapp.com/psychology-studies",
    active: true
  },
  {
    id: 10,
    name: "General Student Support",
    category: "General",
    members: 680,
    description: "General questions, announcements, and peer support for all students.",
    icon: MessageCircle,
    color: "bg-gray-100 text-gray-800",
    link: "https://chat.whatsapp.com/general-support",
    active: true
  }
];

const communityGuidelines = [
  "Be respectful and kind to all members",
  "Keep discussions relevant to academic topics",
  "No sharing of personal information",
  "Help others when you can",
  "Follow BYU-Pathway standards",
  "No spam or promotional content"
];

export default function CommunityPage() {
  const majorGroups = whatsappGroups.filter(group => group.category === "Major");
  const courseGroups = whatsappGroups.filter(group => group.category === "Course");
  const generalGroups = whatsappGroups.filter(group => group.category === "General");

  const GroupCard = ({ group }: { group: typeof whatsappGroups[0] }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${group.color}`}>
              <group.icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{group.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline">{group.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  {group.members} members
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {group.description}
          </p>
          
          <div className="flex items-center space-x-2">
            {group.active && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600">Active</span>
              </div>
            )}
          </div>
          
          <Button className="w-full bg-green-600 hover:bg-green-700">
            <MessageCircle className="h-4 w-4 mr-2" />
            Join WhatsApp Group
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const GroupSection = ({ title, groups, icon: Icon }: { title: string, groups: typeof whatsappGroups, icon: any }) => (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center space-x-2">
        <Icon className="h-6 w-6" />
        <span>{title}</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Student Community</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect with fellow BYU-Pathway students through WhatsApp study groups. 
              Get help with coursework, share resources, and build lasting friendships.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-primary mb-2">
                  {whatsappGroups.reduce((total, group) => total + group.members, 0).toLocaleString()}
                </div>
                <div className="text-muted-foreground">Total Members</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-primary mb-2">
                  {whatsappGroups.length}
                </div>
                <div className="text-muted-foreground">Active Groups</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-primary mb-2">
                  {majorGroups.length}
                </div>
                <div className="text-muted-foreground">Major Groups</div>
              </CardContent>
            </Card>
          </div>

          {/* Major Groups */}
          <GroupSection 
            title="Study Groups by Major" 
            groups={majorGroups} 
            icon={Briefcase}
          />

          {/* Course Groups */}
          <GroupSection 
            title="Course-Specific Groups" 
            groups={courseGroups} 
            icon={BookOpen}
          />

          {/* General Groups */}
          <GroupSection 
            title="General Community" 
            groups={generalGroups} 
            icon={MessageCircle}
          />

          {/* Community Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Community Guidelines</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {communityGuidelines.map((guideline, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm flex items-center justify-center">
                      {index + 1}
                    </div>
                    <span className="text-sm">{guideline}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> These WhatsApp groups are student-organized and moderated. 
                  While they provide valuable peer support, they are not official BYU-Pathway channels. 
                  For official academic support, please contact your instructors or student services.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}