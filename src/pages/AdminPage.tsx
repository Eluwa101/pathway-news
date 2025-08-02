import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Upload, Edit, Trash2, Eye, Calendar, Clock, Video, Image } from "lucide-react";
import { Link } from "react-router-dom";

interface News {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  is_hot: boolean;
  is_published: boolean;
  created_at: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  file_url: string;
  cover_image_url: string;
  category: string;
  is_published: boolean;
  created_at: string;
}

interface Recording {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  video_url?: string;
  duration_minutes: number;
  category: string;
  is_published: boolean;
  created_at: string;
}

interface Devotional {
  id: string;
  title: string;
  content: string;
  scripture_reference: string;
  author: string;
  is_published: boolean;
  created_at: string;
}

interface CareerEvent {
  id: string;
  title: string;
  description: string;
  speaker: string;
  event_date: string;
  location: string;
  registration_url: string;
  is_published: boolean;
  created_at: string;
}

const AdminPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("news");
  
  // Content state
  const [news, setNews] = useState<News[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [careerEvents, setCareerEvents] = useState<CareerEvent[]>([]);
  
  // Editing state
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [newsRes, booksRes, recordingsRes, devotionalsRes, eventsRes] = await Promise.all([
        supabase.from('news').select('*').order('created_at', { ascending: false }),
        supabase.from('books').select('*').order('created_at', { ascending: false }),
        supabase.from('recordings').select('*').order('created_at', { ascending: false }),
        supabase.from('devotionals').select('*').order('created_at', { ascending: false }),
        supabase.from('career_events').select('*').order('created_at', { ascending: false })
      ]);

      if (newsRes.data) setNews(newsRes.data);
      if (booksRes.data) setBooks(booksRes.data);
      if (recordingsRes.data) setRecordings(recordingsRes.data);
      if (devotionalsRes.data) setDevotionals(devotionalsRes.data);
      if (eventsRes.data) setCareerEvents(eventsRes.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch content",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, type: string) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      let result;
      
      switch (type) {
        case 'news':
          const newsData = {
            title: formData.get('title') as string,
            content: formData.get('content') as string,
            summary: formData.get('summary') as string,
            category: formData.get('category') as string,
            tags: (formData.get('tags') as string)?.split(',').map(tag => tag.trim()) || [],
            is_hot: formData.get('is_hot') === 'on',
            is_published: formData.get('is_published') === 'on'
          };
          if (editingItem) {
            result = await supabase.from('news').update(newsData).eq('id', editingItem.id);
          } else {
            result = await supabase.from('news').insert([newsData]);
          }
          break;
          
        case 'books':
          const bookData = {
            title: formData.get('title') as string,
            author: formData.get('author') as string,
            description: formData.get('description') as string,
            file_url: formData.get('file_url') as string,
            cover_image_url: formData.get('cover_image_url') as string,
            category: formData.get('category') as string,
            is_published: formData.get('is_published') === 'on'
          };
          if (editingItem) {
            result = await supabase.from('books').update(bookData).eq('id', editingItem.id);
          } else {
            result = await supabase.from('books').insert([bookData]);
          }
          break;
          
        case 'recordings':
          const recordingData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            audio_url: formData.get('audio_url') as string,
            duration_minutes: parseInt(formData.get('duration_minutes') as string),
            category: formData.get('category') as string,
            is_published: formData.get('is_published') === 'on'
          };
          if (editingItem) {
            result = await supabase.from('recordings').update(recordingData).eq('id', editingItem.id);
          } else {
            result = await supabase.from('recordings').insert([recordingData]);
          }
          break;
          
        case 'devotionals':
          const devotionalData = {
            title: formData.get('title') as string,
            content: formData.get('content') as string,
            scripture_reference: formData.get('scripture_reference') as string,
            author: formData.get('author') as string,
            is_published: formData.get('is_published') === 'on'
          };
          if (editingItem) {
            result = await supabase.from('devotionals').update(devotionalData).eq('id', editingItem.id);
          } else {
            result = await supabase.from('devotionals').insert([devotionalData]);
          }
          break;
          
        case 'events':
          const eventData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            speaker: formData.get('speaker') as string,
            event_date: formData.get('event_date') as string,
            location: formData.get('location') as string,
            registration_url: formData.get('registration_url') as string,
            is_published: formData.get('is_published') === 'on'
          };
          if (editingItem) {
            result = await supabase.from('career_events').update(eventData).eq('id', editingItem.id);
          } else {
            result = await supabase.from('career_events').insert([eventData]);
          }
          break;
      }

      if (result?.error) throw result.error;

      toast({
        title: "Success",
        description: `${type} ${editingItem ? 'updated' : 'created'} successfully`
      });
      
      (e.target as HTMLFormElement).reset();
      setEditingItem(null);
      setShowForm(false);
      fetchContent();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingItem ? 'update' : 'create'} ${type}`,
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string, table: 'news' | 'books' | 'recordings' | 'devotionals' | 'career_events') => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Item deleted successfully"
      });
      fetchContent();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  const renderContentList = (items: any[], type: string, tableName: 'news' | 'books' | 'recordings' | 'devotionals' | 'career_events') => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{type} Content</h3>
        <Button onClick={() => { setEditingItem(null); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      </div>
      
      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.summary || item.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={item.is_published ? "default" : "secondary"}>
                      {item.is_published ? "Published" : "Draft"}
                    </Badge>
                    {item.is_hot && <Badge variant="destructive">Hot</Badge>}
                    {item.category && <Badge variant="outline">{item.category}</Badge>}
                    {item.event_date && (
                      <Badge variant={isUpcoming(item.event_date) ? "default" : "secondary"}>
                        <Clock className="h-3 w-3 mr-1" />
                        {isUpcoming(item.event_date) ? "Upcoming" : "Past"}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {type === 'News' && (
                    <Button asChild size="sm" variant="ghost">
                      <Link to={`/news/${item.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { setEditingItem(item); setShowForm(true); }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(item.id, tableName)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderForm = (type: string) => {
    if (!showForm) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editingItem ? `Edit ${type}` : `Add ${type}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleSubmit(e, type.toLowerCase())} className="space-y-4">
            {type === 'News' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      defaultValue={editingItem?.title || ''}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" defaultValue={editingItem?.category || ''} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="student-life">Student Life</SelectItem>
                        <SelectItem value="career">Career</SelectItem>
                        <SelectItem value="spiritual">Spiritual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea 
                    id="summary" 
                    name="summary" 
                    defaultValue={editingItem?.summary || ''}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea 
                    id="content" 
                    name="content" 
                    rows={8} 
                    defaultValue={editingItem?.content || ''}
                    required 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="image_url">
                      <Image className="h-4 w-4 inline mr-2" />
                      Image URL
                    </Label>
                    <Input 
                      id="image_url" 
                      name="image_url" 
                      type="url" 
                      defaultValue={editingItem?.image_url || ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="video_url">
                      <Video className="h-4 w-4 inline mr-2" />
                      Video URL
                    </Label>
                    <Input 
                      id="video_url" 
                      name="video_url" 
                      type="url" 
                      defaultValue={editingItem?.video_url || ''}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input 
                    id="tags" 
                    name="tags" 
                    placeholder="tag1, tag2, tag3" 
                    defaultValue={editingItem?.tags?.join(', ') || ''}
                  />
                </div>
              </>
            )}

            {type === 'Recording' && (
              <>
                <div>
                  <Label htmlFor="recording-title">Title</Label>
                  <Input 
                    id="recording-title" 
                    name="title" 
                    defaultValue={editingItem?.title || ''}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="recording-description">Description</Label>
                  <Textarea 
                    id="recording-description" 
                    name="description" 
                    defaultValue={editingItem?.description || ''}
                    required 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="audio_url">Audio URL</Label>
                    <Input 
                      id="audio_url" 
                      name="audio_url" 
                      type="url" 
                      defaultValue={editingItem?.audio_url || ''}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="video_url">
                      <Video className="h-4 w-4 inline mr-2" />
                      Video URL
                    </Label>
                    <Input 
                      id="video_url" 
                      name="video_url" 
                      type="url" 
                      defaultValue={editingItem?.video_url || ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                    <Input 
                      id="duration_minutes" 
                      name="duration_minutes" 
                      type="number" 
                      defaultValue={editingItem?.duration_minutes || ''}
                      required 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="recording-category">Category</Label>
                  <Select name="category" defaultValue={editingItem?.category || ''} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="devotional">Devotional</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="career">Career</SelectItem>
                      <SelectItem value="testimony">Testimony</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {type === 'Event' && (
              <>
                <div>
                  <Label htmlFor="event-title">Title</Label>
                  <Input 
                    id="event-title" 
                    name="title" 
                    defaultValue={editingItem?.title || ''}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea 
                    id="event-description" 
                    name="description" 
                    defaultValue={editingItem?.description || ''}
                    required 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="speaker">Speaker</Label>
                    <Input 
                      id="speaker" 
                      name="speaker" 
                      defaultValue={editingItem?.speaker || ''}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="event_date">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Event Date & Time
                    </Label>
                    <Input 
                      id="event_date" 
                      name="event_date" 
                      type="datetime-local" 
                      defaultValue={editingItem?.event_date ? new Date(editingItem.event_date).toISOString().slice(0, 16) : ''}
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      name="location" 
                      defaultValue={editingItem?.location || ''}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="registration_url">Registration URL</Label>
                    <Input 
                      id="registration_url" 
                      name="registration_url" 
                      type="url" 
                      defaultValue={editingItem?.registration_url || ''}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  name="is_hot" 
                  defaultChecked={editingItem?.is_hot || false}
                />
                <span>Mark as Hot News</span>
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  name="is_published" 
                  defaultChecked={editingItem?.is_published ?? true}
                />
                <span>Publish</span>
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : editingItem ? "Update" : "Create"}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingItem(null); }}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage all content for BYU-Pathway Connect</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="recordings">Recordings</TabsTrigger>
          <TabsTrigger value="devotionals">Devotionals</TabsTrigger>
          <TabsTrigger value="events">Career Events</TabsTrigger>
        </TabsList>

        <TabsContent value="news">
          {renderForm('News')}
          {renderContentList(news, 'News', 'news')}
        </TabsContent>

        <TabsContent value="recordings">
          {renderForm('Recording')}
          {renderContentList(recordings, 'Recording', 'recordings')}
        </TabsContent>

        <TabsContent value="events">
          {renderForm('Event')}
          {renderContentList(careerEvents, 'Event', 'career_events')}
        </TabsContent>

        <TabsContent value="books">
          {renderContentList(books, 'Book', 'books')}
        </TabsContent>

        <TabsContent value="devotionals">
          {renderContentList(devotionals, 'Devotional', 'devotionals')}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;