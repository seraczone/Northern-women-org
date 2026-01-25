// // // // // // import { useEffect, useState } from "react";
// // // // // // import { supabase } from "@/lib/supabase";
// // // // // // import { Button } from "@/components/ui/button";
// // // // // // import { Trash2, Edit, Plus } from "lucide-react";

// // // // // // interface Quote {
// // // // // //   id: number;
// // // // // //   quote_text: string;
// // // // // //   author?: string;
// // // // // //   week_number: number;
// // // // // //   year: number;
// // // // // // }

// // // // // // export default function AdminQuotes() {
// // // // // //   const [quotes, setQuotes] = useState<Quote[]>([]);
// // // // // //   const [loading, setLoading] = useState(true);
// // // // // //   const [editing, setEditing] = useState<Quote | null>(null);
// // // // // //   const [quoteText, setQuoteText] = useState("");
// // // // // //   const [author, setAuthor] = useState("");
// // // // // //   const [weekNumber, setWeekNumber] = useState<number>(1);

// // // // // //   useEffect(() => {
// // // // // //     fetchQuotes();
// // // // // //   }, []);

// // // // // //   const fetchQuotes = async () => {
// // // // // //     setLoading(true);
// // // // // //     const { data } = await supabase
// // // // // //       .from("weekly_quotes")
// // // // // //       .select("*")
// // // // // //       .order("week_number", { ascending: true });
// // // // // //     setQuotes(data || []);
// // // // // //     setLoading(false);
// // // // // //   };

// // // // // //   const handleSave = async () => {
// // // // // //     if (!quoteText) return alert("Quote cannot be empty");
// // // // // //     if (editing) {
// // // // // //       // Update
// // // // // //       await supabase
// // // // // //         .from("weekly_quotes")
// // // // // //         .update({ quote_text: quoteText, author, week_number: weekNumber })
// // // // // //         .eq("id", editing.id);
// // // // // //     } else {
// // // // // //       // Insert
// // // // // //       await supabase
// // // // // //         .from("weekly_quotes")
// // // // // //         .insert([{ quote_text: quoteText, author, week_number: weekNumber }]);
// // // // // //     }

// // // // // //     setQuoteText("");
// // // // // //     setAuthor("");
// // // // // //     setWeekNumber(1);
// // // // // //     setEditing(null);
// // // // // //     fetchQuotes();
// // // // // //   };

// // // // // //   const handleEdit = (quote: Quote) => {
// // // // // //     setEditing(quote);
// // // // // //     setQuoteText(quote.quote_text);
// // // // // //     setAuthor(quote.author || "");
// // // // // //     setWeekNumber(quote.week_number);
// // // // // //   };

// // // // // //   const handleDelete = async (id: number) => {
// // // // // //     if (confirm("Are you sure you want to delete this quote?")) {
// // // // // //       await supabase.from("weekly_quotes").delete().eq("id", id);
// // // // // //       fetchQuotes();
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className="container-section py-10">
// // // // // //       <h1 className="text-3xl font-bold mb-6">Weekly Motivational Quotes</h1>

// // // // // //       {/* Form */}
// // // // // //       <div className="mb-8 bg-muted p-6 rounded-lg shadow">
// // // // // //         <textarea
// // // // // //           className="w-full p-3 rounded border mb-3"
// // // // // //           rows={3}
// // // // // //           placeholder="Enter motivational quote"
// // // // // //           value={quoteText}
// // // // // //           onChange={(e) => setQuoteText(e.target.value)}
// // // // // //         />
// // // // // //         <input
// // // // // //           type="text"
// // // // // //           placeholder="Author (optional)"
// // // // // //           className="w-full p-2 rounded border mb-3"
// // // // // //           value={author}
// // // // // //           onChange={(e) => setAuthor(e.target.value)}
// // // // // //         />
// // // // // //         <input
// // // // // //           type="number"
// // // // // //           min={1}
// // // // // //           max={52}
// // // // // //           placeholder="Week Number"
// // // // // //           className="w-full p-2 rounded border mb-3"
// // // // // //           value={weekNumber}
// // // // // //           onChange={(e) => setWeekNumber(Number(e.target.value))}
// // // // // //         />
// // // // // //         <Button onClick={handleSave} className="w-full flex items-center justify-center">
// // // // // //           {editing ? "Update Quote" : "Add Quote"} <Plus className="ml-2" />
// // // // // //         </Button>
// // // // // //       </div>

// // // // // //       {/* Quotes List */}
// // // // // //       {loading ? (
// // // // // //         <p>Loading...</p>
// // // // // //       ) : (
// // // // // //         <div className="space-y-4">
// // // // // //           {quotes.map((q) => (
// // // // // //             <div
// // // // // //               key={q.id}
// // // // // //               className="flex justify-between items-center p-4 bg-background rounded shadow"
// // // // // //             >
// // // // // //               <div>
// // // // // //                 <p className="font-medium">{q.quote_text}</p>
// // // // // //                 {q.author && <p className="text-sm text-muted-foreground">— {q.author}</p>}
// // // // // //                 <p className="text-sm text-muted-foreground">Week {q.week_number}</p>
// // // // // //               </div>
// // // // // //               <div className="flex gap-2">
// // // // // //                 <Button size="sm" variant="secondary" onClick={() => handleEdit(q)}>
// // // // // //                   <Edit size={16} />
// // // // // //                 </Button>
// // // // // //                 <Button size="sm" variant="destructive" onClick={() => handleDelete(q.id)}>
// // // // // //                   <Trash2 size={16} />
// // // // // //                 </Button>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           ))}
// // // // // //         </div>
// // // // // //       )}
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // import { useEffect, useState } from "react";
// // // // // import { supabase } from "@/lib/supabase";
// // // // // import { Button } from "@/components/ui/button";
// // // // // import { Trash2, Edit, Plus } from "lucide-react";

// // // // // interface Quote {
// // // // //   id: number;
// // // // //   quote_text: string;
// // // // //   author?: string;
// // // // //   week_number: number;
// // // // //   year: number;
// // // // // }

// // // // // export default function AdminQuotes() {
// // // // //   const [quotes, setQuotes] = useState<Quote[]>([]);
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [editing, setEditing] = useState<Quote | null>(null);
// // // // //   const [quoteText, setQuoteText] = useState("");
// // // // //   const [author, setAuthor] = useState("");
// // // // //   const [weekNumber, setWeekNumber] = useState<number>(1);

// // // // //   useEffect(() => {
// // // // //     fetchQuotes();
// // // // //   }, []);

// // // // //   const fetchQuotes = async () => {
// // // // //     setLoading(true);
// // // // //     const { data } = await supabase
// // // // //       .from("weekly_quotes")
// // // // //       .select("*")
// // // // //       .order("week_number", { ascending: true });
// // // // //     setQuotes(data || []);
// // // // //     setLoading(false);
// // // // //   };

// // // // //   const handleSave = async () => {
// // // // //     if (!quoteText) return alert("Quote cannot be empty");
// // // // //     if (editing) {
// // // // //       // Update
// // // // //       await supabase
// // // // //         .from("weekly_quotes")
// // // // //         .update({ quote_text: quoteText, author, week_number: weekNumber })
// // // // //         .eq("id", editing.id);
// // // // //     } else {
// // // // //       // Insert
// // // // //       await supabase
// // // // //         .from("weekly_quotes")
// // // // //         .insert([{ quote_text: quoteText, author, week_number: weekNumber }]);
// // // // //     }

// // // // //     setQuoteText("");
// // // // //     setAuthor("");
// // // // //     setWeekNumber(1);
// // // // //     setEditing(null);
// // // // //     fetchQuotes();
// // // // //   };

// // // // //   const handleEdit = (quote: Quote) => {
// // // // //     setEditing(quote);
// // // // //     setQuoteText(quote.quote_text);
// // // // //     setAuthor(quote.author || "");
// // // // //     setWeekNumber(quote.week_number);
// // // // //   };

// // // // //   const handleDelete = async (id: number) => {
// // // // //     if (confirm("Are you sure you want to delete this quote?")) {
// // // // //       await supabase.from("weekly_quotes").delete().eq("id", id);
// // // // //       fetchQuotes();
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="container-section py-10">
// // // // //       <h1 className="text-3xl font-bold mb-6">Weekly Motivational Quotes</h1>

// // // // //       {/* Form */}
// // // // //       <div className="mb-8 bg-muted p-6 rounded-lg shadow">
// // // // //         <textarea
// // // // //           className="w-full p-3 rounded border mb-3"
// // // // //           rows={3}
// // // // //           placeholder="Enter motivational quote"
// // // // //           value={quoteText}
// // // // //           onChange={(e) => setQuoteText(e.target.value)}
// // // // //         />
// // // // //         <input
// // // // //           type="text"
// // // // //           placeholder="Author (optional)"
// // // // //           className="w-full p-2 rounded border mb-3"
// // // // //           value={author}
// // // // //           onChange={(e) => setAuthor(e.target.value)}
// // // // //         />
// // // // //         <input
// // // // //           type="number"
// // // // //           min={1}
// // // // //           max={52}
// // // // //           placeholder="Week Number"
// // // // //           className="w-full p-2 rounded border mb-3"
// // // // //           value={weekNumber}
// // // // //           onChange={(e) => setWeekNumber(Number(e.target.value))}
// // // // //         />
// // // // //         <Button onClick={handleSave} className="w-full flex items-center justify-center">
// // // // //           {editing ? "Update Quote" : "Add Quote"} <Plus className="ml-2" />
// // // // //         </Button>
// // // // //       </div>

// // // // //       {/* Quotes List */}
// // // // //       {loading ? (
// // // // //         <p>Loading...</p>
// // // // //       ) : (
// // // // //         <div className="space-y-4">
// // // // //           {quotes.map((q) => (
// // // // //             <div
// // // // //               key={q.id}
// // // // //               className="flex justify-between items-center p-4 bg-background rounded shadow"
// // // // //             >
// // // // //               <div>
// // // // //                 <p className="font-medium">{q.quote_text}</p>
// // // // //                 {q.author && <p className="text-sm text-muted-foreground">— {q.author}</p>}
// // // // //                 <p className="text-sm text-muted-foreground">Week {q.week_number}</p>
// // // // //               </div>
// // // // //               <div className="flex gap-2">
// // // // //                 <Button size="sm" variant="secondary" onClick={() => handleEdit(q)}>
// // // // //                   <Edit size={16} />
// // // // //                 </Button>
// // // // //                 <Button size="sm" variant="destructive" onClick={() => handleDelete(q.id)}>
// // // // //                   <Trash2 size={16} />
// // // // //                 </Button>
// // // // //               </div>
// // // // //             </div>
// // // // //           ))}
// // // // //         </div>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // import { useEffect, useState } from "react";
// // // // import { supabase } from "@/lib/supabase";
// // // // import { Button } from "@/components/ui/button";
// // // // import { Trash2, Edit, Plus } from "lucide-react";

// // // // interface Quote {
// // // //   id: number;
// // // //   quote_text: string;
// // // //   author?: string;
// // // //   week_number: number;
// // // //   year: number;
// // // // }

// // // // export default function AdminQuotes() {
// // // //   const [quotes, setQuotes] = useState<Quote[]>([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [editing, setEditing] = useState<Quote | null>(null);
// // // //   const [quoteText, setQuoteText] = useState("");
// // // //   const [author, setAuthor] = useState("");
// // // //   const [weekNumber, setWeekNumber] = useState<number>(1);

// // // //   useEffect(() => {
// // // //     fetchQuotes();
// // // //   }, []);

// // // //   // Fetch all quotes ordered by week_number
// // // //   const fetchQuotes = async () => {
// // // //     setLoading(true);
// // // //     const { data } = await supabase
// // // //       .from("weekly_quotes")
// // // //       .select("*")
// // // //       .order("week_number", { ascending: true });
// // // //     setQuotes(data || []);
// // // //     setLoading(false);
// // // //   };

// // // //   // Save or update a quote
// // // //   const handleSave = async () => {
// // // //     if (!quoteText) return alert("Quote cannot be empty");
// // // //     if (editing) {
// // // //       // Update existing quote
// // // //       await supabase
// // // //         .from("weekly_quotes")
// // // //         .update({ quote_text: quoteText, author, week_number: weekNumber })
// // // //         .eq("id", editing.id);
// // // //     } else {
// // // //       // Insert new quote
// // // //       await supabase
// // // //         .from("weekly_quotes")
// // // //         .insert([{ quote_text: quoteText, author, week_number: weekNumber }]);
// // // //     }

// // // //     // Reset form and refresh list
// // // //     setQuoteText("");
// // // //     setAuthor("");
// // // //     setWeekNumber(1);
// // // //     setEditing(null);
// // // //     fetchQuotes();
// // // //   };

// // // //   const handleEdit = (quote: Quote) => {
// // // //     setEditing(quote);
// // // //     setQuoteText(quote.quote_text);
// // // //     setAuthor(quote.author || "");
// // // //     setWeekNumber(quote.week_number);
// // // //   };

// // // //   const handleDelete = async (id: number) => {
// // // //     if (confirm("Are you sure you want to delete this quote?")) {
// // // //       await supabase.from("weekly_quotes").delete().eq("id", id);
// // // //       fetchQuotes();
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="container-section py-10">
// // // //       <h1 className="text-3xl font-bold mb-6">Weekly Motivational Quotes</h1>

// // // //       {/* Form to add/edit */}
// // // //       <div className="mb-8 bg-muted p-6 rounded-lg shadow">
// // // //         <textarea
// // // //           className="w-full p-3 rounded border mb-3"
// // // //           rows={3}
// // // //           placeholder="Enter motivational quote"
// // // //           value={quoteText}
// // // //           onChange={(e) => setQuoteText(e.target.value)}
// // // //         />
// // // //         <input
// // // //           type="text"
// // // //           placeholder="Author (optional)"
// // // //           className="w-full p-2 rounded border mb-3"
// // // //           value={author}
// // // //           onChange={(e) => setAuthor(e.target.value)}
// // // //         />
// // // //         <input
// // // //           type="number"
// // // //           min={1}
// // // //           max={52}
// // // //           placeholder="Week Number"
// // // //           className="w-full p-2 rounded border mb-3"
// // // //           value={weekNumber}
// // // //           onChange={(e) => setWeekNumber(Number(e.target.value))}
// // // //         />
// // // //         <Button onClick={handleSave} className="w-full flex items-center justify-center">
// // // //           {editing ? "Update Quote" : "Add Quote"} <Plus className="ml-2" />
// // // //         </Button>
// // // //       </div>

// // // //       {/* Quotes List */}
// // // //       {loading ? (
// // // //         <p>Loading...</p>
// // // //       ) : (
// // // //         <div className="space-y-4">
// // // //           {quotes.map((q) => (
// // // //             <div
// // // //               key={q.id}
// // // //               className="flex justify-between items-center p-4 bg-background rounded shadow"
// // // //             >
// // // //               <div>
// // // //                 <p className="font-medium">{q.quote_text}</p>
// // // //                 {q.author && <p className="text-sm text-muted-foreground">— {q.author}</p>}
// // // //                 <p className="text-sm text-muted-foreground">Week {q.week_number}</p>
// // // //               </div>
// // // //               <div className="flex gap-2">
// // // //                 <Button size="sm" variant="secondary" onClick={() => handleEdit(q)}>
// // // //                   <Edit size={16} />
// // // //                 </Button>
// // // //                 <Button size="sm" variant="destructive" onClick={() => handleDelete(q.id)}>
// // // //                   <Trash2 size={16} />
// // // //                 </Button>
// // // //               </div>
// // // //             </div>
// // // //           ))}
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // import { useEffect, useState } from "react";
// // // import { supabase } from "@/lib/supabase";
// // // import { Button } from "@/components/ui/button";
// // // import { Trash2, Edit, Plus } from "lucide-react";

// // // interface Quote {
// // //   id: number;
// // //   quote_text: string;
// // //   author?: string;
// // //   week_number: number;
// // //   year?: number;
// // // }

// // // export default function AdminQuotes() {
// // //   const [quotes, setQuotes] = useState<Quote[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [editing, setEditing] = useState<Quote | null>(null);
// // //   const [quoteText, setQuoteText] = useState("");
// // //   const [author, setAuthor] = useState("");
// // //   const [weekNumber, setWeekNumber] = useState<number>(1);
// // //   const [year, setYear] = useState<number>(new Date().getFullYear());

// // //   /* ===== FETCH ALL QUOTES ===== */
// // //   useEffect(() => {
// // //     fetchQuotes();
// // //   }, []);

// // //   const fetchQuotes = async () => {
// // //     setLoading(true);
// // //     const { data, error } = await supabase
// // //       .from("weekly_quotes")
// // //       .select("*")
// // //       .order("week_number", { ascending: true });
// // //     if (error) console.error(error);
// // //     setQuotes(data || []);
// // //     setLoading(false);
// // //   };

// // //   /* ===== ADD OR UPDATE ===== */
// // //   const handleSave = async () => {
// // //     if (!quoteText) return alert("Quote cannot be empty");

// // //     if (editing) {
// // //       // Update existing quote
// // //       const { error } = await supabase
// // //         .from("weekly_quotes")
// // //         .update({ quote_text: quoteText, author, week_number: weekNumber, year })
// // //         .eq("id", editing.id);

// // //       if (error) console.error(error);
// // //     } else {
// // //       // Add new quote
// // //       const { error } = await supabase
// // //         .from("weekly_quotes")
// // //         .insert([{ quote_text: quoteText, author, week_number: weekNumber, year }]);
// // //       if (error) console.error(error);
// // //     }

// // //     // Reset form
// // //     setQuoteText("");
// // //     setAuthor("");
// // //     setWeekNumber(1);
// // //     setYear(new Date().getFullYear());
// // //     setEditing(null);
// // //     fetchQuotes();
// // //   };

// // //   /* ===== EDIT QUOTE ===== */
// // //   const handleEdit = (quote: Quote) => {
// // //     setEditing(quote);
// // //     setQuoteText(quote.quote_text);
// // //     setAuthor(quote.author || "");
// // //     setWeekNumber(quote.week_number);
// // //     setYear(quote.year || new Date().getFullYear());
// // //   };

// // //   /* ===== DELETE QUOTE ===== */
// // //   const handleDelete = async (id: number) => {
// // //     if (confirm("Are you sure you want to delete this quote?")) {
// // //       const { error } = await supabase.from("weekly_quotes").delete().eq("id", id);
// // //       if (error) console.error(error);
// // //       fetchQuotes();
// // //     }
// // //   };

// // //   return (
// // //     <div className="container-section py-10">
// // //       <h1 className="text-3xl font-bold mb-6">Weekly Motivational Quotes</h1>

// // //       {/* ===== FORM ===== */}
// // //       <div className="mb-8 bg-muted p-6 rounded-lg shadow">
// // //         <textarea
// // //           className="w-full p-3 rounded border mb-3"
// // //           rows={3}
// // //           placeholder="Enter motivational quote"
// // //           value={quoteText}
// // //           onChange={(e) => setQuoteText(e.target.value)}
// // //         />
// // //         <input
// // //           type="text"
// // //           placeholder="Author (optional)"
// // //           className="w-full p-2 rounded border mb-3"
// // //           value={author}
// // //           onChange={(e) => setAuthor(e.target.value)}
// // //         />
// // //         <input
// // //           type="number"
// // //           min={1}
// // //           max={52}
// // //           placeholder="Week Number"
// // //           className="w-full p-2 rounded border mb-3"
// // //           value={weekNumber}
// // //           onChange={(e) => setWeekNumber(Number(e.target.value))}
// // //         />
// // //         <input
// // //           type="number"
// // //           min={2026}
// // //           max={2100}
// // //           placeholder="Year"
// // //           className="w-full p-2 rounded border mb-3"
// // //           value={year}
// // //           onChange={(e) => setYear(Number(e.target.value))}
// // //         />
// // //         <Button onClick={handleSave} className="w-full flex items-center justify-center">
// // //           {editing ? "Update Quote" : "Add Quote"} <Plus className="ml-2" />
// // //         </Button>
// // //       </div>

// // //       {/* ===== QUOTES LIST ===== */}
// // //       {loading ? (
// // //         <p>Loading...</p>
// // //       ) : (
// // //         <div className="space-y-4">
// // //           {quotes.map((q) => (
// // //             <div
// // //               key={q.id}
// // //               className="flex justify-between items-center p-4 bg-background rounded shadow"
// // //             >
// // //               <div>
// // //                 <p className="font-medium">{q.quote_text}</p>
// // //                 {q.author && <p className="text-sm text-muted-foreground">— {q.author}</p>}
// // //                 <p className="text-sm text-muted-foreground">
// // //                   Week {q.week_number} | {q.year}
// // //                 </p>
// // //               </div>
// // //               <div className="flex gap-2">
// // //                 <Button size="sm" variant="secondary" onClick={() => handleEdit(q)}>
// // //                   <Edit size={16} />
// // //                 </Button>
// // //                 <Button size="sm" variant="destructive" onClick={() => handleDelete(q.id)}>
// // //                   <Trash2 size={16} />
// // //                 </Button>
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // src/pages/AdminQuotes.tsx
// // import { useEffect, useState } from "react";
// // import { supabase } from "@/lib/supabase";
// // import { Button } from "@/components/ui/button";
// // import { Trash2, Edit, Plus } from "lucide-react";

// // interface Quote {
// //   id: number;
// //   quote_text: string;
// //   author?: string;
// //   week_number: number;
// //   year: number;
// // }

// // export default function AdminQuotes() {
// //   const [quotes, setQuotes] = useState<Quote[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [editing, setEditing] = useState<Quote | null>(null);
// //   const [quoteText, setQuoteText] = useState("");
// //   const [author, setAuthor] = useState("");
// //   const [weekNumber, setWeekNumber] = useState<number>(1);

// //   useEffect(() => {
// //     fetchQuotes();
// //   }, []);

// //   const fetchQuotes = async () => {
// //     setLoading(true);
// //     const { data } = await supabase
// //       .from("weekly_quotes")
// //       .select("*")
// //       .order("week_number", { ascending: true });
// //     setQuotes(data || []);
// //     setLoading(false);
// //   };

// //   const handleSave = async () => {
// //     if (!quoteText) return alert("Quote cannot be empty");
// //     if (editing) {
// //       // Update
// //       await supabase
// //         .from("weekly_quotes")
// //         .update({ quote_text: quoteText, author, week_number: weekNumber })
// //         .eq("id", editing.id);
// //     } else {
// //       // Insert
// //       await supabase
// //         .from("weekly_quotes")
// //         .insert([{ quote_text: quoteText, author, week_number: weekNumber }]);
// //     }

// //     setQuoteText("");
// //     setAuthor("");
// //     setWeekNumber(1);
// //     setEditing(null);
// //     fetchQuotes();
// //   };

// //   const handleEdit = (quote: Quote) => {
// //     setEditing(quote);
// //     setQuoteText(quote.quote_text);
// //     setAuthor(quote.author || "");
// //     setWeekNumber(quote.week_number);
// //   };

// //   const handleDelete = async (id: number) => {
// //     if (confirm("Are you sure you want to delete this quote?")) {
// //       await supabase.from("weekly_quotes").delete().eq("id", id);
// //       fetchQuotes();
// //     }
// //   };

// //   return (
// //     <div className="container-section py-10">
// //       <h1 className="text-3xl font-bold mb-6">Weekly Motivational Quotes</h1>

// //       {/* Form */}
// //       <div className="mb-8 bg-muted p-6 rounded-lg shadow">
// //         <textarea
// //           className="w-full p-3 rounded border mb-3"
// //           rows={3}
// //           placeholder="Enter motivational quote"
// //           value={quoteText}
// //           onChange={(e) => setQuoteText(e.target.value)}
// //         />
// //         <input
// //           type="text"
// //           placeholder="Author (optional)"
// //           className="w-full p-2 rounded border mb-3"
// //           value={author}
// //           onChange={(e) => setAuthor(e.target.value)}
// //         />
// //         <input
// //           type="number"
// //           min={1}
// //           max={52}
// //           placeholder="Week Number"
// //           className="w-full p-2 rounded border mb-3"
// //           value={weekNumber}
// //           onChange={(e) => setWeekNumber(Number(e.target.value))}
// //         />
// //         <Button onClick={handleSave} className="w-full flex items-center justify-center">
// //           {editing ? "Update Quote" : "Add Quote"} <Plus className="ml-2" />
// //         </Button>
// //       </div>

// //       {/* Quotes List */}
// //       {loading ? (
// //         <p>Loading...</p>
// //       ) : (
// //         <div className="space-y-4">
// //           {quotes.map((q) => (
// //             <div
// //               key={q.id}
// //               className="flex justify-between items-center p-4 bg-background rounded shadow"
// //             >
// //               <div>
// //                 <p className="font-medium">{q.quote_text}</p>
// //                 {q.author && <p className="text-sm text-muted-foreground">— {q.author}</p>}
// //                 <p className="text-sm text-muted-foreground">Week {q.week_number}</p>
// //               </div>
// //               <div className="flex gap-2">
// //                 <Button size="sm" variant="secondary" onClick={() => handleEdit(q)}>
// //                   <Edit size={16} />
// //                 </Button>
// //                 <Button size="sm" variant="destructive" onClick={() => handleDelete(q.id)}>
// //                   <Trash2 size={16} />
// //                 </Button>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // import { useEffect, useState } from "react";
// // import { supabase } from "@/lib/supabase";
// // import { Button } from "@/components/ui/button";
// // import { Trash2, Edit, Plus } from "lucide-react";

// // interface Quote {
// //   id: number;
// //   quote_text: string;
// //   author?: string;
// //   week_number: number;
// //   year?: number;
// // }

// // export default function AdminQuotes() {
// //   const [quotes, setQuotes] = useState<Quote[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [editing, setEditing] = useState<Quote | null>(null);
// //   const [quoteText, setQuoteText] = useState("");
// //   const [author, setAuthor] = useState("");
// //   const [weekNumber, setWeekNumber] = useState<number>(1);

// //   useEffect(() => {
// //     fetchQuotes();
// //   }, []);

// //   const fetchQuotes = async () => {
// //     setLoading(true);
// //     try {
// //       const { data, error } = await supabase
// //         .from("weekly_quotes")
// //         .select("*")
// //         .order("week_number", { ascending: true });

// //       if (error) throw error;
// //       setQuotes(data || []);
// //     } catch (err: any) {
// //       alert("Failed to fetch quotes: " + err.message);
// //     }
// //     setLoading(false);
// //   };

// //   const handleSave = async () => {
// //     if (!quoteText) return alert("Quote cannot be empty");
// //     try {
// //       if (editing) {
// //         // Update
// //         const { error } = await supabase
// //           .from("weekly_quotes")
// //           .update({ quote_text: quoteText, author, week_number: weekNumber })
// //           .eq("id", editing.id);

// //         if (error) throw error;
// //         alert("Quote updated successfully!");
// //       } else {
// //         // Insert
// //         const { error } = await supabase
// //           .from("weekly_quotes")
// //           .insert([{ quote_text: quoteText, author, week_number: weekNumber }]);

// //         if (error) throw error;
// //         alert("Quote added successfully!");
// //       }

// //       setQuoteText("");
// //       setAuthor("");
// //       setWeekNumber(1);
// //       setEditing(null);
// //       fetchQuotes();
// //     } catch (err: any) {
// //       alert("Failed to save quote: " + err.message);
// //     }
// //   };

// //   const handleEdit = (quote: Quote) => {
// //     setEditing(quote);
// //     setQuoteText(quote.quote_text);
// //     setAuthor(quote.author || "");
// //     setWeekNumber(quote.week_number);
// //   };

// //   const handleDelete = async (id: number) => {
// //     if (!confirm("Are you sure you want to delete this quote?")) return;
// //     try {
// //       const { error } = await supabase.from("weekly_quotes").delete().eq("id", id);
// //       if (error) throw error;
// //       alert("Quote deleted successfully!");
// //       fetchQuotes();
// //     } catch (err: any) {
// //       alert("Failed to delete quote: " + err.message);
// //     }
// //   };

// //   return (
// //     <div className="container-section py-10">
// //       <h1 className="text-3xl font-bold mb-6">Weekly Motivational Quotes</h1>

// //       {/* Form */}
// //       <div className="mb-8 bg-muted p-6 rounded-lg shadow">
// //         <textarea
// //           className="w-full p-3 rounded border mb-3"
// //           rows={3}
// //           placeholder="Enter motivational quote"
// //           value={quoteText}
// //           onChange={(e) => setQuoteText(e.target.value)}
// //         />
// //         <input
// //           type="text"
// //           placeholder="Author (optional)"
// //           className="w-full p-2 rounded border mb-3"
// //           value={author}
// //           onChange={(e) => setAuthor(e.target.value)}
// //         />
// //         <input
// //           type="number"
// //           min={1}
// //           max={53}
// //           placeholder="Week Number"
// //           className="w-full p-2 rounded border mb-3"
// //           value={weekNumber}
// //           onChange={(e) => setWeekNumber(Number(e.target.value))}
// //         />
// //         <Button
// //           onClick={handleSave}
// //           className="w-full flex items-center justify-center"
// //         >
// //           {editing ? "Update Quote" : "Add Quote"} <Plus className="ml-2" />
// //         </Button>
// //       </div>

// //       {/* Quotes List */}
// //       {loading ? (
// //         <p>Loading...</p>
// //       ) : quotes.length === 0 ? (
// //         <p>No quotes available yet.</p>
// //       ) : (
// //         <div className="space-y-4">
// //           {quotes.map((q) => (
// //             <div
// //               key={q.id}
// //               className="flex justify-between items-center p-4 bg-background rounded shadow"
// //             >
// //               <div>
// //                 <p className="font-medium">{q.quote_text}</p>
// //                 {q.author && (
// //                   <p className="text-sm text-muted-foreground">— {q.author}</p>
// //                 )}
// //                 <p className="text-sm text-muted-foreground">Week {q.week_number}</p>
// //               </div>
// //               <div className="flex gap-2">
// //                 <Button
// //                   size="sm"
// //                   variant="secondary"
// //                   onClick={() => handleEdit(q)}
// //                 >
// //                   <Edit size={16} />
// //                 </Button>
// //                 <Button
// //                   size="sm"
// //                   variant="destructive"
// //                   onClick={() => handleDelete(q.id)}
// //                 >
// //                   <Trash2 size={16} />
// //                 </Button>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // import { useEffect, useState } from "react";
// // import { supabase } from "@/lib/supabase";
// // import { Button } from "@/components/ui/button";
// // import { Trash2, Edit, Plus } from "lucide-react";

// // interface Quote {
// //   id: number;
// //   quote_text: string;
// //   author?: string;
// //   week_number: number;
// //   year: number;
// // }

// // export default function AdminQuotes() {
// //   const [quotes, setQuotes] = useState<Quote[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [editing, setEditing] = useState<Quote | null>(null);

// //   const [quoteText, setQuoteText] = useState("");
// //   const [author, setAuthor] = useState("");
// //   const [weekNumber, setWeekNumber] = useState(1);

// //   const year = new Date().getFullYear();

// //   useEffect(() => {
// //     fetchQuotes();
// //   }, []);

// //   const fetchQuotes = async () => {
// //     setLoading(true);
// //     const { data, error } = await supabase
// //       .from("weekly_quotes")
// //       .select("*")
// //       .eq("year", year)
// //       .order("week_number");

// //     if (!error) setQuotes(data || []);
// //     setLoading(false);
// //   };

// //   const handleSave = async () => {
// //     if (!quoteText) return alert("Quote cannot be empty");
// //     if (weekNumber < 1 || weekNumber > 52)
// //       return alert("Week number must be between 1 and 52");

// //     if (editing) {
// //       await supabase
// //         .from("weekly_quotes")
// //         .update({
// //           quote_text: quoteText,
// //           author,
// //           week_number: weekNumber,
// //         })
// //         .eq("id", editing.id);
// //     } else {
// //       await supabase.from("weekly_quotes").insert([
// //         {
// //           quote_text: quoteText,
// //           author,
// //           week_number: weekNumber,
// //           year,
// //         },
// //       ]);
// //     }

// //     resetForm();
// //     fetchQuotes();
// //   };

// //   const resetForm = () => {
// //     setQuoteText("");
// //     setAuthor("");
// //     setWeekNumber(1);
// //     setEditing(null);
// //   };

// //   const handleEdit = (quote: Quote) => {
// //     setEditing(quote);
// //     setQuoteText(quote.quote_text);
// //     setAuthor(quote.author || "");
// //     setWeekNumber(quote.week_number);
// //   };

// //   const handleDelete = async (id: number) => {
// //     if (!confirm("Delete this quote?")) return;
// //     await supabase.from("weekly_quotes").delete().eq("id", id);
// //     fetchQuotes();
// //   };

// //   return (
// //     <div className="container-section py-10 max-w-3xl">
// //       <h1 className="text-3xl font-bold mb-6">Weekly Motivational Quotes</h1>

// //       {/* Form */}
// //       <div className="mb-8 bg-muted p-6 rounded-lg shadow">
// //         <textarea
// //           className="w-full p-3 rounded border mb-3"
// //           rows={3}
// //           placeholder="Enter motivational quote"
// //           value={quoteText}
// //           onChange={(e) => setQuoteText(e.target.value)}
// //         />

// //         <input
// //           type="text"
// //           placeholder="Author (optional)"
// //           className="w-full p-2 rounded border mb-3"
// //           value={author}
// //           onChange={(e) => setAuthor(e.target.value)}
// //         />

// //         <input
// //           type="number"
// //           min={1}
// //           max={52}
// //           className="w-full p-2 rounded border mb-4"
// //           value={weekNumber}
// //           onChange={(e) => setWeekNumber(Number(e.target.value))}
// //         />

// //         <Button onClick={handleSave} className="w-full">
// //           {editing ? "Update Quote" : "Add Quote"}
// //           <Plus className="ml-2" />
// //         </Button>
// //       </div>

// //       {/* List */}
// //       {loading ? (
// //         <p>Loading…</p>
// //       ) : (
// //         <div className="space-y-4">
// //           {quotes.map((q) => (
// //             <div
// //               key={q.id}
// //               className="flex justify-between items-center p-4 bg-card rounded shadow"
// //             >
// //               <div>
// //                 <p className="font-medium">{q.quote_text}</p>
// //                 {q.author && <p className="text-sm">— {q.author}</p>}
// //                 <p className="text-xs text-muted-foreground">
// //                   Week {q.week_number}, {q.year}
// //                 </p>
// //               </div>

// //               <div className="flex gap-2">
// //                 <Button size="sm" variant="secondary" onClick={() => handleEdit(q)}>
// //                   <Edit size={16} />
// //                 </Button>
// //                 <Button size="sm" variant="destructive" onClick={() => handleDelete(q.id)}>
// //                   <Trash2 size={16} />
// //                 </Button>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { Button } from "@/components/ui/button";
// import { Trash2, Edit, Plus } from "lucide-react";
// import AdminLayout from "@/layouts/AdminLayout"; // Make sure path is correct

// interface Quote {
//   id: number;
//   quote_text: string;
//   author?: string;
//   week_number: number;
//   year: number;
// }

// export default function AdminQuotes() {
//   const [quotes, setQuotes] = useState<Quote[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState<Quote | null>(null);

//   const [quoteText, setQuoteText] = useState("");
//   const [author, setAuthor] = useState("");
//   const [weekNumber, setWeekNumber] = useState(1);

//   const year = new Date().getFullYear();

//   useEffect(() => {
//     fetchQuotes();
//   }, []);

//   const fetchQuotes = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from("weekly_quotes")
//       .select("*")
//       .eq("year", year)
//       .order("week_number");

//     if (error) console.error("Error fetching quotes:", error);
//     else setQuotes(data || []);

//     setLoading(false);
//   };

//   const resetForm = () => {
//     setQuoteText("");
//     setAuthor("");
//     setWeekNumber(1);
//     setEditing(null);
//   };

//   const handleSave = async () => {
//     if (!quoteText) return alert("Quote cannot be empty");
//     if (weekNumber < 1 || weekNumber > 52)
//       return alert("Week number must be between 1 and 52");

//     if (editing) {
//       await supabase
//         .from("weekly_quotes")
//         .update({ quote_text: quoteText, author, week_number: weekNumber })
//         .eq("id", editing.id);
//     } else {
//       await supabase.from("weekly_quotes").insert([
//         { quote_text: quoteText, author, week_number: weekNumber, year },
//       ]);
//     }

//     resetForm();
//     fetchQuotes();
//   };

//   const handleEdit = (quote: Quote) => {
//     setEditing(quote);
//     setQuoteText(quote.quote_text);
//     setAuthor(quote.author || "");
//     setWeekNumber(quote.week_number);
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this quote?")) return;
//     await supabase.from("weekly_quotes").delete().eq("id", id);
//     fetchQuotes();
//   };

//   return (
//     <AdminLayout>
//       <div className="container-section py-10 max-w-3xl">
//         <h1 className="text-3xl font-bold mb-6">Weekly Motivational Quotes</h1>

//         {/* Form */}
//         <div className="mb-8 bg-muted p-6 rounded-lg shadow">
//           <textarea
//             className="w-full p-3 rounded border mb-3"
//             rows={3}
//             placeholder="Enter motivational quote"
//             value={quoteText}
//             onChange={(e) => setQuoteText(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Author (optional)"
//             className="w-full p-2 rounded border mb-3"
//             value={author}
//             onChange={(e) => setAuthor(e.target.value)}
//           />
//           <input
//             type="number"
//             min={1}
//             max={52}
//             className="w-full p-2 rounded border mb-4"
//             value={weekNumber}
//             onChange={(e) => setWeekNumber(Number(e.target.value))}
//           />
//           <Button onClick={handleSave} className="w-full flex items-center justify-center">
//             {editing ? "Update Quote" : "Add Quote"} <Plus className="ml-2" />
//           </Button>
//         </div>

//         {/* Quotes List */}
//         {loading ? (
//           <p>Loading…</p>
//         ) : (
//           <div className="space-y-4">
//             {quotes.map((q) => (
//               <div
//                 key={q.id}
//                 className="flex justify-between items-center p-4 bg-card rounded shadow"
//               >
//                 <div>
//                   <p className="font-medium">{q.quote_text}</p>
//                   {q.author && <p className="text-sm">— {q.author}</p>}
//                   <p className="text-xs text-muted-foreground">
//                     Week {q.week_number}, {q.year}
//                   </p>
//                 </div>

//                 <div className="flex gap-2">
//                   <Button size="sm" variant="secondary" onClick={() => handleEdit(q)}>
//                     <Edit size={16} />
//                   </Button>
//                   <Button size="sm" variant="destructive" onClick={() => handleDelete(q.id)}>
//                     <Trash2 size={16} />
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// }

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
