export const extractDates = (rows: any[][]) => {
  const fullText = rows.flat().join(" ");

  const match = fullText.match(
    /Date\s*From\s*:?\s*(\d{2}\/\d{2}\/\d{4}).*?To\s*:?\s*(\d{2}\/\d{2}\/\d{4})/i
  );

  return {
    fromDate: match?.[1] || "",
    toDate: match?.[2] || "",
  };
};

export const extractAlliedDates = (rows: any[][]) => {
  for (const row of rows) {
    const text = row.join(" ").toLowerCase();

    if (text.includes("start date from")) {
      return {
        fromDate: row[1] || "",
        toDate: row[3] || "",
      };
    }
  }

  return { fromDate: "", toDate: "" };
};

export const extractNewMohedDates = (rows: any[][]) => {
  for (const row of rows) {
    const text = row.join(" ").toLowerCase();

    if (text.includes("from date") && text.includes("to date")) {
      return {
        fromDate: row[1] || "",
        toDate: row[3] || "",
      };
    }
  }

  return { fromDate: "", toDate: "" };
};

export const extractMZDates = (rows: any[][]) => {
  for (const row of rows) {
    const text = row.join(" ");

    const match = text.match(
      /From\s*Date\s*:?\s*(\d{2}\/\d{2}\/\d{4}).*?To\s*Date\s*:?\s*(\d{2}\/\d{2}\/\d{4})/i
    );

    if (match) {
      return {
        fromDate: match[1],
        toDate: match[2],
      };
    }
  }

  return { fromDate: "", toDate: "" };
};

export const extractSajjadDates = (rows: any[][]) => {
  for (const row of rows) {
    const cleaned = row.map((r) => r?.toString().trim());

    const fromIndex = cleaned.findIndex((t) =>
      t?.toLowerCase().includes("from date")
    );

    const toIndex = cleaned.findIndex((t) =>
      t?.toLowerCase().includes("to date")
    );

    if (fromIndex !== -1 && toIndex !== -1) {
      const fromDate = cleaned[fromIndex + 1] || "";
      const toDate = cleaned[toIndex + 1] || "";

      return {
        fromDate,
        toDate,
      };
    }
  }

  return { fromDate: "", toDate: "" };
};

export const extractPharmaLinkDates = (rows: any[][]) => {
  for (const row of rows) {
    const text = row.join(" ");

    const match = text.match(
      /FROM\s*(\d{2}-\d{2}-\d{4})\s*TO\s*(\d{2}-\d{2}-\d{4})/i
    );

    if (match) {
      return {
        fromDate: match[1],
        toDate: match[2],
      };
    }
  }

  return { fromDate: "", toDate: "" };
};

export const extractAliPharmaDates = (rows: any[][]) => {
  for (const row of rows) {
    const text = row.join(" ");

    const match = text.match(
      /From\s*Date\s*:?\s*(\d{2}-\d{2}-\d{4})\s*To\s*:\s*(\d{2}-\d{2}-\d{4})/i
    );

    if (match) {
      return {
        fromDate: match[1],
        toDate: match[2],
      };
    }
  }

  return { fromDate: "", toDate: "" };
};

export const extractAlRehmatDates = (rows: any[][]) => {
  for (const row of rows) {
    const text = row.join(" ");

    const match = text.match(
      /From\s*Date\s*:?\s*(\d{2}-\d{2}-\d{2,4})\s*\.{0,2}\s*To\s*\.{0,2}\s*(\d{2}-\d{2}-\d{2,4})/i
    );

    if (match) {
      let fromDate = match[1];
      let toDate = match[2];

      // 🔥 normalize year if 2-digit
      const fixYear = (d: string) => {
        const parts = d.split("-");
        if (parts[2]?.length === 2) {
          parts[2] = "20" + parts[2];
        }
        return parts.join("-");
      };

      return {
        fromDate: fixYear(fromDate),
        toDate: fixYear(toDate),
      };
    }
  }

  return { fromDate: "", toDate: "" };
};

export const extractFaisalPharmaDates = (rows: any[][]) => {
  for (const row of rows) {
    const text = row.join(" ");

    const match = text.match(
      /Date\s*From\s*:?\s*(\d{2}-\d{2}-\d{4})\s*\.{0,2}\s*To\s*\.{0,2}\s*(\d{2}-\d{2}-\d{4})/i
    );

    if (match) {
      return {
        fromDate: match[1],
        toDate: match[2],
      };
    }
  }

  return { fromDate: "", toDate: "" };
};

export const extractLatifSonsDates = (rows: any[][]) => {
  for (const row of rows) {
    const cleaned = row.map((r) => r?.toString().trim());

    const fromIndex = cleaned.findIndex((t) =>
      t?.toLowerCase() === "from"
    );

    const toIndex = cleaned.findIndex((t) =>
      t?.toLowerCase() === "to"
    );

    if (fromIndex !== -1 && toIndex !== -1) {
      const fromDate = cleaned[fromIndex + 2] || ""; // skip '#'
      const toDate = cleaned[toIndex + 2] || "";

      return {
        fromDate,
        toDate,
      };
    }
  }

  return { fromDate: "", toDate: "" };
};

export const extractPharmaPagePusDates = (rows: any[][]) => {
  let fromDate = "";
  let toDate = "";

  for (const row of rows) {
    const cleaned = row.map((r) => r?.toString().trim());

    // 🔵 From Date
    if (cleaned.some((t) => t.toLowerCase().includes("date from"))) {
      const idx = cleaned.findIndex((t) =>
        t.toLowerCase().includes("date from")
      );
      fromDate = cleaned[idx + 1] || "";
    }

    // 🔴 To Date
    if (cleaned.some((t) => t.toLowerCase().includes("date to"))) {
      const idx = cleaned.findIndex((t) =>
        t.toLowerCase().includes("date to")
      );

      // value might be after ":" so skip it
      toDate =
        cleaned[idx + 1]?.includes(":")
          ? cleaned[idx + 2] || ""
          : cleaned[idx + 1] || "";
    }
  }

  return { fromDate, toDate };
};

export const extractSheryarDates = (rows: any[][]) => {
  let fromDate = "";
  let toDate = "";

  for (const row of rows) {
    const text = row.join(" ");

    const match = text.match(
      /(\d{2}\/\d{2}\/\d{4}).*?(\d{2}\/\d{2}\/\d{4})/
    );

    if (match) {
      fromDate = match[1];
      toDate = match[2];
      break;
    }
  }

  return { fromDate, toDate };
};

export const extractUmerBrothersDates = (rows: any[][]) => {
  let dates: string[] = [];

  for (const row of rows) {
    const text = row.join(" ");

    // 🔥 collect ALL dates in row
    const matches = text.match(/\d{2}\/\d{2}\/\d{4}/g);

    if (matches && matches.length >= 2) {
      dates = matches;
      break;
    }
  }

  return {
    fromDate: dates[0] || "",
    toDate: dates[1] || "",
  };
};