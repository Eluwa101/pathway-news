import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminForm } from "@/components/admin/AdminForm";
import { AdminList } from "@/components/admin/AdminList";
import HomepageFeaturedManager from "@/components/admin/HomepageFeaturedManager";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from '@supabase/supabase-js';
import { 
  Newspaper, 
  BookOpen, 
  Heart, 
  Video, 
  MessageCircle, 
  BarChart3,
  Star,
  Shield,
  LogOut 
} from "lucide-react";

interface AdminContent {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  summary?: string;
  is_published: boolean;
  created_at: string;
}

const AdminPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("news");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Content state
  const [news, setNews] = useState<AdminContent[]>([]);
  const [books, setBooks] = useState<AdminContent[]>([]);
  const [devotionals, setDevotionals] = useState<AdminContent[]>([]);
  const [careerEvents, setCareerEvents] = useState<AdminContent[]>([]);
  const [whatsappGroups, setWhatsappGroups] = useState<AdminContent[]>([]);
  const [jobs, setJobs] = useState<AdminContent[]>([]);
  
  // Form state
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (!session?.user) {
        navigate('/auth');
      } else {
        fetchContent();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchContent = async () => {
    try {
      const [newsRes, booksRes, devotionalsRes, eventsRes, groupsRes, jobsRes] = await Promise.all([
        supabase.from('news').select('*').order('created_at', { ascending: false }),
        supabase.from('books').select('*').order('created_at', { ascending: false }),
        supabase.from('devotionals').select('*').order('created_at', { ascending: false }),
        supabase.from('career_events').select('*').order('created_at', { ascending: false }),
        supabase.from('whatsapp_groups').select('*').order('created_at', { ascending: false }),
        supabase.from('jobs').select('*').order('created_at', { ascending: false })
      ]);

      if (newsRes.data) setNews(newsRes.data);
      if (booksRes.data) setBooks(booksRes.data);
      if (devotionalsRes.data) setDevotionals(devotionalsRes.data);
      if (eventsRes.data) setCareerEvents(eventsRes.data);
      if (groupsRes.data) setWhatsappGroups(groupsRes.data);
      if (jobsRes.data) setJobs(jobsRes.data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch content",
        variant: "destructive"
      });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingItem(null);
    fetchContent();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully"
    });
    navigate('/auth');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all content for BYU-Pathway Connect</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1">
          <TabsTrigger value="homepage" className="text-xs sm:text-sm">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Homepage</span>
            <span className="sm:hidden">Home</span>
          </TabsTrigger>
          <TabsTrigger value="news" className="text-xs sm:text-sm">News</TabsTrigger>
          <TabsTrigger value="books" className="text-xs sm:text-sm">Books</TabsTrigger>
          <TabsTrigger value="devotionals" className="text-xs sm:text-sm">Devotionals</TabsTrigger>
          <TabsTrigger value="career_events" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Career Events</span>
            <span className="sm:hidden">Career</span>
          </TabsTrigger>
          <TabsTrigger value="whatsapp_groups" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="sm:hidden">WA</span>
          </TabsTrigger>
          <TabsTrigger value="jobs" className="text-xs sm:text-sm">Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="homepage">
          <HomepageFeaturedManager />
        </TabsContent>

        <TabsContent value="news">
          {showForm && (
            <AdminForm
              type="news"
              tableName="news"
              editingItem={editingItem}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          )}
          <AdminList
            items={news}
            type="News"
            tableName="news"
            onEdit={handleEdit}
            onAdd={handleAdd}
            onRefresh={fetchContent}
          />
        </TabsContent>

        <TabsContent value="books">
          {showForm && (
            <AdminForm
              type="books"
              tableName="books"
              editingItem={editingItem}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          )}
          <AdminList
            items={books}
            type="Books"
            tableName="books"
            onEdit={handleEdit}
            onAdd={handleAdd}
            onRefresh={fetchContent}
          />
        </TabsContent>

        <TabsContent value="devotionals">
          {showForm && (
            <AdminForm
              type="devotionals"
              tableName="devotionals"
              editingItem={editingItem}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          )}
          <AdminList
            items={devotionals}
            type="Devotionals"
            tableName="devotionals"
            onEdit={handleEdit}
            onAdd={handleAdd}
            onRefresh={fetchContent}
          />
        </TabsContent>

        <TabsContent value="career_events">
          {showForm && (
            <AdminForm
              type="career_events"
              tableName="career_events"
              editingItem={editingItem}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          )}
          <AdminList
            items={careerEvents}
            type="Career Events"
            tableName="career_events"
            onEdit={handleEdit}
            onAdd={handleAdd}
            onRefresh={fetchContent}
          />
        </TabsContent>

        <TabsContent value="whatsapp_groups">
          {showForm && (
            <AdminForm
              type="whatsapp_groups"
              tableName="whatsapp_groups"
              editingItem={editingItem}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          )}
          <AdminList
            items={whatsappGroups}
            type="WhatsApp Groups"
            tableName="whatsapp_groups"
            onEdit={handleEdit}
            onAdd={handleAdd}
            onRefresh={fetchContent}
          />
        </TabsContent>

        <TabsContent value="jobs">
          {showForm && (
            <AdminForm
              type="jobs"
              tableName="jobs"
              editingItem={editingItem}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          )}
          <AdminList
            items={jobs}
            type="Jobs"
            tableName="jobs"
            onEdit={handleEdit}
            onAdd={handleAdd}
            onRefresh={fetchContent}
          />
        </TabsContent>
      </Tabs>
    </div>
  );

};

export default AdminPage;