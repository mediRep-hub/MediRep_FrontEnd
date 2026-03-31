const typeA = {
  "Distributor Name": "",
  "Item Description": "",
  Rate: 0,
  Pack: "",
  "Opening Balance Quantity": 0,
  "Opening Balance Value": 0,
  "Purchase Quantity": 0,
  "Purchase Value": 0,
  "Purchase Bonus": 0,
  "Purchase Return Quantity": 0,
  "Purchase Bonus Return": 0,
  "Purchase Total Quantity": 0,
  "Purchase Total Bonus": 0,
  "Bonus Claim": 0,
  "Sale Quantity": 0,
  "Sale Bonus": 0,
  "Net Sale":0,
  "Sale Return": 0,
  "Sale Bonus Return": 0,
  "Total Sale Qnatity": 0,
  "Total Sale Bonus": 0,
  "Sale Value": 0,
  "Invoice Return" : 0,
  Expiry: 0,
  "Adjustment Quantity": 0, 
  "Adjustment Bonus": 0,
  "Gross Sale":0,
  "Transfer In": 0,
  "Transfer Out": 0,
  "Avaialbility Current": 0,
  "Avaialbility Total": 0,
  "Closing Balance Quantity": 0,
  "Closing Balance Bonus": 0,
  "Closing Value": 0,
  "Today Sale": 0,
  "Today Return": 0,
  "To Date Sale": 0,
  "To Date Return": 0,
  "Day Sale":0,
  "Day Sale Value":0,
  "Month":null
};

export const getHeadersByDistributor = (distributor: string, data: any[]) => {
  const baseHeaders: any = { ...typeA };

  if (!data || data.length === 0) return baseHeaders;

  // first row se keys uthao
  const validKeys = Object.keys(data[0]);

  // sirf woh headers rakho jo data me exist karte hain
  const filteredHeaders: any = {};

  Object.keys(baseHeaders).forEach((key) => {
    if (validKeys.includes(key)) {
      filteredHeaders[key] = baseHeaders[key];
    }
  });

  return filteredHeaders;
};
