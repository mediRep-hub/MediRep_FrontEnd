import * as XLSX from "xlsx";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

export const extractPDFData = async (file: File, distributor: any) => {
  console.log("🚀 ~ extractPDFData ~ distributor:", distributor)
  const rawData: any[][] = [];
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
 let isValidFile = false;

for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
  const page = await pdf.getPage(pageNum);
  const textContent: any = await page.getTextContent();

  const normalize = (str: string) =>
    str
      ?.toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/\u00A0/g, " ")
      .trim();

  const fullText = textContent.items
    .map((item: any) => normalize(item.str))
    .join(" ");
  console.log("🚀 ~ extractPDFData ~ fullText:", fullText)

    //     textContent?.items?.forEach((item: any) => {
    // console.log("TEXT:", JSON.stringify(item?.str));
    //     }
    //     )

  // ✅ Sirf first page check karo
  if (pageNum === 1) {
    isValidFile = fullText.includes(normalize(distributor));

    if (!isValidFile) {
      alert("Please select a correct distribution file");
      return rawData?.push([]);
    }
  }

  // ✅ har page ka data extract karo (no condition)
  const items = textContent.items
    .map((item: any) => ({
      text: item.str.trim(),
      x: item.transform[4],
      y: item.transform[5],
    }))
    .filter((item: any) => item.text);

  const rows: any[] = [];
  const threshold = 5;

  items.forEach((item: any) => {
    let row = rows.find((r) => Math.abs(r.y - item.y) < threshold);
    if (!row) {
      row = { y: item.y, cells: [] };
      rows.push(row);
    }
    row.cells.push(item);
  });

  rows.sort((a, b) => b.y - a.y);

  rows.forEach((row) => {
    row.cells.sort((a: any, b: any) => a.x - b.x);
    rawData.push(row.cells.map((cell: any) => cell.text));
  });
}

  return rawData;
};

export const parseFile = async (file: File, distributor: any) => {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "csv") {
    const text = await file.text();
    return text.split("\n").map((line) => line.split(/,|\t/));
  }

  if (ext === "xls" || ext === "xlsx") {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  }

  if (ext === "pdf") {
    return extractPDFData(file, distributor);
  }

  return [];
};
