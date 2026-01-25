import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Trash2, UploadCloud } from "lucide-react";

interface MediaItem {
  name: string;
  url: string;
}

const BUCKET = "assets";

export default function AdminMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMedia = async () => {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list("", { limit: 100 });

    if (error) return console.error(error.message);

    const items = await Promise.all(
      (data || [])
        .filter((f) => !f.name.endsWith("/"))
        .map(async (f) => {
          const { publicUrl } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(f.name);
          return { name: f.name, url: publicUrl };
        })
    );

    setMedia(items);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const upload = async () => {
    if (!file) return;
    setLoading(true);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(file.name, file, { upsert: true });

    if (error) alert(error.message);
    setFile(null);
    fetchMedia();
    setLoading(false);
  };

  const remove = async (name: string) => {
    if (!confirm("Delete this image?")) return;
    await supabase.storage.from(BUCKET).remove([name]);
    fetchMedia();
  };

  return (
    <AdminLayout>
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">Media Library</h1>

        <div className="flex gap-3 mb-8">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Button onClick={upload} disabled={!file || loading}>
            <UploadCloud size={16} />
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {media.map((m) => (
            <div key={m.name} className="relative border rounded p-2">
              <img src={m.url} className="h-32 w-full object-cover rounded" />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-1 right-1"
                onClick={() => remove(m.name)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
