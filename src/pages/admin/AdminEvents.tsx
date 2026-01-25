import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "./AdminLayout";
import MediaPicker from "@/components/MediaPicker";
import { Button } from "@/components/ui/button";

export default function AdminPrograms() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    const { data } = await supabase
      .from("programs")
      .select("*")
      .order("created_at", { ascending: false });

    setPrograms(data || []);
  };

  const saveProgram = async () => {
    if (!title) return alert("Title required");

    await supabase.from("programs").insert([
      {
        title,
        featured_image: image,
      },
    ]);

    setTitle("");
    setImage(null);
    fetchPrograms();
  };

  return (
    <AdminLayout>
      <div className="p-10 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Programs</h1>

        {/* Form */}
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

          <MediaPicker
            category="programs"
            onSelect={(url) => setImage(url)}
          />

          <Button className="mt-4" onClick={saveProgram}>
            Save Program
          </Button>
        </div>

        {/* List */}
        <div className="grid grid-cols-3 gap-6">
          {programs.map((p) => (
            <div key={p.id} className="border rounded">
              {p.featured_image && (
                <img
                  src={p.featured_image}
                  className="h-32 w-full object-cover"
                />
              )}
              <p className="p-3 font-medium">{p.title}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
