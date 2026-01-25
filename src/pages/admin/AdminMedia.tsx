// // import { useEffect, useState } from "react";
// // import { supabase } from "@/lib/supabase";
// // import AdminLayout from "./AdminLayout";
// // import { Button } from "@/components/ui/button";
// // import { Trash2, Upload } from "lucide-react";

// // interface MediaAsset {
// //   id: string;
// //   file_name: string;
// //   file_path: string;
// //   public_url: string;
// //   category: string | null;
// // }

// // export default function AdminMedia() {
// //   const [file, setFile] = useState<File | null>(null);
// //   const [category, setCategory] = useState("misc");
// //   const [assets, setAssets] = useState<MediaAsset[]>([]);
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     fetchAssets();
// //   }, []);

// //   /* ---------------- FETCH ---------------- */
// //   const fetchAssets = async () => {
// //     const { data, error } = await supabase
// //       .from("media_assets")
// //       .select("*")
// //       .order("created_at", { ascending: false });

// //     if (!error) setAssets(data || []);
// //   };

// //   /* ---------------- UPLOAD ---------------- */
// //   const uploadImage = async () => {
// //     if (!file) return alert("Select an image");

// //     setLoading(true);

// //     const fileExt = file.name.split(".").pop();
// //     const filePath = `${category}/${Date.now()}.${fileExt}`;

// //     // Upload to existing assets bucket
// //     const { error: uploadError } = await supabase.storage
// //       .from("assets")
// //       .upload(filePath, file);

// //     if (uploadError) {
// //       alert(uploadError.message);
// //       setLoading(false);
// //       return;
// //     }

// //     // Get public URL
// //     const { data } = supabase.storage
// //       .from("assets")
// //       .getPublicUrl(filePath);

// //     // Save metadata
// //     await supabase.from("media_assets").insert([
// //       {
// //         file_name: file.name,
// //         file_path: filePath,
// //         public_url: data.publicUrl,
// //         category,
// //       },
// //     ]);

// //     setFile(null);
// //     fetchAssets();
// //     setLoading(false);
// //   };

// //   /* ---------------- DELETE ---------------- */
// //   const deleteImage = async (asset: MediaAsset) => {
// //     if (!confirm("Delete this image permanently?")) return;

// //     // Remove from storage
// //     await supabase.storage
// //       .from("assets")
// //       .remove([asset.file_path]);

// //     // Remove from DB
// //     await supabase
// //       .from("media_assets")
// //       .delete()
// //       .eq("id", asset.id);

// //     fetchAssets();
// //   };

// //   return (
// //     <AdminLayout>
// //       <div className="p-10">
// //         <h1 className="text-3xl font-bold mb-6">Media Library</h1>

// //         {/* Upload section */}
// //         <div className="flex flex-wrap gap-4 items-center mb-8">
// //           <input
// //             type="file"
// //             accept="image/*"
// //             onChange={(e) =>
// //               setFile(e.target.files?.[0] || null)
// //             }
// //           />

// //           <select
// //             className="border p-2 rounded"
// //             value={category}
// //             onChange={(e) => setCategory(e.target.value)}
// //           >
// //             <option value="misc">Misc</option>
// //             <option value="programs">Programs</option>
// //             <option value="events">Events</option>
// //             <option value="banners">Banners</option>
// //           </select>

// //           <Button onClick={uploadImage} disabled={loading}>
// //             <Upload size={16} className="mr-2" />
// //             Upload Image
// //           </Button>
// //         </div>

// //         {/* Gallery */}
// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
// //           {assets.map((asset) => (
// //             <div
// //               key={asset.id}
// //               className="relative border rounded-xl overflow-hidden group"
// //             >
// //               <img
// //                 src={asset.public_url}
// //                 alt={asset.file_name}
// //                 className="w-full h-40 object-cover"
// //               />

// //               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex justify-end p-2">
// //                 <button
// //                   onClick={() => deleteImage(asset)}
// //                   className="bg-red-600 text-white p-2 rounded"
// //                 >
// //                   <Trash2 size={14} />
// //                 </button>
// //               </div>

// //               <p className="text-xs p-2 truncate">
// //                 {asset.file_name}
// //               </p>
// //             </div>
// //           ))}
// //         </div>

// //         {assets.length === 0 && (
// //           <p className="text-muted-foreground mt-10">
// //             No images uploaded yet.
// //           </p>
// //         )}
// //       </div>
// //     </AdminLayout>
// //   );
// // }

// import { useEffect, useState } from "react";
// import AdminLayout from "./AdminLayout";
// import { supabase } from "@/lib/supabase";
// import { Button } from "@/components/ui/button";
// import { Trash2, UploadCloud } from "lucide-react";

// interface MediaItem {
//   name: string;
//   url: string;
// }

// export default function AdminMedia() {
//   const [media, setMedia] = useState<MediaItem[]>([]);
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);

//   const bucketName = "assets"; // your Supabase storage bucket

//   // Fetch all images from bucket
//   const fetchMedia = async () => {
//     const { data, error } = await supabase.storage
//       .from(bucketName)
//       .list("", { limit: 100, offset: 0 });

//     if (error) {
//       console.error("Error fetching media:", error.message);
//       return;
//     }

//     // Get public URLs for each file
//     const mediaItems: MediaItem[] = await Promise.all(
//       data.map(async (item) => {
//         const { publicUrl } = supabase.storage.from(bucketName).getPublicUrl(item.name);
//         return { name: item.name, url: publicUrl };
//       })
//     );

//     setMedia(mediaItems);
//   };

//   useEffect(() => {
//     fetchMedia();
//   }, []);

//   // Upload a new image
//   const handleUpload = async () => {
//     if (!file) return alert("Select a file first");

//     setLoading(true);
//     const { data, error } = await supabase.storage
//       .from(bucketName)
//       .upload(file.name, file, { upsert: true });

//     if (error) {
//       alert("Upload error: " + error.message);
//     } else {
//       setFile(null);
//       fetchMedia();
//     }
//     setLoading(false);
//   };

//   // Delete an image
//   const handleDelete = async (name: string) => {
//     if (!confirm("Delete this image?")) return;

//     const { error } = await supabase.storage.from(bucketName).remove([name]);
//     if (error) {
//       alert("Delete error: " + error.message);
//     } else {
//       fetchMedia();
//     }
//   };

//   return (
//     <AdminLayout>
//       <div className="container-section py-10">
//         <h1 className="text-3xl font-bold mb-6">Manage Media (Assets)</h1>

//         {/* Upload Section */}
//         <div className="mb-8 flex gap-3 items-center">
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setFile(e.target.files?.[0] || null)}
//             className="border p-2 rounded"
//           />
//           <Button onClick={handleUpload} disabled={loading || !file} className="flex items-center gap-2">
//             {loading ? "Uploading..." : "Upload"}
//             <UploadCloud size={16} />
//           </Button>
//         </div>

//         {/* Media List */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {media.map((item) => (
//             <div key={item.name} className="border rounded p-2 relative">
//               <img src={item.url} alt={item.name} className="w-full h-32 object-cover rounded" />
//               <p className="text-xs truncate mt-1">{item.name}</p>
//               <Button
//                 variant="destructive"
//                 size="sm"
//                 className="absolute top-1 right-1 p-1"
//                 onClick={() => handleDelete(item.name)}
//               >
//                 <Trash2 size={14} />
//               </Button>
//             </div>
//           ))}
//           {media.length === 0 && <p className="text-muted-foreground col-span-full">No media found.</p>}
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }

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
