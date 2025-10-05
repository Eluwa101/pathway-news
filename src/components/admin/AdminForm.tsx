// React state management
import { useState } from "react";
// Rich text editor for news content
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Supabase client for database operations
import { supabase } from "@/integrations/supabase/client";
// Toast notifications
import { useToast } from "@/hooks/use-toast";
// Icons
import { Plus, Calendar, Image, Video } from "lucide-react";
// Jobs-specific form fields component
import { JobsFields } from "./JobsFields";

// Props interface for the AdminForm component
interface AdminFormProps {
  type: string; // Display name of the content type
  tableName: 'news' | 'books' | 'devotionals' | 'career_events' | 'whatsapp_groups' | 'jobs'; // Database table name
  editingItem: any; // Item being edited (null for new items)
  onSuccess: () => void; // Callback after successful save
  onCancel: () => void; // Callback when user cancels
}

// Main AdminForm component for creating/editing content
export const AdminForm = ({ type, tableName, editingItem, onSuccess, onCancel }: AdminFormProps) => {
  // Loading state for form submission
  const [isLoading, setIsLoading] = useState(false);
  // State for rich text content (used for news articles)
  const [content, setContent] = useState(editingItem?.content || '');
  // Toast notifications
  const { toast } = useToast();

  // Rich text editor configuration (toolbar options)
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }], // Header levels
      ['bold', 'italic', 'underline'], // Text formatting
      [{ 'color': [] }, { 'background': [] }], // Text and background colors
      [{ 'list': 'ordered'}, { 'list': 'bullet' }], // Lists
      ['link'], // Hyperlinks
      ['clean'] // Remove formatting
    ],
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Extract form data
    const formData = new FormData(e.currentTarget);
    
    try {
      let result;
      let data: any = {}; // Object to hold processed form data

      // Build data object based on form fields
      const formEntries = Array.from(formData.entries());
      formEntries.forEach(([key, value]) => {
        if (key === 'tags' || key === 'topics' || key === 'requirements' || key === 'benefits') {
          data[key] = (value as string)?.split(',').map(item => item.trim()).filter(Boolean) || [];
        } else if (key === 'steps' || key === 'skills') {
          if (key === 'steps') {
            data[key] = (value as string)?.split('\n').filter(item => item.trim()) || [];
          } else {
            data[key] = (value as string)?.split(',').map(item => item.trim()).filter(Boolean) || [];
          }
        } else if (key === 'members' || key === 'attendees' || key === 'duration_minutes') {
          data[key] = parseInt(value as string) || 0;
        } else if (key === 'is_published' || key === 'is_hot' || key === 'is_active' || key === 'registration_required' || key === 'featured_on_homepage' || key === 'is_featured') {
          data[key] = value === 'on';
        } else if (key.startsWith('image_url_')) {
          // Collect image URLs into array
          if (!data.image_urls) data.image_urls = [];
          if (value && (value as string).trim()) {
            data.image_urls.push((value as string).trim());
          }
        } else {
          data[key] = value as string;
        }
      });

      // Add rich text content for news
      if (tableName === 'news') {
        data.content = content;
      }

      if (editingItem) {
        result = await supabase.from(tableName).update(data).eq('id', editingItem.id).select();
      } else {
        result = await supabase.from(tableName).insert([data]).select();
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `${type} ${editingItem ? 'updated' : 'created'} successfully`
      });
      
      onSuccess();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingItem ? 'update' : 'create'} ${type}`,
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const renderNewsFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={editingItem?.title || ''} required />
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
        <Textarea id="summary" name="summary" defaultValue={editingItem?.summary || ''} required />
      </div>
      <div>
        <Label htmlFor="content">Content</Label>
        <ReactQuill 
          theme="snow" 
          value={content} 
          onChange={setContent}
          modules={quillModules}
          className="bg-background rounded-md"
        />
      </div>
      <div>
        <Label htmlFor="video_url">
          <Video className="h-4 w-4 inline mr-2" />
          Video URL (YouTube, etc.)
        </Label>
        <Input id="video_url" name="video_url" type="url" placeholder="https://www.youtube.com/watch?v=..." defaultValue={editingItem?.video_url || ''} />
      </div>
      <div>
        <Label htmlFor="image_url_1">
          <Image className="h-4 w-4 inline mr-2" />
          Image URL 1
        </Label>
        <Input id="image_url_1" name="image_url_1" type="url" placeholder="https://example.com/image1.jpg" defaultValue={editingItem?.image_urls?.[0] || ''} />
      </div>
      <div>
        <Label htmlFor="image_url_2">
          <Image className="h-4 w-4 inline mr-2" />
          Image URL 2
        </Label>
        <Input id="image_url_2" name="image_url_2" type="url" placeholder="https://example.com/image2.jpg" defaultValue={editingItem?.image_urls?.[1] || ''} />
      </div>
      <div>
        <Label htmlFor="image_url_3">
          <Image className="h-4 w-4 inline mr-2" />
          Image URL 3
        </Label>
        <Input id="image_url_3" name="image_url_3" type="url" placeholder="https://example.com/image3.jpg" defaultValue={editingItem?.image_urls?.[2] || ''} />
      </div>
      <div>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input id="tags" name="tags" placeholder="tag1, tag2, tag3" defaultValue={editingItem?.tags?.join(', ') || ''} />
      </div>
      <div className="flex gap-4">
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="is_hot" defaultChecked={editingItem?.is_hot || false} />
          <span>Mark as Hot News</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="is_published" defaultChecked={editingItem?.is_published ?? true} />
          <span>Publish</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="featured_on_homepage" defaultChecked={editingItem?.featured_on_homepage || false} />
          <span>Feature on Homepage</span>
        </label>
      </div>
    </>
  );

  const renderBookFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={editingItem?.title || ''} required />
        </div>
        <div>
          <Label htmlFor="author">Author</Label>
          <Input id="author" name="author" defaultValue={editingItem?.author || ''} required />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={editingItem?.description || ''} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="file_url">File URL (PDF)</Label>
          <Input id="file_url" name="file_url" type="url" defaultValue={editingItem?.file_url || ''} required />
        </div>
        <div>
          <Label htmlFor="cover_image_url">Cover Image URL</Label>
          <Input id="cover_image_url" name="cover_image_url" type="url" defaultValue={editingItem?.cover_image_url || ''} />
        </div>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select name="category" defaultValue={editingItem?.category || ''} required>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="academic">Academic</SelectItem>
            <SelectItem value="spiritual">Spiritual</SelectItem>
            <SelectItem value="career">Career Development</SelectItem>
            <SelectItem value="personal">Personal Development</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="is_published" defaultChecked={editingItem?.is_published ?? true} />
          <span>Publish</span>
        </label>
      </div>
    </>
  );

  const renderDevotionalFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={editingItem?.title || ''} required />
        </div>
        <div>
          <Label htmlFor="author">Author</Label>
          <Input id="author" name="author" defaultValue={editingItem?.author || ''} required />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="speaker">Speaker</Label>
          <Input id="speaker" name="speaker" defaultValue={editingItem?.speaker || ''} required />
        </div>
        <div>
          <Label htmlFor="event_time">Event Time</Label>
          <Input id="event_time" name="event_time" placeholder="e.g., 7:00 PM MT" defaultValue={editingItem?.event_time || ''} />
        </div>
      </div>
      <div>
        <Label htmlFor="cover_image_url">Cover Image URL</Label>
        <Input id="cover_image_url" name="cover_image_url" type="url" placeholder="https://example.com/cover-image.jpg" defaultValue={editingItem?.cover_image_url || ''} />
      </div>
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" name="content" rows={8} defaultValue={editingItem?.content || ''} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="scripture_reference">Scripture Reference</Label>
          <Input id="scripture_reference" name="scripture_reference" placeholder="e.g., John 3:16" defaultValue={editingItem?.scripture_reference || ''} />
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
          />
        </div>
      </div>
      <div>
        <Label htmlFor="topics">Topics (comma separated)</Label>
        <Input id="topics" name="topics" placeholder="Faith, Learning, Spiritual Growth" defaultValue={editingItem?.topics?.join(', ') || ''} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="live_link">Live Link</Label>
          <Input id="live_link" name="live_link" type="url" defaultValue={editingItem?.live_link || ''} />
        </div>
        <div>
          <Label htmlFor="recording_link">Recording Link</Label>
          <Input id="recording_link" name="recording_link" type="url" defaultValue={editingItem?.recording_link || ''} />
        </div>
        <div>
          <Label htmlFor="download_link">Download Link</Label>
          <Input id="download_link" name="download_link" type="url" defaultValue={editingItem?.download_link || ''} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={editingItem?.status || 'upcoming'} required>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="flex items-center space-x-2 pt-6">
            <input type="checkbox" name="is_published" defaultChecked={editingItem?.is_published ?? true} />
            <span>Publish</span>
          </label>
        </div>
        <div>
          <label className="flex items-center space-x-2 pt-6">
            <input type="checkbox" name="featured_on_homepage" defaultChecked={editingItem?.featured_on_homepage || false} />
            <span>Feature on Homepage</span>
          </label>
        </div>
      </div>
    </>
  );

  const renderCareerEventFields = () => (
    <>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={editingItem?.title || ''} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={editingItem?.description || ''} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="speaker">Speaker</Label>
          <Input id="speaker" name="speaker" defaultValue={editingItem?.speaker || ''} required />
        </div>
        <div>
          <Label htmlFor="position">Position/Title</Label>
          <Input id="position" name="position" placeholder="e.g., CEO, TechCorp Solutions" defaultValue={editingItem?.position || ''} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Select name="industry" defaultValue={editingItem?.industry || ''} required>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Legal">Legal</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
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
          <Input id="location" name="location" defaultValue={editingItem?.location || ''} required />
        </div>
        <div>
          <Label htmlFor="attendees">Expected Attendees</Label>
          <Input id="attendees" name="attendees" type="number" defaultValue={editingItem?.attendees || '0'} />
        </div>
      </div>
      <div>
        <Label htmlFor="topics">Topics (comma separated)</Label>
        <Input id="topics" name="topics" placeholder="Leadership, Management, Digital Transformation" defaultValue={editingItem?.topics?.join(', ') || ''} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="registration_url">Registration URL</Label>
          <Input id="registration_url" name="registration_url" type="url" defaultValue={editingItem?.registration_url || ''} />
        </div>
        <div>
          <Label htmlFor="live_link">Live Link</Label>
          <Input id="live_link" name="live_link" type="url" defaultValue={editingItem?.live_link || ''} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="recording_link">Recording Link</Label>
          <Input id="recording_link" name="recording_link" type="url" defaultValue={editingItem?.recording_link || ''} />
        </div>
        <div>
          <Label htmlFor="download_link">Download Link</Label>
          <Input id="download_link" name="download_link" type="url" defaultValue={editingItem?.download_link || ''} />
        </div>
      </div>
      <div>
        <Label htmlFor="cover_image_url">Cover Image URL</Label>
        <Input id="cover_image_url" name="cover_image_url" type="url" placeholder="https://example.com/cover-image.jpg" defaultValue={editingItem?.cover_image_url || ''} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={editingItem?.status || 'upcoming'} required>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="flex items-center space-x-2 pt-6">
            <input type="checkbox" name="registration_required" defaultChecked={editingItem?.registration_required ?? false} />
            <span>Registration Required</span>
          </label>
        </div>
        <div>
          <label className="flex items-center space-x-2 pt-6">
            <input type="checkbox" name="is_published" defaultChecked={editingItem?.is_published ?? true} />
            <span>Publish</span>
          </label>
        </div>
        <div>
          <label className="flex items-center space-x-2 pt-6">
            <input type="checkbox" name="featured_on_homepage" defaultChecked={editingItem?.featured_on_homepage || false} />
            <span>Feature on Homepage</span>
          </label>
        </div>
      </div>
    </>
  );

  const renderWhatsAppGroupFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Group Name</Label>
          <Input id="name" name="name" defaultValue={editingItem?.name || ''} required />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select name="category" defaultValue={editingItem?.category || ''} required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Major">Major</SelectItem>
              <SelectItem value="Course">Course</SelectItem>
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={editingItem?.description || ''} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="link">WhatsApp Link</Label>
          <Input id="link" name="link" type="url" placeholder="https://chat.whatsapp.com/..." defaultValue={editingItem?.link || ''} required />
        </div>
        <div>
          <Label htmlFor="members">Members Count</Label>
          <Input id="members" name="members" type="number" defaultValue={editingItem?.members || '0'} required />
        </div>
        <div>
          <Label htmlFor="icon">Icon</Label>
          <Select name="icon" defaultValue={editingItem?.icon || 'MessageCircle'} required>
            <SelectTrigger>
              <SelectValue placeholder="Select icon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MessageCircle">Message Circle</SelectItem>
              <SelectItem value="Users">Users</SelectItem>
              <SelectItem value="Briefcase">Briefcase</SelectItem>
              <SelectItem value="BookOpen">Book Open</SelectItem>
              <SelectItem value="GraduationCap">Graduation Cap</SelectItem>
              <SelectItem value="Code">Code</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="color">Color Class</Label>
        <Select name="color" defaultValue={editingItem?.color || 'bg-gray-100 text-gray-800'} required>
          <SelectTrigger>
            <SelectValue placeholder="Select color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bg-blue-100 text-blue-800">Blue</SelectItem>
            <SelectItem value="bg-green-100 text-green-800">Green</SelectItem>
            <SelectItem value="bg-red-100 text-red-800">Red</SelectItem>
            <SelectItem value="bg-purple-100 text-purple-800">Purple</SelectItem>
            <SelectItem value="bg-yellow-100 text-yellow-800">Yellow</SelectItem>
            <SelectItem value="bg-indigo-100 text-indigo-800">Indigo</SelectItem>
            <SelectItem value="bg-orange-100 text-orange-800">Orange</SelectItem>
            <SelectItem value="bg-teal-100 text-teal-800">Teal</SelectItem>
            <SelectItem value="bg-pink-100 text-pink-800">Pink</SelectItem>
            <SelectItem value="bg-gray-100 text-gray-800">Gray</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="is_active" defaultChecked={editingItem?.is_active ?? true} />
          <span>Active Group</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="is_published" defaultChecked={editingItem?.is_published ?? true} />
          <span>Publish</span>
        </label>
      </div>
    </>
  );

  const getFieldsForType = () => {
    switch (type.toLowerCase()) {
      case 'news': return renderNewsFields();
      case 'books': return renderBookFields();
      case 'devotionals': return renderDevotionalFields();
      case 'career_events': return renderCareerEventFields();
      case 'whatsapp_groups': return renderWhatsAppGroupFields();
      case 'jobs': return <JobsFields editingItem={editingItem} />;
      default: return null;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {editingItem ? `Edit ${type}` : `Add ${type}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {getFieldsForType()}
          
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : editingItem ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};