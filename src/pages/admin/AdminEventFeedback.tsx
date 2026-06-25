import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, RefreshCw, Trash2 } from "lucide-react";

import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { EventFeedbackRecord } from "@/lib/eventFeedback";
import { supabase } from "@/lib/supabase";

const formatValue = (value: string | null | undefined) => value || "-";
const exportFileNameBase = "event_feedback";

const exportHeaders = [
  "No",
  "Database ID",
  "Full Name",
  "Business Name",
  "Instagram / Business Handle",
  "Contact Number",
  "What Made You Join",
  "Experience",
  "Expectations",
  "Requested Support",
  "Improvement Areas",
  "Suggestions",
  "Final Message",
  "Consent",
  "Submitted At",
];

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const normalizePdfText = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const escapePdfText = (value: string) =>
  normalizePdfText(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const wrapPdfText = (value: string, maxLength = 96) => {
  const words = normalizePdfText(value).split(" ").filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length > maxLength) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        lines.push(word.slice(0, maxLength));
        currentLine = word.slice(maxLength);
      }
      return;
    }

    currentLine = nextLine;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : ["-"];
};

const buildPdfBlob = (title: string, rows: string[][]) => {
  const pageWidth = 612;
  const pageHeight = 792;
  const marginX = 42;
  const topY = 744;
  const bottomY = 52;
  const lineHeight = 13;
  const pages: string[][] = [[]];
  let y = topY;

  const addLine = (line: string, fontSize = 10) => {
    if (y < bottomY) {
      pages.push([]);
      y = topY;
    }

    const activePage = pages[pages.length - 1];
    activePage.push(`BT /F1 ${fontSize} Tf ${marginX} ${y} Td (${escapePdfText(line)}) Tj ET`);
    y -= lineHeight;
  };

  addLine(title, 16);
  addLine(`Generated: ${new Date().toLocaleString()}`, 9);
  addLine(`Records: ${rows.length}`, 9);
  y -= 8;

  rows.forEach((row, index) => {
    addLine(`${index + 1}. ${row[2]} | ${row[3] || "-"} | ${row[4] || "-"}`, 11);

    [
      ["Contact", row[5]],
      ["Joined", row[6]],
      ["Experience", row[7]],
      ["Expectations", row[8]],
      ["Support", row[9]],
      ["Improve", row[10]],
      ["Suggestions", row[11]],
      ["Final", row[12]],
      ["Submitted", row[14]],
    ].forEach(([label, value]) => {
      wrapPdfText(`${label}: ${value || "-"}`).forEach((line) => addLine(line, 9));
    });

    y -= 8;
  });

  const objects: string[] = [];
  const addObject = (content: string) => {
    objects.push(content);
    return objects.length;
  };

  const catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
  const pagesId = addObject("");
  const fontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageIds: number[] = [];

  pages.forEach((pageLines) => {
    const stream = pageLines.join("\n");
    const contentId = addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    const pageId = addObject(
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`,
    );
    pageIds.push(pageId);
  });

  objects[pagesId - 1] =
    `<< /Type /Pages /Kids [${pageIds.map((pageId) => `${pageId} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
};

export default function AdminEventFeedback() {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<EventFeedbackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchFeedback = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("event_feedback")
      .select("*")
      .order("created_at", { ascending: sortOrder === "asc" });

    if (error) {
      toast({
        title: "Unable to load feedback",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setFeedback((data ?? []) as EventFeedbackRecord[]);
    setLoading(false);
  }, [sortOrder, toast]);

  useEffect(() => {
    void fetchFeedback();
  }, [fetchFeedback]);

  const filteredFeedback = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return feedback;
    }

    return feedback.filter((entry) =>
      [
        entry.full_name,
        entry.business_name || "",
        entry.social_handle || "",
        entry.contact_number || "",
        entry.joined_reason,
        entry.experience,
        entry.expectations || "",
        entry.requested_support || "",
        entry.improvement_areas || "",
        entry.suggestions || "",
        entry.final_message || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedTerm),
    );
  }, [feedback, searchTerm]);

  const exportRows = useMemo(
    () =>
      filteredFeedback.map((entry, index) => [
      index + 1,
      entry.id,
      entry.full_name,
      entry.business_name || "",
      entry.social_handle || "",
      entry.contact_number || "",
      entry.joined_reason,
      entry.experience,
      entry.expectations || "",
      entry.requested_support || "",
      entry.improvement_areas || "",
      entry.suggestions || "",
      entry.final_message || "",
      entry.consent ? "Yes" : "No",
      new Date(entry.created_at).toISOString(),
      ]),
    [filteredFeedback],
  );

  const exportToCsv = () => {
    const csv = [exportHeaders, ...exportRows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, `${exportFileNameBase}.csv`);

    toast({
      title: "CSV exported",
      description: "The event feedback export has been downloaded.",
    });
  };

  const exportToExcel = () => {
    const tableRows = [exportHeaders, ...exportRows]
      .map(
        (row) =>
          `<tr>${row
            .map((value) => `<td>${escapeHtml(String(value))}</td>`)
            .join("")}</tr>`,
      )
      .join("");
    const worksheet = `<!doctype html><html><head><meta charset="utf-8" /></head><body><table>${tableRows}</table></body></html>`;
    const blob = new Blob([worksheet], { type: "application/vnd.ms-excel;charset=utf-8;" });

    downloadBlob(blob, `${exportFileNameBase}.xls`);

    toast({
      title: "Excel exported",
      description: "The event feedback Excel file has been downloaded.",
    });
  };

  const exportToPdf = () => {
    const blob = buildPdfBlob("Northern Women Event Feedback", exportRows.map((row) => row.map(String)));

    downloadBlob(blob, `${exportFileNameBase}.pdf`);

    toast({
      title: "PDF exported",
      description: "The event feedback PDF has been downloaded.",
    });
  };

  const deleteFeedback = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this feedback response?");

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    const { error } = await supabase.from("event_feedback").delete().eq("id", id);

    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
      setDeletingId(null);
      return;
    }

    setFeedback((current) => current.filter((entry) => entry.id !== id));
    setDeletingId(null);
    toast({
      title: "Feedback deleted",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6 md:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Event Feedback</h1>
            <p className="text-muted-foreground">
              Review Northern Women feedback responses and export submissions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={exportToPdf} disabled={filteredFeedback.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="secondary" onClick={exportToExcel} disabled={filteredFeedback.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button variant="outline" onClick={exportToCsv} disabled={filteredFeedback.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => void fetchFeedback()} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{feedback.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">With Business</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {feedback.filter((entry) => Boolean(entry.business_name)).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">With Handles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {feedback.filter((entry) => Boolean(entry.social_handle)).length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Search by name, business, handle, contact number, or feedback text.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row">
            <Input
              placeholder="Search feedback responses"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as "asc" | "desc")}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Responses</CardTitle>
            <CardDescription>{filteredFeedback.length} records in the current view.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading feedback responses...</p>
            ) : filteredFeedback.length === 0 ? (
              <p className="text-muted-foreground">No feedback responses found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted text-left">
                      <th className="border p-3">No.</th>
                      <th className="border p-3">Person</th>
                      <th className="border p-3">About</th>
                      <th className="border p-3">Experience</th>
                      <th className="border p-3">Growth & Support</th>
                      <th className="border p-3">Suggestions</th>
                      <th className="border p-3">Submitted</th>
                      <th className="border p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFeedback.map((entry, index) => (
                      <tr key={entry.id} className="hover:bg-muted/50">
                        <td className="border p-3 align-top font-medium">{index + 1}</td>
                        <td className="border p-3 align-top">
                          <p className="font-medium">{entry.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatValue(entry.business_name)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatValue(entry.social_handle)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatValue(entry.contact_number)}
                          </p>
                        </td>
                        <td className="min-w-72 border p-3 align-top text-sm">
                          {entry.joined_reason}
                        </td>
                        <td className="min-w-72 border p-3 align-top text-sm">
                          <p>{entry.experience}</p>
                          {entry.expectations ? (
                            <p className="mt-3 text-muted-foreground">{entry.expectations}</p>
                          ) : null}
                        </td>
                        <td className="min-w-72 border p-3 align-top text-sm">
                          <p>{formatValue(entry.requested_support)}</p>
                          {entry.improvement_areas ? (
                            <p className="mt-3 text-muted-foreground">{entry.improvement_areas}</p>
                          ) : null}
                        </td>
                        <td className="min-w-72 border p-3 align-top text-sm">
                          <p>{formatValue(entry.suggestions)}</p>
                          {entry.final_message ? (
                            <p className="mt-3 text-muted-foreground">{entry.final_message}</p>
                          ) : null}
                        </td>
                        <td className="border p-3 align-top text-sm text-muted-foreground">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </td>
                        <td className="border p-3 align-top">
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === entry.id}
                            onClick={() => void deleteFeedback(entry.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deletingId === entry.id ? "Deleting..." : "Delete"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
