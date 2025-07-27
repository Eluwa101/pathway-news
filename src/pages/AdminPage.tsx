import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Upload } from "lucide-react";

const AdminPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleNewsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const newsData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      summary: formData.get('summary') as string,
      category: formData.get('category') as string,
      tags: (formData.get('tags') as string)?.split(',').map(tag => tag.trim()) || [],
      is_hot: formData.get('is_hot') === 'on',
      is_published: formData.get('is_published') === 'on'
    };

    const { error } = await supabase.from('news').insert([newsData]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create news article",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "News article created successfully"
      });
      (e.target as HTMLFormElement).reset();
    }
    setIsLoading(false);
  };

  const handleBookSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const bookData = {
      title: formData.get('title') as string,
      author: formData.get('author') as string,
      description: formData.get('description') as string,
      file_url: formData.get('file_url') as string,
      cover_image_url: formData.get('cover_image_url') as string,
      category: formData.get('category') as string,
      is_published: formData.get('is_published') === 'on'
    };

    const { error } = await supabase.from('books').insert([bookData]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add book",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Book added successfully"
      });
      (e.target as HTMLFormElement).reset();
    }
    setIsLoading(false);
  };

  const handleRecordingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const recordingData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      audio_url: formData.get('audio_url') as string,
      duration_minutes: parseInt(formData.get('duration_minutes') as string),
      category: formData.get('category') as string,
      is_published: formData.get('is_published') === 'on'
    };

    const { error } = await supabase.from('recordings').insert([recordingData]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add recording",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Recording added successfully"
      });
      (e.target as HTMLFormElement).reset();
    }
    setIsLoading(false);
  };

  const handleDevotionalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const devotionalData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      scripture_reference: formData.get('scripture_reference') as string,
      author: formData.get('author') as string,
      is_published: formData.get('is_published') === 'on'
    };

    const { error } = await supabase.from('devotionals').insert([devotionalData]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add devotional",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Devotional added successfully"
      });
      (e.target as HTMLFormElement).reset();
    }
    setIsLoading(false);
  };

  const handleCareerEventSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const eventData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      speaker: formData.get('speaker') as string,
      event_date: formData.get('event_date') as string,
      location: formData.get('location') as string,
      registration_url: formData.get('registration_url') as string,
      is_published: formData.get('is_published') === 'on'
    };

    const { error } = await supabase.from('career_events').insert([eventData]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add career event",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Career event added successfully"
      });
      (e.target as HTMLFormElement).reset();
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage content for BYU-Pathway Connect</p>
      </div>

      <Tabs defaultValue="news" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="recordings">Recordings</TabsTrigger>
          <TabsTrigger value="devotionals">Devotionals</TabsTrigger>
          <TabsTrigger value="events">Career Events</TabsTrigger>
        </TabsList>

        <TabsContent value="news">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add News Article
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNewsSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" required />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
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
                  <Textarea id="summary" name="summary" required />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" name="content" rows={8} required />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input id="tags" name="tags" placeholder="tag1, tag2, tag3" />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" name="is_hot" />
                    <span>Mark as Hot News</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" name="is_published" defaultChecked />
                    <span>Publish</span>
                  </label>
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add News Article"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="books">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Add Digital Book
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBookSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="book-title">Title</Label>
                    <Input id="book-title" name="title" required />
                  </div>
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" name="author" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="book-description">Description</Label>
                  <Textarea id="book-description" name="description" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="file_url">File URL</Label>
                    <Input id="file_url" name="file_url" type="url" required />
                  </div>
                  <div>
                    <Label htmlFor="cover_image_url">Cover Image URL</Label>
                    <Input id="cover_image_url" name="cover_image_url" type="url" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="book-category">Category</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="spiritual">Spiritual</SelectItem>
                      <SelectItem value="self-help">Self Help</SelectItem>
                      <SelectItem value="career">Career</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="is_published" defaultChecked />
                  <span>Publish</span>
                </label>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Book"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recordings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Add Recording
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRecordingSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="recording-title">Title</Label>
                  <Input id="recording-title" name="title" required />
                </div>
                <div>
                  <Label htmlFor="recording-description">Description</Label>
                  <Textarea id="recording-description" name="description" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="audio_url">Audio URL</Label>
                    <Input id="audio_url" name="audio_url" type="url" required />
                  </div>
                  <div>
                    <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                    <Input id="duration_minutes" name="duration_minutes" type="number" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="recording-category">Category</Label>
                  <Select name="category" required>
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
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="is_published" defaultChecked />
                  <span>Publish</span>
                </label>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Recording"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devotionals">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Devotional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDevotionalSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="devotional-title">Title</Label>
                    <Input id="devotional-title" name="title" required />
                  </div>
                  <div>
                    <Label htmlFor="devotional-author">Author</Label>
                    <Input id="devotional-author" name="author" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="scripture_reference">Scripture Reference</Label>
                  <Input id="scripture_reference" name="scripture_reference" placeholder="e.g., John 3:16" />
                </div>
                <div>
                  <Label htmlFor="devotional-content">Content</Label>
                  <Textarea id="devotional-content" name="content" rows={8} required />
                </div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="is_published" defaultChecked />
                  <span>Publish</span>
                </label>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Devotional"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Career Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCareerEventSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="event-title">Title</Label>
                  <Input id="event-title" name="title" required />
                </div>
                <div>
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea id="event-description" name="description" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="speaker">Speaker</Label>
                    <Input id="speaker" name="speaker" required />
                  </div>
                  <div>
                    <Label htmlFor="event_date">Event Date & Time</Label>
                    <Input id="event_date" name="event_date" type="datetime-local" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" required />
                  </div>
                  <div>
                    <Label htmlFor="registration_url">Registration URL</Label>
                    <Input id="registration_url" name="registration_url" type="url" />
                  </div>
                </div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="is_published" defaultChecked />
                  <span>Publish</span>
                </label>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Career Event"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;