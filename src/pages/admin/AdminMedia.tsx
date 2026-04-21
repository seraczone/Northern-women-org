import { useEffect, useMemo, useState } from "react";
import {
  Copy,
  Edit3,
  ImageIcon,
  RefreshCw,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";

import AdminLayout from "./AdminLayout";
import { supabase } from "@/lib/supabase";
import {
  formatFileSize,
  listMediaFiles,
  MEDIA_BUCKET,
  normalizeFileName,
  type MediaFile,
} from "@/lib/media";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminMedia() {
  const { toast } = useToast();
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadName, setUploadName] = useState("");
  const [editName, setEditName] = useState("");
  const [replacementFile, setReplacementFile] = useState<File | null>(null);

  const fetchMedia = async (preferredSelection?: string | null) => {
    setLoading(true);
    const { data, error } = await listMediaFiles();

    if (error) {
      toast({
        title: "Unable to load media",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setMedia(data);
    setSelectedName((currentSelection) => {
      const target = preferredSelection === undefined ? currentSelection : preferredSelection;

      if (!target) {
        return null;
      }

      return data.some((item) => item.name === target) ? target : null;
    });
    setLoading(false);
  };

  useEffect(() => {
    void fetchMedia();
  }, []);

  const selectedItem = useMemo(
    () => media.find((item) => item.name === selectedName) ?? null,
    [media, selectedName],
  );

  useEffect(() => {
    if (!selectedItem) {
      setEditName("");
      setReplacementFile(null);
      return;
    }

    setEditName(selectedItem.name);
    setReplacementFile(null);
  }, [selectedItem?.name]);

  const filteredMedia = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return media;
    }

    return media.filter((item) => item.name.toLowerCase().includes(normalizedSearch));
  }, [media, search]);

  const totalSize = useMemo(
    () => media.reduce((sum, item) => sum + (item.size ?? 0), 0),
    [media],
  );

  const upload = async () => {
    if (!uploadFile) {
      toast({
        title: "Select a file first",
        description: "Choose an image to upload into the media library.",
        variant: "destructive",
      });
      return;
    }

    const targetName = normalizeFileName(uploadName, uploadFile.name);
    const duplicate = media.some((item) => item.name === targetName);

    if (duplicate) {
      toast({
        title: "File name already exists",
        description: "Use a different name or replace the existing file from the edit panel.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(targetName, uploadFile, {
      upsert: false,
      contentType: uploadFile.type || undefined,
    });

    if (error) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      setSaving(false);
      return;
    }

    setUploadFile(null);
    setUploadName("");
    await fetchMedia(targetName);
    setSaving(false);

    toast({
      title: "Upload complete",
      description: `${targetName} is now available in the media library.`,
    });
  };

  const saveChanges = async () => {
    if (!selectedItem) {
      return;
    }

    const requestedName = editName.trim();
    const shouldRename = requestedName !== "" && requestedName !== selectedItem.name;
    const targetName = shouldRename
      ? normalizeFileName(requestedName, selectedItem.name)
      : selectedItem.name;

    if (shouldRename && media.some((item) => item.name === targetName && item.name !== selectedItem.name)) {
      toast({
        title: "File name already exists",
        description: "Rename the asset with a unique file name.",
        variant: "destructive",
      });
      return;
    }

    if (!shouldRename && !replacementFile) {
      toast({
        title: "No changes to save",
        description: "Rename the file or choose a replacement image first.",
      });
      return;
    }

    setSaving(true);
    let currentPath = selectedItem.path;

    if (shouldRename) {
      const { error } = await supabase.storage.from(MEDIA_BUCKET).move(selectedItem.path, targetName);

      if (error) {
        toast({
          title: "Rename failed",
          description: error.message,
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      currentPath = targetName;
    }

    if (replacementFile) {
      const { error } = await supabase.storage.from(MEDIA_BUCKET).update(currentPath, replacementFile, {
        upsert: true,
        contentType: replacementFile.type || undefined,
      });

      if (error) {
        toast({
          title: "Replace failed",
          description: error.message,
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
    }

    await fetchMedia(currentPath);
    setSaving(false);

    toast({
      title: "Media updated",
      description: "Your changes have been saved.",
    });
  };

  const remove = async (item: MediaFile) => {
    const confirmed = window.confirm(`Delete ${item.name}? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    setSaving(true);
    const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([item.path]);

    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
      setSaving(false);
      return;
    }

    await fetchMedia(item.name === selectedName ? null : selectedName);
    setSaving(false);

    toast({
      title: "Media deleted",
      description: `${item.name} has been removed from storage.`,
    });
  };

  const copyUrl = async (item: MediaFile) => {
    try {
      await navigator.clipboard.writeText(item.url);
      toast({
        title: "URL copied",
        description: item.url,
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Your browser blocked clipboard access.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 p-6 md:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Media Library</h1>
            <p className="text-muted-foreground">
              Upload, replace, rename, and delete files in the `{MEDIA_BUCKET}` bucket.
            </p>
          </div>

          <div className="flex gap-3">
            <Badge variant="secondary">{media.length} assets</Badge>
            <Badge variant="outline">{formatFileSize(totalSize)}</Badge>
            <Button type="button" variant="outline" onClick={() => void fetchMedia()} disabled={loading || saving}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Media</CardTitle>
              <CardDescription>
                Add a new file with an optional custom storage name.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">File</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Custom file name</label>
                <Input
                  placeholder="Optional. Example: women-summit-hero"
                  value={uploadName}
                  onChange={(event) => setUploadName(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The original extension is preserved automatically.
                </p>
              </div>

              {uploadFile && (
                <div className="rounded-lg border bg-muted/50 p-3 text-sm">
                  <p className="font-medium">{uploadFile.name}</p>
                  <p className="text-muted-foreground">{formatFileSize(uploadFile.size)}</p>
                </div>
              )}

              <Button type="button" className="w-full" onClick={upload} disabled={saving || !uploadFile}>
                <UploadCloud className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Upload Media"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{selectedItem ? "Edit Selected Media" : "Select Media to Edit"}</CardTitle>
              <CardDescription>
                Use this panel for update and delete operations. Renaming a file changes its public URL.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedItem ? (
                <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
                  <div className="overflow-hidden rounded-lg border">
                    <img
                      src={selectedItem.url}
                      alt={selectedItem.name}
                      className="h-64 w-full object-cover"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border p-3">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Current name</p>
                        <p className="mt-1 break-all font-medium">{selectedItem.name}</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Updated</p>
                        <p className="mt-1 font-medium">
                          {selectedItem.updatedAt
                            ? new Date(selectedItem.updatedAt).toLocaleString()
                            : "Unknown"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rename file</label>
                      <Input value={editName} onChange={(event) => setEditName(event.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Replace file contents</label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(event) => setReplacementFile(event.target.files?.[0] ?? null)}
                      />
                      {replacementFile && (
                        <p className="text-xs text-muted-foreground">
                          Replacement ready: {replacementFile.name}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <Button type="button" onClick={saveChanges} disabled={saving}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                      <Button type="button" variant="outline" onClick={() => void copyUrl(selectedItem)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy URL
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditName(selectedItem.name);
                          setReplacementFile(null);
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => void remove(selectedItem)}
                        disabled={saving}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>

                    <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
                      <p className="break-all">Public URL: {selectedItem.url}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                  <ImageIcon className="mb-3 h-10 w-10 text-muted-foreground" />
                  <p className="font-medium">No media selected</p>
                  <p className="max-w-md text-sm text-muted-foreground">
                    Pick an asset from the library below to rename it, replace it, copy its URL, or delete it.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>All Assets</CardTitle>
                <CardDescription>
                  Browse the current contents of your public media bucket.
                </CardDescription>
              </div>
              <Input
                className="w-full lg:max-w-xs"
                placeholder="Search by file name"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading media...</p>
            ) : filteredMedia.length === 0 ? (
              <p className="text-muted-foreground">No media files matched your search.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {filteredMedia.map((item) => {
                  const selected = item.name === selectedName;

                  return (
                    <div
                      key={item.name}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedName(item.name)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedName(item.name);
                        }
                      }}
                      className={`overflow-hidden rounded-xl border text-left transition ${
                        selected ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/40"
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        className="h-44 w-full object-cover"
                      />
                      <div className="space-y-2 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <p className="min-w-0 flex-1 break-all font-medium">{item.name}</p>
                          {selected && <Badge>Selected</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{formatFileSize(item.size)}</p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedName(item.name);
                            }}
                          >
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={(event) => {
                              event.stopPropagation();
                              void remove(item);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
