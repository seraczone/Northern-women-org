import { useEffect, useState } from "react";
import { Edit, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useLocation } from "react-router-dom";

import AdminLayout from "./AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Quote {
  id: number;
  quote_text: string;
  author?: string;
  week_number: number;
  year: number;
}

export default function AdminQuotes() {
  const { toast } = useToast();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const weekFromQuery = query.get("week") ? Number(query.get("week")) : 1;
  const year = new Date().getFullYear();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Quote | null>(null);
  const [quoteText, setQuoteText] = useState("");
  const [author, setAuthor] = useState("");
  const [weekNumber, setWeekNumber] = useState<number>(weekFromQuery);

  useEffect(() => {
    void fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("weekly_quotes")
      .select("*")
      .eq("year", year)
      .order("week_number");

    if (error) {
      toast({
        title: "Unable to load quotes",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setQuotes(data || []);
    setLoading(false);

    if (weekFromQuery) {
      const quoteToEdit = data?.find((quote) => quote.week_number === weekFromQuery);
      if (quoteToEdit) {
        handleEdit(quoteToEdit);
      }
    }
  };

  const handleSave = async () => {
    if (!quoteText.trim()) {
      toast({
        title: "Quote text is required",
        variant: "destructive",
      });
      return;
    }

    if (weekNumber < 1 || weekNumber > 52) {
      toast({
        title: "Week number must be between 1 and 52",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    const payload = {
      quote_text: quoteText.trim(),
      author: author.trim() || null,
      week_number: weekNumber,
      year,
    };

    const response = editing
      ? await supabase.from("weekly_quotes").update(payload).eq("id", editing.id)
      : await supabase.from("weekly_quotes").insert([payload]);

    if (response.error) {
      toast({
        title: "Unable to save quote",
        description: response.error.message,
        variant: "destructive",
      });
      setSaving(false);
      return;
    }

    resetForm();
    await fetchQuotes();
    setSaving(false);
    toast({
      title: editing ? "Quote updated" : "Quote added",
    });
  };

  const resetForm = () => {
    setQuoteText("");
    setAuthor("");
    setWeekNumber(weekFromQuery || 1);
    setEditing(null);
  };

  const handleEdit = (quote: Quote) => {
    setEditing(quote);
    setQuoteText(quote.quote_text);
    setAuthor(quote.author || "");
    setWeekNumber(quote.week_number);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Delete this quote?");

    if (!confirmed) {
      return;
    }

    const { error } = await supabase.from("weekly_quotes").delete().eq("id", id);

    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (editing?.id === id) {
      resetForm();
    }

    await fetchQuotes();
    toast({
      title: "Quote deleted",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6 md:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Weekly Motivational Quotes</h1>
            <p className="text-muted-foreground">
              Manage the weekly message used across the site for {year}.
            </p>
          </div>

          <Button variant="outline" onClick={() => void fetchQuotes()} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{editing ? "Edit Quote" : "Add Quote"}</CardTitle>
            <CardDescription>
              Choose the week number and save the motivational text for that week.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              rows={4}
              placeholder="Enter motivational quote"
              value={quoteText}
              onChange={(event) => setQuoteText(event.target.value)}
            />
            <Input
              placeholder="Author (optional)"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
            />
            <Input
              type="number"
              min={1}
              max={52}
              value={weekNumber}
              onChange={(event) => setWeekNumber(Number(event.target.value))}
            />

            <div className="flex gap-3">
              <Button onClick={() => void handleSave()} disabled={saving}>
                <Plus className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : editing ? "Update Quote" : "Add Quote"}
              </Button>
              {editing && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel Edit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quotes</CardTitle>
            <CardDescription>{quotes.length} quotes loaded for {year}.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading quotes...</p>
            ) : quotes.length === 0 ? (
              <p className="text-muted-foreground">No quotes yet.</p>
            ) : (
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between rounded bg-card p-4 shadow">
                    <div>
                      <p className="font-medium">{quote.quote_text}</p>
                      {quote.author && <p className="text-sm">- {quote.author}</p>}
                      <p className="text-xs text-muted-foreground">
                        Week {quote.week_number}, {quote.year}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(quote)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => void handleDelete(quote.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
