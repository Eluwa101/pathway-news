import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JobsFieldsProps {
  editingItem: any;
}

export const JobsFields = ({ editingItem }: JobsFieldsProps) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="title">Job Title</Label>
        <Input id="title" name="title" defaultValue={editingItem?.title || ''} required />
      </div>
      <div>
        <Label htmlFor="company">Company</Label>
        <Input id="company" name="company" defaultValue={editingItem?.company || ''} required />
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" name="location" placeholder="Remote, New York, etc." defaultValue={editingItem?.location || ''} required />
      </div>
      <div>
        <Label htmlFor="salary_range">Salary Range</Label>
        <Input id="salary_range" name="salary_range" placeholder="$50,000 - $70,000" defaultValue={editingItem?.salary_range || ''} />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="job_type">Job Type</Label>
        <Select name="job_type" defaultValue={editingItem?.job_type || 'full-time'} required>
          <SelectTrigger>
            <SelectValue placeholder="Select job type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full-time">Full-time</SelectItem>
            <SelectItem value="part-time">Part-time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="experience_level">Experience Level</Label>
        <Select name="experience_level" defaultValue={editingItem?.experience_level || 'entry-level'} required>
          <SelectTrigger>
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="entry-level">Entry Level</SelectItem>
            <SelectItem value="mid-level">Mid Level</SelectItem>
            <SelectItem value="senior-level">Senior Level</SelectItem>
            <SelectItem value="executive">Executive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select name="category" defaultValue={editingItem?.category || ''} required>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Business">Business</SelectItem>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div>
      <Label htmlFor="description">Description</Label>
      <Textarea id="description" name="description" rows={6} defaultValue={editingItem?.description || ''} required />
    </div>

    <div>
      <Label htmlFor="requirements">Requirements (comma separated)</Label>
      <Textarea 
        id="requirements" 
        name="requirements" 
        rows={3}
        placeholder="Bachelor's degree, 2+ years experience, etc."
        defaultValue={editingItem?.requirements?.join(', ') || ''} 
      />
    </div>

    <div>
      <Label htmlFor="benefits">Benefits (comma separated)</Label>
      <Textarea 
        id="benefits" 
        name="benefits" 
        rows={2}
        placeholder="Health insurance, 401k, Remote work, etc."
        defaultValue={editingItem?.benefits?.join(', ') || ''} 
      />
    </div>

    <div>
      <Label htmlFor="tags">Tags (comma separated)</Label>
      <Input 
        id="tags" 
        name="tags" 
        placeholder="React, JavaScript, Marketing, etc."
        defaultValue={editingItem?.tags?.join(', ') || ''} 
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="application_url">Application URL</Label>
        <Input id="application_url" name="application_url" type="url" defaultValue={editingItem?.application_url || ''} required />
      </div>
      <div>
        <Label htmlFor="contact_email">Contact Email (Optional)</Label>
        <Input id="contact_email" name="contact_email" type="email" defaultValue={editingItem?.contact_email || ''} />
      </div>
    </div>

    <div>
      <Label htmlFor="deadline">Application Deadline</Label>
      <Input 
        id="deadline" 
        name="deadline" 
        type="date" 
        defaultValue={editingItem?.deadline || ''}
      />
    </div>

    <div className="flex gap-4">
      <label className="flex items-center space-x-2">
        <input type="checkbox" name="is_featured" defaultChecked={editingItem?.is_featured ?? false} />
        <span>Featured Job</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="checkbox" name="is_published" defaultChecked={editingItem?.is_published ?? true} />
        <span>Publish</span>
      </label>
    </div>
  </>
);
