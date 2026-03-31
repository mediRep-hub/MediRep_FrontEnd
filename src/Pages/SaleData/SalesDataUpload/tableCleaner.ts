const skipKeywords = [
  // "powered by",
  // "item description",
  // "print",
  // "page",
  // "version",   
  // "company",
  "group.",
  // "street" ,
  // "From:",
  // "Quirky",
  // "gyne & peads",
  // "sale and stock report",
  // "Brains",
  // "www.",                                     
  // "include blocked items",
  // "rate type",
  // "Include,",
  // "Report",
  // "zero sales",
  // "sort by",
  // "total for group",
  // "report total",
  // "opening",
  // "sale",
  // "closing",
  // "today",
  // "balance",
  // "group",
  // "default",
  // "WIMITS",
  // "Road",
  // "#:",
  // "Software",
  // "enterprises",
  "Grand",
//   "/",
  // "558843",
  // "944833",
  // "19444",
  // "6625235",
  // "22095196",
  // "1636800",
  // "6308825",
  // "4672025",
  // "28404021",
  // "Company:",
  // "haji baba road",
  // "mingora swat",
  // "fax #",
  // "ph #",
  // "e-mail:",
  // "By:",
  // "ABDULLAH",
  // "Al-Fateh",
  // "From",  
  // "alliedenterprisesswat@yahoo.com",
  // "allied",
  //  "description",
  //  "Items:",
  //  "Qamar",
  //  "15450518",
  //  "Group:",
  // "price",
  // "qty",
  // "Date:",
  // "PEADS",
  // "Genral",
  // "bon",
  // "value",
  // "in",
  // "out",
  // "current",
  // "DRUG",
  // "total",
  // "active brains software",
  // "company wise",
  // "Haq"
];

export const cleanTableData = (rawData: any[][]) => {
  const keywords = skipKeywords.map(k => k.toLowerCase());

  return rawData.filter((row) => {
    if (!row || row.length === 0) return false;

    const words = row
      .join(" ")
      .toLowerCase()
      .split(/\s+/)       // words me split

    const matched = words.find(word => keywords.includes(word));

    if (matched) {
      // console.log("⚠️ Keyword:", matched);
      return false;
    }

    return true;
  });
};