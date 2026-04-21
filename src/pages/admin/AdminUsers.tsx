import { useEffect, useState } from "react";
import { Edit, Plus, RefreshCw, Trash2 } from "lucide-react";

import AdminLayout from "./AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Role = "admin" | "staff";

interface AdminUser {
  id: number;
  email: string;
  role: Role;
}

export default function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("staff");
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      toast({
        title: "Unable to load admin users",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setUsers(data || []);
    setLoading(false);
  };

  const saveUser = async () => {
    if (!email.trim()) {
      toast({
        title: "Email is required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    const response = editing
      ? await supabase.from("admin_users").update({ role }).eq("id", editing.id)
      : await supabase.from("admin_users").insert([{ email: email.trim(), role }]);

    if (response.error) {
      toast({
        title: "Unable to save admin user",
        description: response.error.message,
        variant: "destructive",
      });
      setSaving(false);
      return;
    }

    resetForm();
    await fetchUsers();
    setSaving(false);
    toast({
      title: editing ? "Admin user updated" : "Admin user added",
    });
  };

  const resetForm = () => {
    setEmail("");
    setRole("staff");
    setEditing(null);
  };

  const editUser = (user: AdminUser) => {
    setEditing(user);
    setEmail(user.email);
    setRole(user.role);
  };

  const removeUser = async (id: number) => {
    const confirmed = window.confirm("Delete this admin user?");

    if (!confirmed) {
      return;
    }

    const { error } = await supabase.from("admin_users").delete().eq("id", id);

    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (editing?.id === id) {
      resetForm();
    }

    await fetchUsers();
    toast({
      title: "Admin user deleted",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6 md:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Users</h1>
            <p className="text-muted-foreground">
              Control which emails have admin or staff access to the dashboard.
            </p>
          </div>

          <Button variant="outline" onClick={() => void fetchUsers()} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{editing ? "Edit Access" : "Add Admin User"}</CardTitle>
            <CardDescription>
              Add a new email or update the access role for an existing account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Email"
              disabled={Boolean(editing)}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
            >
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>

            <div className="flex gap-3">
              <Button onClick={() => void saveUser()} disabled={saving}>
                <Plus className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : editing ? "Update User" : "Add User"}
              </Button>
              {editing && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel Edit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Admin Users</CardTitle>
            <CardDescription>{users.length} users currently have dashboard access.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading admin users...</p>
            ) : users.length === 0 ? (
              <p className="text-muted-foreground">No admin users found.</p>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex justify-between rounded bg-card p-4 shadow">
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-muted-foreground">{user.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => editUser(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => void removeUser(user.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
