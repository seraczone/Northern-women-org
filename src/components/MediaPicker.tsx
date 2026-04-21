import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

import { listMediaFiles, type MediaFile } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MediaPickerProps {
  category?: string;
  selected?: string | null;
  onSelect: (url: string) => void;
}

export default function MediaPicker({ selected, onSelect }: MediaPickerProps) {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [currentSelection, setCurrentSelection] = useState<string | null>(selected ?? null);

  const fetchMedia = async () => {
    setLoading(true);
    const { data } = await listMediaFiles();
    setMedia(data);
    setLoading(false);
  };

  useEffect(() => {
    void fetchMedia();
  }, []);

  useEffect(() => {
    setCurrentSelection(selected ?? null);
  }, [selected]);

  const filteredMedia = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return media;
    }

    return media.filter((item) => item.name.toLowerCase().includes(normalizedQuery));
  }, [media, query]);

  const handleSelect = (url: string) => {
    setCurrentSelection(url);
    onSelect(url);
  };

  return (
    <div className="rounded border p-4">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-medium">Select Image</h2>

        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search media"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => void fetchMedia()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading images...</p>
      ) : filteredMedia.length === 0 ? (
        <p className="text-muted-foreground">No images available in the bucket.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
          {filteredMedia.map((item) => (
            <button
              key={item.name}
              type="button"
              className={`overflow-hidden rounded border text-left ${
                currentSelection === item.url ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleSelect(item.url)}
            >
              <img src={item.url} alt={item.name} className="h-24 w-full object-cover" />
              <div className="border-t bg-background/95 px-2 py-1 text-xs text-muted-foreground">
                {item.name}
              </div>
            </button>
          ))}
        </div>
      )}

      {currentSelection && (
        <div className="mt-3">
          <p className="mb-1 text-sm font-medium">Selected Image:</p>
          <img src={currentSelection} alt="Selected" className="h-32 w-32 rounded object-cover" />
        </div>
      )}
    </div>
  );
}
