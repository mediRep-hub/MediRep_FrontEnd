import { useState, useCallback, useRef } from "react";
import * as XLSX from "xlsx";

// ─── Install dependencies ─────────────────────────────────────────────────────
// npm install pdfjs-dist xlsx
// In your main entry (e.g. main.jsx), set the worker once:
//   import { GlobalWorkerOptions } from "pdfjs-dist";
//   import workerUrl from "pdfjs-dist/build/pdf.worker.min.js?url";
//   GlobalWorkerOptions.workerSrc = workerUrl;
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 25;

// ── PDF text extraction: reconstruct layout by sorting items on Y then X ──────
// PDF.js returns raw text fragments with x/y coords. Without sorting them into
// rows first (like pdftotext -layout does), numbers from different columns get
// mixed together and the parser fails. This function restores reading order.
async function extractLayoutText(pdf, onProgress) {
  const totalPages = pdf.numPages;
  let fullText = "";

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const vp = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();

    // Group items into rows by their Y position (±2pt tolerance)
    const rows = [];
    for (const item of content.items) {
      if (!item.str.trim()) continue;
      // PDF Y is bottom-up; convert to top-down
      const y = Math.round(vp.height - item.transform[5]);
      const x = item.transform[4];
      const existing = rows.find((r) => Math.abs(r.y - y) <= 3);
      if (existing) {
        existing.items.push({ x, str: item.str });
      } else {
        rows.push({ y, items: [{ x, str: item.str }] });
      }
    }

    // Sort rows top-to-bottom, items left-to-right, join with spaces
    rows.sort((a, b) => a.y - b.y);
    for (const row of rows) {
      row.items.sort((a, b) => a.x - b.x);
      // Reconstruct spacing: gap > 10pt between items → insert spaces proportionally
      let line = "";
      for (let j = 0; j < row.items.length; j++) {
        if (j === 0) {
          line += row.items[j].str;
        } else {
          const gap = row.items[j].x - row.items[j - 1].x - (row.items[j - 1].str.length * 5);
          const spaces = gap > 20 ? Math.round(gap / 5) : 1;
          line += " ".repeat(Math.max(1, spaces)) + row.items[j].str;
        }
      }
      fullText += line + "\n";
    }

    onProgress(Math.round(5 + (i / totalPages) * 75), `Reading page ${i} of ${totalPages}…`);
  }

  return fullText;
}

// ── Invoice parser ────────────────────────────────────────────────────────────
const parseInvoice = (text) => {
  const rows = [];
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  let currentRegion = "";
  let currentCustomer = "";

  const regionRe = /Region Id:\s*[\d/]+\s*\/\s*(.+)/i;
  const customerRe = /Customer:\s*\d+\s*\/\s*([^/]+)\//i;

  for (const line of lines) {
    const rm = line.match(regionRe);
    if (rm) { currentRegion = rm[1].trim(); continue; }

    const cm = line.match(customerRe);
    if (cm) { currentCustomer = cm[1].trim(); continue; }

    // Item lines start with a 6-digit product code
    const m = line.match(/^(\d{6})\s+(.+)/);
    if (!m) continue;

    const code = m[1];
    const rest = m[2];
    const tokens = rest.split(/\s+/);

    const nameParts = [];
    const numParts = [];
    let switched = false;

    for (const tok of tokens) {
      if (!switched && /^-?[\d,]+\.?\d*$/.test(tok)) switched = true;
      if (switched) numParts.push(tok);
      else nameParts.push(tok);
    }

    const name = nameParts.join(" ").trim();
    const n = (i) =>
      i < numParts.length && numParts[i] !== "-"
        ? parseFloat(numParts[i].replace(",", ""))
        : 0;

    if (name && numParts.length >= 4) {
      rows.push({
        code,
        name,
        customer: currentCustomer,
        region: currentRegion,
        tp: n(0),
        saleQty: n(1),
        saleReturn: n(2),
        netQty: n(3),
        grossValue: n(4),
        discPct: n(5),
        discValue: n(6),
        netValue: n(7),
      });
    }
  }

  return rows;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
  n != null && n !== 0
    ? Number(n).toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "—";

// ── Sub-components ────────────────────────────────────────────────────────────
function MetricCard({ label, value }) {
  return (
    <div style={styles.metricCard}>
      <div style={styles.metricLabel}>{label}</div>
      <div style={styles.metricValue}>{value}</div>
    </div>
  );
}

function UploadZone({ onFile }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith(".pdf")) onFile(file);
  }, [onFile]);

  return (
    <div
      style={{ ...styles.uploadZone, borderColor: dragging ? "#2563eb" : "#d1d5db", background: dragging ? "#eff6ff" : "#f9fafb" }}
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input ref={inputRef} type="file" accept=".pdf" style={{ display: "none" }}
        onChange={(e) => onFile(e.target.files[0])} />
      <div style={styles.uploadIcon}>📄</div>
      <div style={styles.uploadTitle}>Upload Sales Invoice PDF</div>
      <div style={styles.uploadSub}>Click or drag &amp; drop your PDF here</div>
    </div>
  );
}

function ProgressBar({ pct, message }) {
  return (
    <div style={styles.progressWrap}>
      <div style={styles.progressMessage}>{message}</div>
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${pct}%` }} />
      </div>
      <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>{pct}%</div>
    </div>
  );
}

const TABLE_COLS = [
  { key: "code",       label: "Item code",  num: false },
  { key: "name",       label: "Item name",  num: false },
  { key: "customer",   label: "Customer",   num: false },
  { key: "region",     label: "Bricks",     num: false },
  { key: "tp",         label: "TP",         num: true, render: fmt },
  { key: "saleQty",    label: "Sale qty",   num: true },
  { key: "saleReturn", label: "Return",     num: true, render: (v) => v || "—" },
  { key: "netQty",     label: "Net qty",    num: true },
  { key: "grossValue", label: "Gross value",num: true, render: fmt },
  { key: "discPct",    label: "Disc %",     num: true, render: (v) => v ? v + "%" : "—" },
  { key: "discValue",  label: "Disc value", num: true, render: fmt },
  { key: "netValue",   label: "Net value",  num: true, render: fmt, bold: true },
];

function DataTable({ rows }) {
  return (
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead>
          <tr>
            {TABLE_COLS.map((c) => (
              <th key={c.key} style={{ ...styles.th, textAlign: c.num ? "right" : "left" }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
              {TABLE_COLS.map((c) => (
                <td
                  key={c.key}
                  title={String(row[c.key])}
                  style={{
                    ...styles.td,
                    textAlign: c.num ? "right" : "left",
                    fontWeight: c.bold ? 600 : 400,
                    maxWidth: ["name", "customer"].includes(c.key) ? 180 : undefined,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.key === "code" ? (
                    <span style={styles.badge}>{row[c.key]}</span>
                  ) : c.render ? (
                    c.render(row[c.key])
                  ) : (
                    row[c.key] || "—"
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BrickWiseSaleSummary() {
  const [stage, setStage] = useState("upload"); // upload | loading | data
  const [progress, setProgress] = useState({ pct: 0, message: "" });
  const [allRows, setAllRows] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [page, setPage] = useState(1);

  const regions = [...new Set(allRows.map((r) => r.region))].filter(Boolean).sort();

  const applyFilters = (rows, q, reg) =>
    rows.filter((r) => {
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q.toLowerCase()) ||
        r.customer.toLowerCase().includes(q.toLowerCase()) ||
        r.code.includes(q);
      const matchRegion = !reg || r.region === reg;
      return matchSearch && matchRegion;
    });

  const handleSearch = (q) => {
    setSearch(q);
    setPage(1);
    setFiltered(applyFilters(allRows, q, region));
  };

  const handleRegion = (reg) => {
    setRegion(reg);
    setPage(1);
    setFiltered(applyFilters(allRows, search, reg));
  };

  const setProgressState = (pct, message) => setProgress({ pct, message });

  const handleFile = async (file) => {
    if (!file) return;
    setStage("loading");
    setProgressState(5, "Loading PDF…");

    try {
      const pdfjsLib = await import("pdfjs-dist");
      // Set worker — adjust the path to match your bundler setup
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.js",
        import.meta.url
      ).toString();

      const ab = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: ab }).promise;

      // ← KEY FIX: reconstruct layout-aware text from x/y positions
      const fullText = await extractLayoutText(pdf, setProgressState);

      setProgressState(85, "Parsing invoice data…");
      const rows = parseInvoice(fullText);
      setProgressState(98, "Done!");

      setAllRows(rows);
      setFiltered(rows);
      setSearch("");
      setRegion("");
      setPage(1);
      setStage("data");
    } catch (err) {
      console.error(err);
      alert("Failed to read PDF: " + err.message);
      setStage("upload");
    }
  };

  const exportExcel = () => {
    const headers = [
      "Item Code", "Item Name", "Customer", "Brick", "TP",
      "Sale Qty", "Sale Return", "Net Qty", "Gross Value",
      "Disc %", "Disc Value", "Net Value",
    ];
    const data = [
      headers,
      ...filtered.map((r) => [
        r.code, r.name, r.customer, r.region, r.tp,
        r.saleQty, r.saleReturn, r.netQty, r.grossValue,
        r.discPct, r.discValue, r.netValue,
      ]),
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Column widths
    ws["!cols"] = [
      { wch: 10 }, { wch: 22 }, { wch: 30 }, { wch: 22 }, { wch: 10 },
      { wch: 9 }, { wch: 9 }, { wch: 9 }, { wch: 13 },
      { wch: 8 }, { wch: 12 }, { wch: 13 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Sales Invoice");
    XLSX.writeFile(wb, "al_qamar_sales_invoice.xlsx");
  };

  // ── Pagination ──────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const sliceStart = (page - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(sliceStart, sliceStart + PAGE_SIZE);

  // ── Metrics ─────────────────────────────────────────────────────────────────
  const totalNetValue = allRows.reduce((s, r) => s + r.netValue, 0);
  const totalDiscount = allRows.reduce((s, r) => s + r.discValue, 0);
  const totalSaleQty  = allRows.reduce((s, r) => s + r.saleQty, 0);

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>Sales Invoice</div>
        <div style={styles.headerSub}>WIMITS Pharmaceuticals</div>
      </div>

      {stage === "upload" && <UploadZone onFile={handleFile} />}

      {stage === "loading" && (
        <ProgressBar pct={progress.pct} message={progress.message} />
      )}

      {stage === "data" && (
        <>
          <div style={styles.metricsGrid}>
            <MetricCard label="Line items" value={allRows.length.toLocaleString()} />
            <MetricCard label="Net value (PKR)" value={(totalNetValue / 1e6).toFixed(2) + "M"} />
            <MetricCard label="Total discount" value={(totalDiscount / 1e6).toFixed(2) + "M"} />
            <MetricCard label="Sale qty" value={totalSaleQty.toLocaleString()} />
            <MetricCard label="Bricks" value={[...new Set(allRows.map((r) => r.region))].length} />
            <MetricCard label="Customers" value={[...new Set(allRows.map((r) => r.customer))].length} />
          </div>

          <div style={styles.controls}>
            <input style={styles.input} type="text" placeholder="Search item or customer…"
              value={search} onChange={(e) => handleSearch(e.target.value)} />
            <select style={styles.select} value={region} onChange={(e) => handleRegion(e.target.value)}>
              <option value="">All Bricks</option>
              {regions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <button style={styles.btnPrimary} onClick={exportExcel}>⬇ Export to Excel</button>
            <button style={styles.btn} onClick={() => { setAllRows([]); setFiltered([]); setStage("upload"); }}>
              Upload new PDF
            </button>
          </div>

          <div style={styles.countLabel}>
            Showing {Math.min(sliceStart + 1, filtered.length)}–{Math.min(sliceStart + PAGE_SIZE, filtered.length)} of {filtered.length} line items
          </div>

          <DataTable rows={pageRows} />

          <div style={styles.pager}>
            <button style={styles.pageBtn} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹ Prev</button>
            <span style={styles.pageInfo}>Page {page} of {totalPages}</span>
            <button style={styles.pageBtn} disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next ›</button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  root: { fontFamily: "'DM Sans', 'Segoe UI', sans-serif", fontSize: 14, color: "#111827", maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" },
  header: { marginBottom: "1.5rem" },
  headerTitle: { fontSize: 22, fontWeight: 600, color: "#111827", letterSpacing: "-0.3px" },
  headerSub: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  uploadZone: { border: "2px dashed #d1d5db", borderRadius: 12, padding: "3rem 1.5rem", textAlign: "center", cursor: "pointer", transition: "border-color 0.2s, background 0.2s" },
  uploadIcon: { fontSize: 36, marginBottom: 12 },
  uploadTitle: { fontSize: 16, fontWeight: 600, marginBottom: 6 },
  uploadSub: { fontSize: 13, color: "#6b7280" },
  progressWrap: { padding: "2.5rem 0" },
  progressMessage: { fontSize: 13, color: "#6b7280", marginBottom: 10 },
  progressTrack: { height: 6, borderRadius: 3, background: "#e5e7eb", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3, background: "#2563eb", transition: "width 0.3s ease" },
  metricsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: "1.25rem" },
  metricCard: { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "0.85rem 1rem" },
  metricLabel: { fontSize: 12, color: "#6b7280", marginBottom: 4 },
  metricValue: { fontSize: 20, fontWeight: 600 },
  controls: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "0.75rem", alignItems: "center" },
  input: { flex: "1 1 180px", height: 36, padding: "0 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, outline: "none" },
  select: { flex: "1 1 160px", height: 36, padding: "0 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, background: "#fff" },
  btn: { height: 36, padding: "0 14px", border: "1px solid #d1d5db", borderRadius: 8, background: "#fff", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" },
  btnPrimary: { height: 36, padding: "0 14px", border: "1px solid #1d4ed8", borderRadius: 8, background: "#2563eb", color: "#fff", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", fontWeight: 500 },
  countLabel: { fontSize: 12, color: "#9ca3af", marginBottom: 6 },
  tableWrap: { overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: 10 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { padding: "9px 12px", fontWeight: 500, fontSize: 12, color: "#6b7280", borderBottom: "1px solid #e5e7eb", background: "#f9fafb", whiteSpace: "nowrap" },
  td: { padding: "8px 12px", borderBottom: "1px solid #f3f4f6", verticalAlign: "middle" },
  trEven: { background: "#fff" },
  trOdd: { background: "#fafafa" },
  badge: { display: "inline-block", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600, background: "#eff6ff", color: "#1d4ed8" },
  pager: { display: "flex", alignItems: "center", gap: 10, marginTop: 12, fontSize: 13, color: "#6b7280" },
  pageBtn: { height: 30, minWidth: 60, padding: "0 10px", border: "1px solid #d1d5db", borderRadius: 6, background: "#fff", fontSize: 13, cursor: "pointer" },
  pageInfo: { fontSize: 13 },
};
