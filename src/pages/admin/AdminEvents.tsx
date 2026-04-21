import { useEffect, useMemo, useState } from "react";
import { Edit3, Plus, RefreshCw, Trash2, Video } from "lucide-react";

import AdminLayout from "./AdminLayout";
import MediaPicker from "@/components/MediaPicker";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FeaturedEventRecord {
  id: number;
  title: string;
  date: string | null;
  time: string | null;
  location: string | null;
  attendees: string | null;
  image_url: string | null;
}

interface ProgramRecord {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  order_index: number | null;
}

interface GalleryRecord {
  id: number;
  event_key: string;
  image_url: string | null;
  orientation: string | null;
}

interface VideoRecord {
  id: number;
  title: string;
  video_url: string | null;
}

type FeaturedEventForm = {
  id: number | null;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: string;
  image_url: string;
};

type ProgramForm = {
  id: number | null;
  title: string;
  description: string;
  image_url: string;
  order_index: string;
};

type GalleryForm = {
  id: number | null;
  event_key: "meet-greet" | "summit-2025";
  image_url: string;
  orientation: "landscape" | "portrait";
};

type VideoForm = {
  id: number | null;
  title: string;
  video_url: string;
};

const emptyFeaturedEventForm: FeaturedEventForm = {
  id: null,
  title: "",
  date: "",
  time: "",
  location: "",
  attendees: "",
  image_url: "",
};

const emptyProgramForm: ProgramForm = {
  id: null,
  title: "",
  description: "",
  image_url: "",
  order_index: "1",
};

const emptyGalleryForm: GalleryForm = {
  id: null,
  event_key: "meet-greet",
  image_url: "",
  orientation: "landscape",
};

const emptyVideoForm: VideoForm = {
  id: null,
  title: "",
  video_url: "",
};

export default function AdminEvents() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [featuredEvent, setFeaturedEvent] = useState<FeaturedEventRecord | null>(null);
  const [programs, setPrograms] = useState<ProgramRecord[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryRecord[]>([]);
  const [eventVideo, setEventVideo] = useState<VideoRecord | null>(null);

  const [featuredForm, setFeaturedForm] = useState<FeaturedEventForm>(emptyFeaturedEventForm);
  const [programForm, setProgramForm] = useState<ProgramForm>(emptyProgramForm);
  const [galleryForm, setGalleryForm] = useState<GalleryForm>(emptyGalleryForm);
  const [videoForm, setVideoForm] = useState<VideoForm>(emptyVideoForm);

  const fetchEventsData = async () => {
    setLoading(true);

    const [featuredResponse, programsResponse, galleryResponse, videoResponse] = await Promise.all([
      supabase.from("featured_event").select("*").order("id", { ascending: false }).limit(1),
      supabase.from("programs").select("*").order("order_index", { ascending: true }),
      supabase.from("event_gallery").select("*").order("id", { ascending: false }),
      supabase.from("event_video").select("*").order("id", { ascending: false }).limit(1),
    ]);

    const firstError =
      featuredResponse.error ||
      programsResponse.error ||
      galleryResponse.error ||
      videoResponse.error;

    if (firstError) {
      toast({
        title: "Unable to load event content",
        description: firstError.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const nextFeatured = (featuredResponse.data?.[0] as FeaturedEventRecord | undefined) ?? null;
    const nextPrograms = (programsResponse.data as ProgramRecord[] | null) ?? [];
    const nextGallery = (galleryResponse.data as GalleryRecord[] | null) ?? [];
    const nextVideo = (videoResponse.data?.[0] as VideoRecord | undefined) ?? null;

    setFeaturedEvent(nextFeatured);
    setPrograms(nextPrograms);
    setGalleryItems(nextGallery);
    setEventVideo(nextVideo);
    setFeaturedForm(toFeaturedForm(nextFeatured));
    setVideoForm(toVideoForm(nextVideo));
    setProgramForm((current) => {
      if (current.id) {
        return current;
      }

      return {
        ...emptyProgramForm,
        order_index: String(nextPrograms.length + 1),
      };
    });
    setGalleryForm((current) => {
      if (current.id) {
        return current;
      }

      return emptyGalleryForm;
    });
    setLoading(false);
  };

  useEffect(() => {
    void fetchEventsData();
  }, []);

  const meetGreetGallery = useMemo(
    () => galleryItems.filter((item) => item.event_key === "meet-greet"),
    [galleryItems],
  );

  const summitGallery = useMemo(
    () => galleryItems.filter((item) => item.event_key === "summit-2025"),
    [galleryItems],
  );

  const saveFeaturedEvent = async () => {
    if (!featuredForm.title.trim()) {
      showValidationError("Featured event title is required.");
      return;
    }

    if (!featuredForm.image_url.trim()) {
      showValidationError("Featured event image is required.");
      return;
    }

    setSaving(true);

    const payload = {
      title: featuredForm.title.trim(),
      date: featuredForm.date.trim() || null,
      time: featuredForm.time.trim() || null,
      location: featuredForm.location.trim() || null,
      attendees: featuredForm.attendees.trim() || null,
      image_url: featuredForm.image_url.trim(),
    };

    const response = featuredForm.id
      ? await supabase.from("featured_event").update(payload).eq("id", featuredForm.id)
      : await supabase.from("featured_event").insert([payload]);

    if (response.error) {
      reportError("Unable to save featured event", response.error.message);
      setSaving(false);
      return;
    }

    await fetchEventsData();
    setSaving(false);
    toast({
      title: "Featured event saved",
      description: "The main event section on the public Events page has been updated.",
    });
  };

  const deleteFeaturedEvent = async () => {
    if (!featuredEvent) {
      return;
    }

    if (!window.confirm("Delete the featured event section?")) {
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("featured_event").delete().eq("id", featuredEvent.id);

    if (error) {
      reportError("Unable to delete featured event", error.message);
      setSaving(false);
      return;
    }

    setFeaturedForm(emptyFeaturedEventForm);
    await fetchEventsData();
    setSaving(false);
    toast({
      title: "Featured event deleted",
    });
  };

  const saveProgram = async () => {
    if (!programForm.title.trim()) {
      showValidationError("Program title is required.");
      return;
    }

    if (!programForm.description.trim()) {
      showValidationError("Program description is required.");
      return;
    }

    if (!programForm.image_url.trim()) {
      showValidationError("Program image is required.");
      return;
    }

    const orderIndex = Number(programForm.order_index);

    if (!Number.isFinite(orderIndex)) {
      showValidationError("Program order must be a valid number.");
      return;
    }

    setSaving(true);

    const payload = {
      title: programForm.title.trim(),
      description: programForm.description.trim(),
      image_url: programForm.image_url.trim(),
      order_index: orderIndex,
    };

    const response = programForm.id
      ? await supabase.from("programs").update(payload).eq("id", programForm.id)
      : await supabase.from("programs").insert([payload]);

    if (response.error) {
      reportError("Unable to save program", response.error.message);
      setSaving(false);
      return;
    }

    setProgramForm({
      ...emptyProgramForm,
      order_index: String(programs.length + (programForm.id ? 0 : 2)),
    });
    await fetchEventsData();
    setSaving(false);
    toast({
      title: programForm.id ? "Program updated" : "Program created",
    });
  };

  const editProgram = (program: ProgramRecord) => {
    setProgramForm({
      id: program.id,
      title: program.title,
      description: program.description ?? "",
      image_url: program.image_url ?? "",
      order_index: String(program.order_index ?? 0),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProgram = async (id: number) => {
    if (!window.confirm("Delete this program section from the Events page?")) {
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("programs").delete().eq("id", id);

    if (error) {
      reportError("Unable to delete program", error.message);
      setSaving(false);
      return;
    }

    if (programForm.id === id) {
      setProgramForm({
        ...emptyProgramForm,
        order_index: "1",
      });
    }

    await fetchEventsData();
    setSaving(false);
    toast({
      title: "Program deleted",
    });
  };

  const saveGalleryItem = async () => {
    if (!galleryForm.image_url.trim()) {
      showValidationError("Select an image for the gallery item.");
      return;
    }

    setSaving(true);

    const payload = {
      event_key: galleryForm.event_key,
      image_url: galleryForm.image_url.trim(),
      orientation: galleryForm.orientation,
    };

    const response = galleryForm.id
      ? await supabase.from("event_gallery").update(payload).eq("id", galleryForm.id)
      : await supabase.from("event_gallery").insert([payload]);

    if (response.error) {
      reportError("Unable to save gallery image", response.error.message);
      setSaving(false);
      return;
    }

    setGalleryForm(emptyGalleryForm);
    await fetchEventsData();
    setSaving(false);
    toast({
      title: galleryForm.id ? "Gallery image updated" : "Gallery image added",
    });
  };

  const editGalleryItem = (item: GalleryRecord) => {
    setGalleryForm({
      id: item.id,
      event_key: item.event_key === "summit-2025" ? "summit-2025" : "meet-greet",
      image_url: item.image_url ?? "",
      orientation: item.orientation === "portrait" ? "portrait" : "landscape",
    });
  };

  const deleteGalleryItem = async (id: number) => {
    if (!window.confirm("Delete this gallery image?")) {
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("event_gallery").delete().eq("id", id);

    if (error) {
      reportError("Unable to delete gallery image", error.message);
      setSaving(false);
      return;
    }

    if (galleryForm.id === id) {
      setGalleryForm(emptyGalleryForm);
    }

    await fetchEventsData();
    setSaving(false);
    toast({
      title: "Gallery image deleted",
    });
  };

  const saveVideo = async () => {
    if (!videoForm.title.trim()) {
      showValidationError("Video title is required.");
      return;
    }

    if (!videoForm.video_url.trim()) {
      showValidationError("Video URL is required.");
      return;
    }

    setSaving(true);

    const payload = {
      title: videoForm.title.trim(),
      video_url: videoForm.video_url.trim(),
    };

    const response = videoForm.id
      ? await supabase.from("event_video").update(payload).eq("id", videoForm.id)
      : await supabase.from("event_video").insert([payload]);

    if (response.error) {
      reportError("Unable to save event video", response.error.message);
      setSaving(false);
      return;
    }

    await fetchEventsData();
    setSaving(false);
    toast({
      title: "Event video saved",
    });
  };

  const deleteVideo = async () => {
    if (!eventVideo) {
      return;
    }

    if (!window.confirm("Delete the event video block?")) {
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("event_video").delete().eq("id", eventVideo.id);

    if (error) {
      reportError("Unable to delete event video", error.message);
      setSaving(false);
      return;
    }

    setVideoForm(emptyVideoForm);
    await fetchEventsData();
    setSaving(false);
    toast({
      title: "Event video deleted",
    });
  };

  const reportError = (title: string, description: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  };

  const showValidationError = (description: string) => {
    toast({
      title: "Incomplete form",
      description,
      variant: "destructive",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-8 p-6 md:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Events Content</h1>
            <p className="text-muted-foreground">
              Manage everything that renders on the public Events page from one admin screen.
            </p>
          </div>

          <Button type="button" variant="outline" onClick={() => void fetchEventsData()} disabled={loading || saving}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Featured Event</CardTitle>
            <CardDescription>
              Controls the hero event block with title, date, venue, attendees, and image.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Event title"
                value={featuredForm.title}
                onChange={(event) => setFeaturedForm((current) => ({ ...current, title: event.target.value }))}
              />
              <Input
                placeholder="Date"
                value={featuredForm.date}
                onChange={(event) => setFeaturedForm((current) => ({ ...current, date: event.target.value }))}
              />
              <Input
                placeholder="Time"
                value={featuredForm.time}
                onChange={(event) => setFeaturedForm((current) => ({ ...current, time: event.target.value }))}
              />
              <Input
                placeholder="Location"
                value={featuredForm.location}
                onChange={(event) => setFeaturedForm((current) => ({ ...current, location: event.target.value }))}
              />
              <Input
                placeholder="Attendees"
                value={featuredForm.attendees}
                onChange={(event) => setFeaturedForm((current) => ({ ...current, attendees: event.target.value }))}
              />
              <Input
                placeholder="Image URL"
                value={featuredForm.image_url}
                onChange={(event) => setFeaturedForm((current) => ({ ...current, image_url: event.target.value }))}
              />
            </div>

            {featuredForm.image_url && (
              <img
                src={featuredForm.image_url}
                alt={featuredForm.title || "Featured event"}
                className="h-56 w-full rounded-lg object-cover"
              />
            )}

            <MediaPicker
              selected={featuredForm.image_url}
              onSelect={(url) => setFeaturedForm((current) => ({ ...current, image_url: url }))}
            />

            <div className="flex gap-3">
              <Button type="button" onClick={saveFeaturedEvent} disabled={saving}>
                Save Featured Event
              </Button>
              {featuredEvent && (
                <Button type="button" variant="destructive" onClick={deleteFeaturedEvent} disabled={saving}>
                  Delete Featured Event
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our 2026 Programs</CardTitle>
            <CardDescription>
              CRUD for the alternating program sections shown below the featured event.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 rounded-lg border p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Program title"
                  value={programForm.title}
                  onChange={(event) => setProgramForm((current) => ({ ...current, title: event.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Order"
                  value={programForm.order_index}
                  onChange={(event) => setProgramForm((current) => ({ ...current, order_index: event.target.value }))}
                />
              </div>

              <Textarea
                placeholder="Program description"
                value={programForm.description}
                onChange={(event) => setProgramForm((current) => ({ ...current, description: event.target.value }))}
              />

              <Input
                placeholder="Program image URL"
                value={programForm.image_url}
                onChange={(event) => setProgramForm((current) => ({ ...current, image_url: event.target.value }))}
              />

              {programForm.image_url && (
                <img
                  src={programForm.image_url}
                  alt={programForm.title || "Program"}
                  className="h-56 w-full rounded-lg object-cover"
                />
              )}

              <MediaPicker
                selected={programForm.image_url}
                onSelect={(url) => setProgramForm((current) => ({ ...current, image_url: url }))}
              />

              <div className="flex gap-3">
                <Button type="button" onClick={saveProgram} disabled={saving}>
                  <Plus className="mr-2 h-4 w-4" />
                  {programForm.id ? "Update Program" : "Add Program"}
                </Button>
                {programForm.id && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setProgramForm({
                        ...emptyProgramForm,
                        order_index: String(programs.length + 1),
                      })
                    }
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            </div>

            {loading ? (
              <p>Loading programs...</p>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {programs.map((program) => (
                  <div key={program.id} className="rounded-lg border p-4">
                    {program.image_url && (
                      <img
                        src={program.image_url}
                        alt={program.title}
                        className="mb-4 h-44 w-full rounded-lg object-cover"
                      />
                    )}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{program.title}</p>
                          <p className="text-sm text-muted-foreground">Order {program.order_index ?? "-"}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button type="button" size="sm" variant="outline" onClick={() => editProgram(program)}>
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => void deleteProgram(program.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{program.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Previous Event Galleries</CardTitle>
            <CardDescription>
              Add, replace, and remove images from the Meet & Greet and Northern Women Summit sections.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 rounded-lg border p-4">
              <div className="grid gap-4 md:grid-cols-3">
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={galleryForm.event_key}
                  onChange={(event) =>
                    setGalleryForm((current) => ({
                      ...current,
                      event_key: event.target.value === "summit-2025" ? "summit-2025" : "meet-greet",
                    }))
                  }
                >
                  <option value="meet-greet">Meet & Greet</option>
                  <option value="summit-2025">Northern Women Summit 2025</option>
                </select>

                <select
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={galleryForm.orientation}
                  onChange={(event) =>
                    setGalleryForm((current) => ({
                      ...current,
                      orientation: event.target.value === "portrait" ? "portrait" : "landscape",
                    }))
                  }
                >
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                </select>

                <Input
                  placeholder="Gallery image URL"
                  value={galleryForm.image_url}
                  onChange={(event) => setGalleryForm((current) => ({ ...current, image_url: event.target.value }))}
                />
              </div>

              {galleryForm.image_url && (
                <img
                  src={galleryForm.image_url}
                  alt="Gallery preview"
                  className="h-56 w-full rounded-lg object-cover"
                />
              )}

              <MediaPicker
                selected={galleryForm.image_url}
                onSelect={(url) => setGalleryForm((current) => ({ ...current, image_url: url }))}
              />

              <div className="flex gap-3">
                <Button type="button" onClick={saveGalleryItem} disabled={saving}>
                  {galleryForm.id ? "Update Gallery Item" : "Add Gallery Item"}
                </Button>
                {galleryForm.id && (
                  <Button type="button" variant="outline" onClick={() => setGalleryForm(emptyGalleryForm)}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <GallerySection
                title="Meet & Greet"
                items={meetGreetGallery}
                onEdit={editGalleryItem}
                onDelete={deleteGalleryItem}
              />
              <GallerySection
                title="Northern Women Summit 2025"
                items={summitGallery}
                onEdit={editGalleryItem}
                onDelete={deleteGalleryItem}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Video</CardTitle>
            <CardDescription>
              Controls the video section at the bottom of the public Events page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Video title"
                value={videoForm.title}
                onChange={(event) => setVideoForm((current) => ({ ...current, title: event.target.value }))}
              />
              <Input
                placeholder="Video URL"
                value={videoForm.video_url}
                onChange={(event) => setVideoForm((current) => ({ ...current, video_url: event.target.value }))}
              />
            </div>

            {videoForm.video_url && (
              <div className="overflow-hidden rounded-lg border bg-black">
                <video src={videoForm.video_url} controls className="h-72 w-full object-contain" />
              </div>
            )}

            <div className="flex gap-3">
              <Button type="button" onClick={saveVideo} disabled={saving}>
                <Video className="mr-2 h-4 w-4" />
                Save Event Video
              </Button>
              {eventVideo && (
                <Button type="button" variant="destructive" onClick={deleteVideo} disabled={saving}>
                  Delete Event Video
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function GallerySection({
  title,
  items,
  onEdit,
  onDelete,
}: {
  title: string;
  items: GalleryRecord[];
  onEdit: (item: GalleryRecord) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{items.length} images</p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No gallery images yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-lg border p-3">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={title}
                  className="mb-3 h-40 w-full rounded-lg object-cover"
                />
              )}
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">{item.orientation || "landscape"}</p>
                <div className="flex gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => onEdit(item)}>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button type="button" size="sm" variant="destructive" onClick={() => onDelete(item.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function toFeaturedForm(record: FeaturedEventRecord | null): FeaturedEventForm {
  if (!record) {
    return emptyFeaturedEventForm;
  }

  return {
    id: record.id,
    title: record.title,
    date: record.date ?? "",
    time: record.time ?? "",
    location: record.location ?? "",
    attendees: record.attendees ?? "",
    image_url: record.image_url ?? "",
  };
}

function toVideoForm(record: VideoRecord | null): VideoForm {
  if (!record) {
    return emptyVideoForm;
  }

  return {
    id: record.id,
    title: record.title,
    video_url: record.video_url ?? "",
  };
}
