import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus } from "lucide-react";

type Role = "admin" | "staff";

interface AdminUser {
  id: number;
  email: string;
  role: Role;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("staff");
  const [editing, setEditing] = useState<AdminUser | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });

    setUsers(data || []);
  };

  const saveUser = async () => {
    if (!email) return alert("Email required");

    if (editing) {
      await supabase
        .from("admin_users")
        .update({ role })
        .eq("id", editing.id);
    } else {
      await supabase.from("admin_users").insert([{ email, role }]);
    }

    reset();
    fetchUsers();
  };

  const reset = () => {
    setEmail("");
    setRole("staff");
    setEditing(null);
  };

  const editUser = (u: AdminUser) => {
    setEditing(u);
    setEmail(u.email);
    setRole(u.role);
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this admin user?")) return;
    await supabase.from("admin_users").delete().eq("id", id);
    fetchUsers();
  };

  return (
    <AdminLayout>
      <div className="p-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Admin Users</h1>

        <div className="bg-muted p-6 rounded mb-8">
          <input
            className="w-full p-2 border rounded mb-3"
            placeholder="Email"
            disabled={!!editing}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <select
            className="w-full p-2 border rounded mb-4"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>

          <Button onClick={saveUser} className="w-full">
            {editing ? "Update User" : "Add User"} <Plus className="ml-2" />
          </Button>
        </div>

        {users.map((u) => (
          <div key={u.id} className="flex justify-between bg-card p-4 rounded mb-3">
            <div>
              <p className="font-medium">{u.email}</p>
              <p className="text-sm text-muted-foreground">{u.role}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => editUser(u)}>
                <Edit size={16} />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => remove(u.id)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
