// // import { useEffect, useState } from "react";
// // import { supabase } from "@/lib/supabase";
// // import AdminLayout from "./AdminLayout";
// // import { Button } from "@/components/ui/button";
// // import { Trash2, Edit, Plus, Check } from "lucide-react";

// // interface AdminUser {
// //   id: number;
// //   email: string;
// //   role: "admin" | "staff";
// //   created_at: string;
// // }

// // export default function AdminUsers() {
// //   const [users, setUsers] = useState<AdminUser[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [editing, setEditing] = useState<AdminUser | null>(null);

// //   const [email, setEmail] = useState("");
// //   const [role, setRole] = useState<"admin" | "staff">("staff");

// //   useEffect(() => {
// //     fetchUsers();
// //   }, []);

// //   const fetchUsers = async () => {
// //     setLoading(true);
// //     const { data, error } = await supabase
// //       .from("admin_users")
// //       .select("*")
// //       .order("created_at", { ascending: false });

// //     if (!error) setUsers(data || []);
// //     setLoading(false);
// //   };

// //   const resetForm = () => {
// //     setEmail("");
// //     setRole("staff");
// //     setEditing(null);
// //   };

// //   const handleSave = async () => {
// //     if (!email) return alert("Email is required");

// //     if (editing) {
// //       // Update role
// //       await supabase
// //         .from("admin_users")
// //         .update({ role })
// //         .eq("id", editing.id);
// //     } else {
// //       // Add new user
// //       const { error } = await supabase.from("admin_users").insert([{ email, role }]);
// //       if (error) return alert(error.message);
// //     }

// //     resetForm();
// //     fetchUsers();
// //   };

// //   const handleEdit = (user: AdminUser) => {
// //     setEditing(user);
// //     setEmail(user.email);
// //     setRole(user.role);
// //   };

// //   const handleDelete = async (id: number) => {
// //     if (!confirm("Delete this user?")) return;
// //     await supabase.from("admin_users").delete().eq("id", id);
// //     fetchUsers();
// //   };

// //   return (
// //     <AdminLayout>
// //       <div className="container-section py-10 max-w-3xl">
// //         <h1 className="text-3xl font-bold mb-6">Admin Users Management</h1>

// //         {/* Form */}
// //         <div className="mb-8 bg-muted p-6 rounded-lg shadow">
// //           <input
// //             type="email"
// //             placeholder="Email"
// //             className="w-full p-2 rounded border mb-3"
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //             disabled={!!editing} // cannot change email when editing
// //           />
// //           <select
// //             value={role}
// //             onChange={(e) => setRole(e.target.value as "admin" | "staff")}
// //             className="w-full p-2 rounded border mb-3"
// //           >
// //             <option value="admin">Admin</option>
// //             <option value="staff">Staff</option>
// //           </select>
// //           <Button onClick={handleSave} className="w-full flex items-center justify-center">
// //             {editing ? "Update Role" : "Add User"} <Plus className="ml-2" />
// //           </Button>
// //         </div>

// //         {/* Users List */}
// //         {loading ? (
// //           <p>Loading…</p>
// //         ) : (
// //           <div className="space-y-4">
// //             {users.map((u) => (
// //               <div
// //                 key={u.id}
// //                 className="flex justify-between items-center p-4 bg-card rounded shadow"
// //               >
// //                 <div>
// //                   <p className="font-medium">{u.email}</p>
// //                   <p className="text-sm text-muted-foreground">{u.role}</p>
// //                   <p className="text-xs text-muted-foreground">
// //                     Created: {new Date(u.created_at).toLocaleString()}
// //                   </p>
// //                 </div>

// //                 <div className="flex gap-2">
// //                   <Button size="sm" variant="secondary" onClick={() => handleEdit(u)}>
// //                     <Edit size={16} />
// //                   </Button>
// //                   <Button size="sm" variant="destructive" onClick={() => handleDelete(u.id)}>
// //                     <Trash2 size={16} />
// //                   </Button>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </AdminLayout>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import AdminLayout from "./AdminLayout";
// import { Button } from "@/components/ui/button";
// import { Trash2, Edit, Plus } from "lucide-react";

// type Role = "admin" | "staff";

// interface AdminUser {
//   id: number;
//   email: string;
//   role: Role;
//   created_at: string;
// }

// export default function AdminUsers() {
//   const [users, setUsers] = useState<AdminUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState<AdminUser | null>(null);

//   const [email, setEmail] = useState("");
//   const [role, setRole] = useState<Role>("staff");

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     const { data } = await supabase
//       .from("admin_users")
//       .select("*")
//       .order("created_at", { ascending: false });

//     setUsers(data || []);
//     setLoading(false);
//   };

//   const reset = () => {
//     setEmail("");
//     setRole("staff");
//     setEditing(null);
//   };

//   const saveUser = async () => {
//     if (!email) return alert("Email required");

//     if (editing) {
//       await supabase
//         .from("admin_users")
//         .update({ role })
//         .eq("id", editing.id);
//     } else {
//       await supabase.from("admin_users").insert([{ email, role }]);
//     }

//     reset();
//     fetchUsers();
//   };

//   const editUser = (user: AdminUser) => {
//     setEditing(user);
//     setEmail(user.email);
//     setRole(user.role);
//   };

//   const deleteUser = async (id: number) => {
//     if (!confirm("Delete this user?")) return;
//     await supabase.from("admin_users").delete().eq("id", id);
//     fetchUsers();
//   };

//   return (
//     <AdminLayout>
//       <div className="p-10 max-w-3xl">
//         <h1 className="text-3xl font-bold mb-6">Admin Users</h1>

//         {/* Form */}
//         <div className="bg-muted p-6 rounded mb-8">
//           <input
//             className="w-full p-2 border rounded mb-3"
//             placeholder="Email"
//             value={email}
//             disabled={!!editing}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <select
//             className="w-full p-2 border rounded mb-4"
//             value={role}
//             onChange={(e) => setRole(e.target.value as Role)}
//           >
//             <option value="admin">Admin</option>
//             <option value="staff">Staff</option>
//           </select>

//           <Button className="w-full" onClick={saveUser}>
//             {editing ? "Update User" : "Add User"} <Plus className="ml-2" />
//           </Button>
//         </div>

//         {/* List */}
//         {loading ? (
//           <p>Loading…</p>
//         ) : (
//           users.map((u) => (
//             <div
//               key={u.id}
//               className="flex justify-between items-center bg-card p-4 rounded mb-3"
//             >
//               <div>
//                 <p className="font-medium">{u.email}</p>
//                 <p className="text-sm text-muted-foreground">{u.role}</p>
//               </div>

//               <div className="flex gap-2">
//                 <Button size="sm" variant="secondary" onClick={() => editUser(u)}>
//                   <Edit size={16} />
//                 </Button>
//                 <Button size="sm" variant="destructive" onClick={() => deleteUser(u.id)}>
//                   <Trash2 size={16} />
//                 </Button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </AdminLayout>
//   );
// }

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
