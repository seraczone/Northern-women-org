import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus } from "lucide-react";
import AdminLayout from "./AdminLayout";

interface Quote {
  id: number;
  quote_text: string;
  author?: string;
  week_number: number;
  year: number;
}

export default function AdminQuotes() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const weekFromQuery = query.get("week") ? Number(query.get("week")) : 1;

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Quote | null>(null);
  const [quoteText, setQuoteText] = useState("");
  const [author, setAuthor] = useState("");
  const [weekNumber, setWeekNumber] = useState<number>(weekFromQuery);
  const year = new Date().getFullYear();

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("weekly_quotes")
      .select("*")
      .eq("year", year)
      .order("week_number");

    if (!error) setQuotes(data || []);
    setLoading(false);

    // Auto-load week from query if present
    if (weekFromQuery) {
      const quoteToEdit = data?.find((q) => q.week_number === weekFromQuery);
      if (quoteToEdit) handleEdit(quoteToEdit);
    }
  };

  const handleSave = async () => {
    if (!quoteText) return alert("Quote cannot be empty");
    if (weekNumber < 1 || weekNumber > 52)
      return alert("Week number must be between 1 and 52");

    if (editing) {
      await supabase
        .from("weekly_quotes")
        .update({ quote_text: quoteText, author, week_number: weekNumber })
        .eq("id", editing.id);
    } else {
      await supabase.from("weekly_quotes").insert([{ quote_text: quoteText, author, week_number: weekNumber, year }]);
    }

    resetForm();
    fetchQuotes();
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
    if (!confirm("Delete this quote?")) return;
    await supabase.from("weekly_quotes").delete().eq("id", id);
    fetchQuotes();
  };

  return (
    <AdminLayout>
      <div className="container-section py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Weekly Motivational Quotes</h1>

        {/* Form */}
        <div className="mb-8 bg-muted p-6 rounded-lg shadow">
          <textarea
            className="w-full p-3 rounded border mb-3"
            rows={3}
            placeholder="Enter motivational quote"
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
          />
          <input
            type="text"
            placeholder="Author (optional)"
            className="w-full p-2 rounded border mb-3"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <input
            type="number"
            min={1}
            max={52}
            className="w-full p-2 rounded border mb-4"
            value={weekNumber}
            onChange={(e) => setWeekNumber(Number(e.target.value))}
          />
          <Button onClick={handleSave} className="w-full">
            {editing ? "Update Quote" : "Add Quote"}
            <Plus className="ml-2" />
          </Button>
        </div>

        {/* List */}
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="space-y-4">
            {quotes.map((q) => (
              <div key={q.id} className="flex justify-between items-center p-4 bg-card rounded shadow">
                <div>
                  <p className="font-medium">{q.quote_text}</p>
                  {q.author && <p className="text-sm">— {q.author}</p>}
                  <p className="text-xs text-muted-foreground">
                    Week {q.week_number}, {q.year}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(q)}>
                    <Edit size={16} />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(q.id)}>
                    <Trash2 size={16} />
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
