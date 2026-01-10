import { useState, useEffect } from "react";
import { CommitteeMember } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Search, Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "./ImageUpload";

export default function CommitteeManagement() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Omit<CommitteeMember, "id">>({
    position: "",
    name: "",
    church: "",
    phone: "",
    category: "leadership",
    image: "",
    email: "",
    order: 1,
    active: true,
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await fetch("/api/admin/committee");
      const data = await response.json();
      if (Array.isArray(data)) {
        setMembers(data);
      }
    } catch (error) {
      console.error("Error loading committee members:", error);
      toast({
        title: "Error",
        description: "Failed to load committee members. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember) {
        const response = await fetch(`/api/admin/committee/${editingMember.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to update committee member");

        toast({
          title: "Committee member updated",
          description: "Committee member information has been updated successfully.",
        });
      } else {
        const response = await fetch("/api/admin/committee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to create committee member");
        }

        toast({
          title: "Committee member added",
          description: "New committee member has been added successfully.",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      loadMembers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save committee member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (member: CommitteeMember) => {
    setEditingMember(member);
    setFormData({
      position: member.position,
      name: member.name,
      church: member.church,
      phone: member.phone,
      category: member.category,
      image: member.image || "",
      email: member.email || "",
      order: member.order,
      active: member.active !== false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/committee/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete committee member");

      toast({
        title: "Committee member deleted",
        description: "Committee member has been deleted successfully.",
      });
      loadMembers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete committee member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingMember(null);
    setFormData({
      position: "",
      name: "",
      church: "",
      phone: "",
      category: "leadership",
      image: "",
      email: "",
      order: 1,
      active: true,
    });
  };


  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      searchTerm === "" ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.church.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || member.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "leadership":
        return <Badge className="bg-blue-500">Leadership</Badge>;
      case "team":
        return <Badge className="bg-green-500">Team</Badge>;
      case "auditor":
        return <Badge className="bg-purple-500">Auditor</Badge>;
      case "asa_representatives":
        return <Badge className="bg-orange-500">ASA Representatives</Badge>;
      case "board_chancellors":
        return <Badge className="bg-red-500">Board of Chancellors</Badge>;
      default:
        return <Badge>{category}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Committee Management</h2>
            <p className="text-foreground/70">Manage committee members and leadership</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingMember ? "Edit Committee Member" : "Add Committee Member"}</DialogTitle>
              <DialogDescription>
                {editingMember ? "Update committee member information" : "Add a new committee member to display on the About page"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="e.g., Student President"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="church">Church Location *</Label>
                  <Input
                    id="church"
                    value={formData.church}
                    onChange={(e) => setFormData({ ...formData, church: e.target.value })}
                    placeholder="e.g., ASSA UR NYARUGENGE"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0788871440"
                    required
                  />
                  <p className="text-xs text-foreground/60">Will display as +2507...</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as "leadership" | "team" | "auditor" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leadership">Leadership Team</SelectItem>
                      <SelectItem value="team">Team & Department Heads</SelectItem>
                      <SelectItem value="auditor">Auditors Team</SelectItem>
                      <SelectItem value="asa_representatives">ASA Representatives</SelectItem>
                      <SelectItem value="board_chancellors">Board of Chancellors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                    min="1"
                  />
                  <p className="text-xs text-foreground/60">Lower numbers appear first</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Member Photo (Optional)</Label>
                <ImageUpload
                  value={formData.image}
                  onChange={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
                  category="committee"
                  label="Upload Member Photo"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-border"
                />
                <Label htmlFor="active" className="font-normal cursor-pointer">
                  Active (visible on About page)
                </Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingMember ? "Update" : "Add"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Committee Members</CardTitle>
          <CardDescription>Manage committee members displayed on the About page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, position, or church..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="leadership">Leadership</SelectItem>
                <SelectItem value="team">Team & Department</SelectItem>
                <SelectItem value="auditor">Auditors</SelectItem>
                <SelectItem value="asa_representatives">ASA Representatives</SelectItem>
                <SelectItem value="board_chancellors">Board of Chancellors</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Church</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No committee members found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary/60" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{member.position}</TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell className="text-sm">{member.church}</TableCell>
                      <TableCell className="text-sm">+250{member.phone.startsWith("0") ? member.phone.substring(1) : member.phone}</TableCell>
                      <TableCell>{getCategoryBadge(member.category)}</TableCell>
                      <TableCell>{member.order}</TableCell>
                      <TableCell>
                        {member.active !== false ? (
                          <Badge variant="default" className="bg-green-500">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(member)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the committee member "{member.name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(member.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
