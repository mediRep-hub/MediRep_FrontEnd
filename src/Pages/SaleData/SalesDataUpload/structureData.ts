import {
  extractAliPharmaDates,
  extractAlliedDates,
  extractAlRehmatDates,
  extractDates,
  extractFaisalPharmaDates,
  extractLatifSonsDates,
  extractMZDates,
  extractNewMohedDates,
  extractPharmaLinkDates,
  extractPharmaPagePusDates,
  extractSajjadDates,
  extractSheryarDates,
  extractUmerBrothersDates,
} from "./extractMonth";

type Row = any[];

const join = (...vals: any[]) =>
  vals.filter((v) => v !== undefined && v !== null && v !== "").join(" ");

// ✅ 2. Skip unwanted rows
const isValidRow = (row: Row) => {
  const text = row.join(" ").toLowerCase();

  const skipKeywords = [
    "date from",
    "powered by",
    "report",
    "page",
    "company",
    "stock report",
  ];

  return !skipKeywords.some((k) => text.includes(k));
};

let fromDate = "";
let toDate = "";

// ✅ 3. Distributors with same date format
const distributorsWithDates = [
  "Abdullah Enterprises - Chakwal",
  "Al-Fateh Medicine Co - Burewala",
  "AL Aziz Distributors - Sargodha",
  "Al Qamar",
  "Drug Services",
  "Allied Enterprises",
  "New Mohed Traders",
  "Zaheer Pharma",
  "MZ Pharma Distribution (Pakpattan)",
  "Sajjad Enterprises",
  "Pharma Link Distributor",
  "Ali Pharma (Distribution)",
  "Al-Rehmat Distributors",
  "Faisal Pharma",
  "Latif & Sons Distributors",
  "Pharma Page Plus",
  "Sheryar Distributor",
  "Umer Brothers",
];

// ✅ 4. Main Function
export const structureData = (dataRows: Row[], distributor: string) => {
  if (distributor === "Allied Enterprises") {
    ({ fromDate, toDate } = extractAlliedDates(dataRows));
  } else if (distributor === "New Mohed Traders") {
    ({ fromDate, toDate } = extractNewMohedDates(dataRows));
  } else if (distributor === "MZ Pharma Distribution (Pakpattan)") {
    ({ fromDate, toDate } = extractMZDates(dataRows)); // 👈 NEW
  } else if (distributor === "Sajjad Enterprises") {
    ({ fromDate, toDate } = extractSajjadDates(dataRows));
  } else if (distributor === "Pharma Link Distributor") {
    ({ fromDate, toDate } = extractPharmaLinkDates(dataRows));
  } else if (distributor === "Ali Pharma (Distribution)") {
    ({ fromDate, toDate } = extractAliPharmaDates(dataRows));
  } else if (distributor === "Al-Rehmat Distributors") {
    ({ fromDate, toDate } = extractAlRehmatDates(dataRows));
  } else if (distributor === "Faisal Pharma") {
    ({ fromDate, toDate } = extractFaisalPharmaDates(dataRows));
  } else if (distributor === "Latif & Sons Distributors") {
    ({ fromDate, toDate } = extractLatifSonsDates(dataRows));
  } else if (distributor === "Pharma Page Plus") {
    ({ fromDate, toDate } = extractPharmaPagePusDates(dataRows));
  } else if (distributor === "Sheryar Distributor") {
    ({ fromDate, toDate } = extractSheryarDates(dataRows));
  } else if (distributor === "Umer Brothers") {
    ({ fromDate, toDate } = extractUmerBrothersDates(dataRows));
  } else {
    ({ fromDate, toDate } = extractDates(dataRows));

  }
  return dataRows.filter(isValidRow).map((row) => {
    console.log("🚀 ~ structureData ~ row:", row[0])
    let result: any;

    switch (distributor) {
      // ===============================
      case "Abdullah Enterprises - Chakwal":
      case "Al-Fateh Medicine Co - Burewala":
        result = {
          "Distributor Name": "",
          "Item Description": row[0] || "",
          Rate: row[1] || "-",
          "Opening Balance Quantity": row[2] || "-",
          "Opening Balance Value": row[3] || "-",
          "Purchase Quantity": row[4] || "-",
          "Purchase Bonus": row[5] || "-",
          "Purchase Return Quantity": row[6] || "-",
          "Purchase Bonus Return": row[7] || "-",
          "Purchase Total Quantity": row[8] || "-",
          "Purchase Total Bonus": row[9] || "-",
          "Sale Quantity": row[10] || "-",
          "Sale Bonus": row[11] || "-",
          "Sale Return": row[12] || "-",
          "Sale Bonus Return": row[13] || "-",
          "Total Sale Quantity": row[14] || "-",
          "Total Sale Bonus": row[15] || "-",
          "Sale Value": row[16] || "-",
          Expiry: 0,
          "Adjustment Quantity": row[17] || "-",
          "Adjustment Bonus": row[18] || "-",
          "Closing Balance Quantity": row[19] || "-",
          "Closing Balance Bonus": row[20] || "-",
          "Closing Value": row[21] || "-",
          "Today Sale": row[22] || "-",
          "Today Return": row[23] || "-",
        };

        break;

      // ===============================
      case "AL Aziz Distributors - Sargodha":
      case "Al Qamar":
      case "Drug Services":
      case "Zaheer Pharma":
        result = {
          "Distributor Name": "",
          "Item Description": row[0] || "",
          Rate: row[1] || "-",
          Pack: `${row[2] ?? 0}`,
          "Opening Balance Quantity": row[3] || "-",
          "Opening Balance Value": row[4] || "-",
          "Purchase Quantity": row[5] || "-",
          "Purchase Bonus": row[6] || "-",
          "Purchase Return Quantity": row[7] || "-",
          "Purchase Bonus Return": row[8] || "-",
          "Purchase Total Quantity": row[9] || "-",
          "Purchase Total Bonus": row[10] || "-",
          "Sale Quantity": row[11] || "-",
          "Sale Bonus": row[12] || "-",
          "Sale Value": row[13] || "-",
          "Adjustment Quantity": row[14] || "-",
          "Adjustment Bonus": row[15] || "-",
          "Closing Balance Quantity": row[16] || "-",
          "Closing Balance Bonus": row[17] || "-",
          "Closing Value": row[18] || "-",
          "Today Sale": row[19] || "-",
          "Today Return": row[20] || "-",
        };
        break;

      // ===============================
      case "Allied Enterprises": {
        result = {
          "Distributor Name": "",
          "Item Description": row[0] || "",
          Rate: row[1] || "",
          "Opening Balance Quantity": row[2] || "",
          "Purchase Quantity": row[3] || "",
          "Purchase Bonus": row[4] || "",
          "Sale Quantity": row[5] || "",
          "Sale Bonus": row[6] || "",
          "Sale Return": row[7] || "",
          "Sale Bonus Return": row[8] || "",
          "Total Sale Quantity": row[9] || "",
          "Total Sale Bonus": row[10] || "",
          "Sale Value": row[11] || "",
          Expiry: 0,
          "Transfer In": row[12] || "",
          "Transfer Out": row[13] || "",
          "Availability Current": row[14] || "",
          "Availability Total": row[15] || "",
          "Closing Balance Quantity": row[16] || "",
          "Closing Value": row[17] || "",
        };
        break;
      }

      // ===============================
      case "New Mohed Traders": {
        result = {
          "Distributor Name": "",
          "Item Description": row[0] || "",
          Pack: `${row[1] ?? 0}`,
          Rate: row[2] || "-",
          "Opening Balance Quantity": row[3] || "-",
          "Purchase Quantity": row[4] || "-",
          "Purchase Bonus": row[5] || "-",
          "Purchase Total Quantity": row[6] || "-",
          "Sale Return": row[7] || "-",
          "Sale Bonus Return": row[8] || "-",
          "Sale Quantity": row[9] || "-",
          "Sale Bonus": row[10] || "-",
          "Sale Value": row[11] || "-",
          "Closing Balance Quantity": row[12] || "-",
        };
        break;
      }

      // ===============================
      case "MZ Pharma Distribution (Pakpattan)": {
        result = {
          "Distributor Name": "",
          "Item Description": `${row[0] ?? 0} ${row[1] ?? 0}`,
          "Opening Balance Quantity": row[2] || "-",
          "Purchase Quantity": row[3] || "-",
          "Purchase Bonus": row[4] || "-",
          "Purchase Return Quantity": row[5] || "-",
          "Purchase Bonus Return": row[6] || "-",
          "Adjustment Quantity": row[7] || "-",
          "Gross Sale": row[8] || "-",
          "Sale Return": row[9] || "-",
          "Sale Quantity": row[10] || "-",
          "Sale Bonus": row[11] || "-",
          "Sale Value": row[12] || "-",
          "Closing Balance Quantity": row[13] || "-",
          "Closing Value": row[14] || "-",
        };
        break;
      }

      // ===============================

      case "Sajjad Enterprises": {
        const isSplitName = isNaN(Number(row[2]));
        const shift = isSplitName ? 1 : 0;

        result = {
          "Distributor Name": "",
          "Item Description": isSplitName ? join(row[1], row[2]) : row[1],
          Rate: row[2 + shift] || "-",
          "Opening Balance Quantity": row[4 + shift] || "-",
          "Opening Balance Value": row[5 + shift] || "-",
          "Purchase Quantity": row[6 + shift] || "-",
          "Purchase Bonus": row[7 + shift] || "-",
          "Purchase Value": row[8 + shift] || "-",
          "Bonus Claim": row[9 + shift] || "-",
          "Sale Quantity": row[10 + shift] || "-",
          "Sale Bonus": row[11 + shift] || "-",
          "Sale Return": row[12 + shift] || "-",
          "Sale Bonus Return": row[13 + shift] || "-",
          "Total Sale Quantity": row[14 + shift] || "-",
          "Total Sale Bonus": row[15 + shift] || "-",
          "Sale Value": row[16 + shift] || "-",
          "Purchase Return Quantity": row[17 + shift] || "-",
          "Transfer Out": row[18 + shift] || "-",
          "Transfer In": row[19 + shift] || "-",
          "Closing Balance Quantity": row[20 + shift] || "-",
          "Closing Value": row[21 + shift] || "-",
        };
        break;
      }

      // ===============================
      case "Pharma Link Distributor": {
        result = {
          "Distributor Name": "",
          "Item Description": row[0] || "-",
          Rate: row[1] || "-",
          "Opening Balance Quantity": row[2] || "-",
          "Adjustment Quantity": row[3] || "-",
          "Adjustment Bonus": row[4] || "-",
          "Purchase Quantity": row[5] || "-",
          "Purchase Total Quantity": row[6] || "-",
          "Gross Sale": row[7] || "-",
          "Gross Return": row[8] || "-",
          "Bonus Claim": row[9] || "-",
          "Day Sale": row[10] || "-",
          "Day Sale Value": row[11] || "-",
          "Sale Quantity": row[12] || "-",
          "Sale Value": row[13] || "-",
          "Closing Balance Quantity": row[14] || "-",
          "Closing Value": row[15] || "-",
        };
        break;
      }

      // ===============================
      case "Ali Pharma (Distribution)": {
        result = {
          "Distributor Name": "",
          "Item Description": row[0] || "-",
          Pack: row[1] || "-",
          Rate: row[2] || "-",
          "Opening Balance Quantity": row[3] || "-",
          "Purchase Quantity": row[4] || "-",
          "Purchase Total Quantity": row[5] || "-",
          "Sale Value": row[9] || "-",
          "Sale Bonus": row[7] || "-",
          "Gross Sale": row[6] || "-",
          "Total Sale Quantity": row[8] || "-",
          "Transfer Out": row[12] || "-",
          Expiry: 0,
          "Closing Balance Quantity": row[13] || "-",
          "Closing Value": row[14] || "-",
        };
        break;
      }
      // ===============================

      case "Al-Rehmat Distributors": {
        result = {
          "Distributor Name": "",
          "Item Description": `${row[0] ?? 0} ${row[1] ?? 0}`,
          Pack: row[2] || "-",
          Rate: row[3] || "-",
          "Opening Balance Quantity": row[4] || "-",
          "Purchase Quantity": row[5] || "-",
          "Sale Return": row[6] || "-",
          "Sale Quantity": row[9] || "-",
          "Sale Bonus": row[10] || "-",
          "Transfer Out": row[12] || "-",
          Expiry: 0,
          "Closing Balance Quantity": row[14] || "-",
          "Closing Value": row[15] || "-",
        };
        break;
      }
      // ===============================

      case "Faisal Pharma": {
        result = {
          "Distributor Name": "",
          "Item Description": `${row[0] ?? 0} ${row[1] ?? 0}`,
          Pack: row[2] || "-",
          Rate: row[3] || "-",
          "Opening Balance Quantity": row[4] || "-",
          "Purchase Quantity": row[5] || "-",
          "Purchase Total Quantity": row[6] || "-",
          "Sale Quantity": row[7] || "-",
          "Sale Bonus": row[8] || "-",
          "Net Sale": row[9] || "-",
          "Sale Value": row[10] || "-",
          "Transfer In": row[11] || "-",
          "Transfer Out": row[12] || "-",
          Expiry: 0,
          "Closing Balance Quantity": row[13] || "-",
          "Closing Value": row[14] || "-",
        };
        break;
      }

      // ===============================

      case "Latif & Sons Distributors": {
        result = {
          "Distributor Name": "",
          "Item Description": row[0] || "-",
          Rate: row[1] || "-",
          "Opening Balance Quantity": row[2] || "-",
          "Purchase Quantity": row[3] || "-",
          "Net Sale": row[4] || "-",
          "Sale Value": row[5] || "-",
          "Sale Bonus": row[6] || "-",
          Expiry: 0,
          "Closing Balance Quantity": row[8] || "-",
        };
        break;
      }

      // ===============================

      case "Pharma Page Plus": {
        result = {
          "Distributor Name": "",
          "Item Description": row[0] || "-",
          Pack: row[1] || "-",
          Rate: row[2] || "-",
          "Opening Balance Quantity": row[3] || "-",
          "Purchase Quantity": row[4] || "-",
          "Purchase Return Quantity": row[5] || "-",
          "Sale Quantity": row[6] || "-",
          "Invoice Return": row[7] || "-",
          "Sale Return": row[8] || "-",
          "Net Sale": row[9] || "-",
          "Today Sale": row[10] || "-",
          "Sale Bonus": row[11] || "-",
          Expiry: 0,
          "Closing Balance Quantity": row[13] || "-",
        };
        break;
      }

      // ===============================

      case "Sheryar Distributor": {
        result = {
          "Distributor Name": "",
          "Item Description": row[0] || "",
          Pack: row[1] || "",
          Rate: row[2] || "",
          "Opening Balance Quantity": row[3] || "",
          "Purchase Quantity": row[4] || "",
          "Purchase Total Quantity": row[5] || "",
          "Sale Return": row[6] || "",
          "Net Sale": row[7] || "",
          "Sale Value": row[8] || "",
          "Sale Bonus": row[9] || "",
          Expiry: 0,
          "Closing Balance Quantity": row[11] || "",
        };
        break;
      }

      // ===============================

      case "Umer Brothers": {
        result = {
          "Distributor Name": "",
          "Item Description": `${row[0] ?? 0} ${row[1] ?? 0}`,
          Pack: row[2] || "",
          Rate: row[3] || "",
          "Opening Balance Quantity": row[4] || "",
          "Purchase Quantity": row[5] || "",
          "Purchase Total Quantity": row[6] || "",
          "Net Sale": row[7] || "",
          "Sale Value": row[8] || "",
          "Sale Bonus": row[9] || "",
          Expiry: 0,
          "Closing Balance Quantity": row[12] || "",
        };
        break;
      }

      // ===============================
      default:
        result = {
          "Item Description": row[0] || "",
          Rate: row[1] ?? 0,
          "Opening Balance": join(row[2], row[3]),
          Purchase: join(row[4], row[5]),
          "Purchase Return": join(row[6], row[7]),
          Sale: join(row[10], row[11]),
          Value: row[16] ?? 0,
          "Closing Balance": join(row[19], row[20]),
        };
    }

    // ✅ 5. Inject Dates
    if (distributorsWithDates.includes(distributor)) {
      result["Date From"] = fromDate;
      result["Date To"] = toDate;
    }

    return result;
  });
};
