import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, GraduationCap, Briefcase, BookOpen, Code } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppGroup {
  id: string;
  name: string;
  category: string;
  members: number;
  description: string;
  icon: string;
  color: string;
  link: string;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
}

const iconMap = {
  MessageCircle,
  Users,
  Briefcase,
  BookOpen,
  GraduationCap,
  Code
};

const communityGuidelines = [
  "Be respectful and kind to all members",
  "Keep discussions relevant to academic topics",
  "No sharing of personal information",
  "Help others when you can",
  "Follow BYU-Pathway standards",
  "No spam or promotional content"
];

export default function CommunityPage() {
  const [whatsappGroups, setWhatsappGroups] = useState<WhatsAppGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchWhatsAppGroups();
  }, []);

  const fetchWhatsAppGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_groups')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWhatsappGroups(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch WhatsApp groups",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const majorGroups = whatsappGroups.filter(group => group.category === "Major");
  const courseGroups = whatsappGroups.filter(group => group.category === "Course");
  const generalGroups = whatsappGroups.filter(group => group.category === "General");

  const GroupCard = ({ group }: { group: WhatsAppGroup }) => {
    const IconComponent = iconMap[group.icon as keyof typeof iconMap] || MessageCircle;
    
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${group.color}`}>
                <IconComponent className="h-5 w-5" />
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
              {group.is_active && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">Active</span>
                </div>
              )}
            </div>
            
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => window.open(group.link, '_blank')}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Join WhatsApp Group
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const GroupSection = ({ title, groups, icon: Icon }: { title: string, groups: WhatsAppGroup[], icon: any }) => (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center space-x-2">
        <Icon className="h-6 w-6" />
        <span>{title}</span>
      </h2>
      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No groups available in this category yet.</p>
        </div>
      )}
    </section>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading community groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
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
                  {whatsappGroups.filter(group => group.is_active).length}
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