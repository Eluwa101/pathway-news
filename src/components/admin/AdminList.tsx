import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, Clock, MessageCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminListProps {
  items: any[];
  type: string;
  tableName: 'news' | 'books' | 'devotionals' | 'career_events' | 'whatsapp_groups';
  onEdit: (item: any) => void;
  onAdd: () => void;
  onRefresh: () => void;
}

export const AdminList = ({ items, type, tableName, onEdit, onAdd, onRefresh }: AdminListProps) => {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Item deleted successfully"
      });
      onRefresh();
    } catch (error) {
      console.error('Delete error:', error);
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{type} Content ({items.length})</h3>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      </div>
      
      <div className="grid gap-4">
        {items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No {type.toLowerCase()} found. Create your first one!</p>
            </CardContent>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.title || item.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {item.summary || item.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant={item.is_published ? "default" : "secondary"}>
                        {item.is_published ? "Published" : "Draft"}
                      </Badge>
                      {item.is_hot && <Badge variant="destructive">Hot</Badge>}
                      {item.is_active !== undefined && (
                        <Badge variant={item.is_active ? "default" : "secondary"}>
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {item.is_active ? "Active" : "Inactive"}
                        </Badge>
                      )}
                      {item.members && (
                        <Badge variant="outline">
                          <Users className="h-3 w-3 mr-1" />
                          {item.members} members
                        </Badge>
                      )}
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
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};