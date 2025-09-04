import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminForm } from "@/components/admin/AdminForm";
import { AdminList } from "@/components/admin/AdminList";
import HomepageFeaturedManager from "@/components/admin/HomepageFeaturedManager";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Newspaper, 
  BookOpen, 
  Heart, 
  Video, 
  MessageCircle, 
  BarChart3,
  Star,
  Shield 
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
  const [activeTab, setActiveTab] = useState("news");
  
  // Content state
  const [news, setNews] = useState<AdminContent[]>([]);
  const [books, setBooks] = useState<AdminContent[]>([]);
  const [devotionals, setDevotionals] = useState<AdminContent[]>([]);
  const [careerEvents, setCareerEvents] = useState<AdminContent[]>([]);
  const [whatsappGroups, setWhatsappGroups] = useState<AdminContent[]>([]);
  
  // Form state
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [newsRes, booksRes, devotionalsRes, eventsRes, groupsRes] = await Promise.all([
        supabase.from('news').select('*').order('created_at', { ascending: false }),
        supabase.from('books').select('*').order('created_at', { ascending: false }),
        supabase.from('devotionals').select('*').order('created_at', { ascending: false }),
        supabase.from('career_events').select('*').order('created_at', { ascending: false }),
        supabase.from('whatsapp_groups').select('*').order('created_at', { ascending: false })
      ]);

      if (newsRes.data) setNews(newsRes.data);
      if (booksRes.data) setBooks(booksRes.data);
      if (devotionalsRes.data) setDevotionals(devotionalsRes.data);
      if (eventsRes.data) setCareerEvents(eventsRes.data);
      if (groupsRes.data) setWhatsappGroups(groupsRes.data);
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

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage all content for BYU-Pathway Connect</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="homepage">
            <Star className="h-4 w-4 mr-2" />
            Homepage
          </TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="devotionals">Devotionals</TabsTrigger>
          <TabsTrigger value="career_events">Career Events</TabsTrigger>
          <TabsTrigger value="whatsapp_groups">WhatsApp Groups</TabsTrigger>
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
      </Tabs>
    </div>
  );

};

export default AdminPage;