import React, { useEffect, useRef } from "react";
import WebDataRocks from "webdatarocks";
import "webdatarocks/webdatarocks.min.css";
import "webdatarocks/theme/Teal/webdatarocks.min.css";
import "./WebDataRocksCustom.css";
interface WebDataRocksGridProps {
  titles: string[];
  tableData: any[][];
  height?: string | number;
}

const WebDataRocksGrid: React.FC<WebDataRocksGridProps> = ({
  titles,
  tableData,
  height = 500,
}) => {
  const pivotRef = useRef<any>(null);
  const formattedData = tableData.map((row) => {
    const obj: any = {};
    titles.forEach((title, index) => {
      obj[title] =
        typeof row[index] === "object" && row[index]?.type
          ? "Action"
          : row[index];
    });
    return obj;
  });
  useEffect(() => {
    if (pivotRef.current) return;
    pivotRef.current = new WebDataRocks({
      container: "#webdatarocks-container",
      toolbar: true,
      height: height,
      report: {
        dataSource: { data: formattedData },
        options: { grid: { type: "flat" } },
      },
    });
  }, []);
  return <div id="webdatarocks-container" style={{ width: "100%" }}></div>;
};

export default WebDataRocksGrid;
