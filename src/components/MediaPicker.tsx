// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { Button } from "@/components/ui/button";

// interface MediaAsset {
//   id: string;
//   public_url: string;
//   category: string | null;
// }

// export default function MediaPicker({
//   category,
//   onSelect,
// }: {
//   category?: string;
//   onSelect: (url: string) => void;
// }) {
//   const [assets, setAssets] = useState<MediaAsset[]>([]);

//   useEffect(() => {
//     fetchAssets();
//   }, []);

//   const fetchAssets = async () => {
//     let query = supabase.from("media_assets").select("*");

//     if (category) query = query.eq("category", category);

//     const { data } = await query.order("created_at", {
//       ascending: false,
//     });

//     setAssets(data || []);
//   };

//   return (
//     <div className="grid grid-cols-3 gap-4">
//       {assets.map((asset) => (
//         <button
//           key={asset.id}
//           onClick={() => onSelect(asset.public_url)}
//           className="border rounded overflow-hidden hover:ring-2 ring-primary"
//         >
//           <img
//             src={asset.public_url}
//             className="h-24 w-full object-cover"
//           />
//         </button>
//       ))}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface MediaPickerProps {
  selected?: string;
  onSelect: (url: string) => void;
}

export default function MediaPicker({ selected, onSelect }: MediaPickerProps) {
  const [media, setMedia] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSelection, setCurrentSelection] = useState<string | undefined>(selected);

  const bucketName = "assets";

  // Fetch all images
  const fetchMedia = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from(bucketName).list("", { limit: 100 });

    if (!error && data) {
      const mediaItems = data.map((item) => {
        const { publicUrl } = supabase.storage.from(bucketName).getPublicUrl(item.name);
        return { name: item.name, url: publicUrl };
      });
      setMedia(mediaItems);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleSelect = (url: string) => {
    setCurrentSelection(url);
    onSelect(url);
  };

  return (
    <div className="border rounded p-4">
      <h2 className="text-lg font-medium mb-3">Select Image</h2>

      {loading ? (
        <p>Loading images…</p>
      ) : media.length === 0 ? (
        <p className="text-muted-foreground">No images available in the bucket.</p>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {media.map((item) => (
            <div
              key={item.name}
              className={`border rounded overflow-hidden cursor-pointer relative ${
                currentSelection === item.url ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => handleSelect(item.url)}
            >
              <img src={item.url} alt={item.name} className="w-full h-24 object-cover" />
            </div>
          ))}
        </div>
      )}

      {currentSelection && (
        <div className="mt-3">
          <p className="text-sm font-medium mb-1">Selected Image:</p>
          <img src={currentSelection} alt="Selected" className="w-32 h-32 object-cover rounded" />
        </div>
      )}
    </div>
  );
}
