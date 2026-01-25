// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import AdminLayout from "./AdminLayout";
// import MediaPicker from "@/components/MediaPicker";
// import { Button } from "@/components/ui/button";

// export default function AdminPrograms() {
//   const [title, setTitle] = useState("");
//   const [image, setImage] = useState<string | null>(null);
//   const [programs, setPrograms] = useState<any[]>([]);

//   useEffect(() => {
//     fetchPrograms();
//   }, []);

//   const fetchPrograms = async () => {
//     const { data } = await supabase
//       .from("programs")
//       .select("*")
//       .order("created_at", { ascending: false });

//     setPrograms(data || []);
//   };

//   const saveProgram = async () => {
//     if (!title) return alert("Title required");

//     await supabase.from("programs").insert([
//       {
//         title,
//         featured_image: image,
//       },
//     ]);

//     setTitle("");
//     setImage(null);
//     fetchPrograms();
//   };

//   return (
//     <AdminLayout>
//       <div className="p-10 max-w-5xl">
//         <h1 className="text-3xl font-bold mb-6">Programs</h1>

//         {/* Form */}
//         <div className="bg-muted p-6 rounded mb-10">
//           <input
//             className="w-full p-3 border rounded mb-4"
//             placeholder="Program title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />

//           {image && (
//             <img
//               src={image}
//               className="h-40 mb-4 rounded object-cover"
//             />
//           )}

//           <MediaPicker
//             category="programs"
//             onSelect={(url) => setImage(url)}
//           />

//           <Button className="mt-4" onClick={saveProgram}>
//             Save Program
//           </Button>
//         </div>

//         {/* List */}
//         <div className="grid grid-cols-3 gap-6">
//           {programs.map((p) => (
//             <div key={p.id} className="border rounded">
//               {p.featured_image && (
//                 <img
//                   src={p.featured_image}
//                   className="h-32 w-full object-cover"
//                 />
//               )}
//               <p className="p-3 font-medium">{p.title}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "./AdminLayout";
import MediaPicker from "@/components/MediaPicker";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Program {
  id: number;
  title: string;
  featured_image: string | null;
  created_at: string;
}

export default function AdminPrograms() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setPrograms(data || []);
    setLoading(false);
  };

  const saveProgram = async () => {
    if (!title) return alert("Title required");

    const { error } = await supabase.from("programs").insert([
      {
        title,
        featured_image: image,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setImage(null);
    fetchPrograms();
  };

  const deleteProgram = async (id: number) => {
    if (!confirm("Delete this program?")) return;
    await supabase.from("programs").delete().eq("id", id);
    fetchPrograms();
  };

  return (
    <AdminLayout>
      <div className="p-10 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Programs</h1>

        {/* Create */}
        <div className="bg-muted p-6 rounded mb-10">
          <input
            className="w-full p-3 border rounded mb-4"
            placeholder="Program title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {image && (
            <img
              src={image}
              className="h-40 mb-4 rounded object-cover"
            />
          )}

          <MediaPicker onSelect={setImage} />

          <Button className="mt-4" onClick={saveProgram}>
            Save Program
          </Button>
        </div>

        {/* List */}
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((p) => (
              <div key={p.id} className="border rounded overflow-hidden">
                {p.featured_image && (
                  <img
                    src={p.featured_image}
                    className="h-32 w-full object-cover"
                  />
                )}
                <div className="p-3 flex justify-between items-center">
                  <p className="font-medium">{p.title}</p>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteProgram(p.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
