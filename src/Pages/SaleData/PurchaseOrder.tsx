import { FaEye } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { RiArrowDropDownLine } from "react-icons/ri";

export default function AddPurchaseOrder() {
  return (
    <div className="p-3 sm:p-4 bg-[#F7F9FC]">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-[16px] sm:text-[24px]">Add Purchase Order</h2>
        <button className="bg-[#0B5ED7] text-white px-4 sm:px-6 py-3 rounded-md text-sm w-full sm:w-auto">
          Generate
        </button>
      </div>

      <div className="bg-[#EDF3FF] p-3 sm:p-4 rounded-lg">
        <p className="text-sm mb-2">Products List</p>

        <div className="bg-white border border-[#0755E9] rounded-lg overflow-x-auto">
          <table className="w-[900px] lg:w-full text-[12px] sm:text-[13px]">
            <thead className="text-[12px] sm:text-[14px] text-black border-b border-[#0755E9]">
              <tr>
                <th className="p-2 sm:p-4 text-left">Product SKU</th>
                <th className="p-2 sm:p-4 text-left" colSpan={2}>
                  Product Name
                </th>
                <th className="p-2 sm:p-4 text-left">Category</th>
                <th className="p-2 sm:p-4 text-left">Form</th>
                <th className="p-2 sm:p-4 text-left">Image</th>
                <th className="p-2 sm:p-4 text-left">Quantity</th>
                <th className="p-2 sm:p-4 text-left">Pack</th>
                <th className="p-2 sm:p-4 text-left">Amount</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b border-[#0755E9]">
                <td className="p-2 sm:p-3">#00108</td>

                <td className="p-2 sm:p-3" colSpan={2}>
                  Neurobal Baby Soap - 100 gm
                </td>

                <td className="p-2 sm:p-3">Cardiology</td>
                <td className="p-2 sm:p-3">Tablet</td>

                <td className="p-2 sm:p-3">
                  <div className="flex items-center gap-1 text-gray-600 cursor-pointer">
                    <FaEye className="text-[13px]" />
                    <span className="hidden sm:inline">View</span>
                  </div>
                </td>

                <td className="p-2 sm:p-3">
                  <input
                    type="number"
                    defaultValue={8}
                    className="border rounded w-14 sm:w-20 h-6 text-center text-xs sm:text-sm"
                  />
                </td>

                <td className="p-2 sm:p-3">
                  <input
                    type="number"
                    defaultValue={0}
                    className="border rounded w-14 sm:w-20 h-6 text-center text-xs sm:text-sm"
                  />
                </td> 

                <td className="p-2 sm:p-3">Rs 7,392</td>
              </tr>

              <tr className="border-b border-[#0755E9]">
                <td colSpan={9} className="p-3">
                  <div className="relative w-full sm:w-[260px]">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7D7D7D]">
                      <CiSearch size={16} />
                    </span>

                    <input
                      type="text"
                      placeholder="SKU/Product Name"
                      className="w-full h-9 pl-9 pr-9 border border-[#7D7D7D] rounded-md text-sm"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7D7D7D]">
                      <RiArrowDropDownLine size={18} />
                    </span>
                  </div>
                </td>
              </tr>

              <tr>
                <td colSpan={10} className="h-[160px]" />
              </tr>
            </tbody>

            <tfoot>
              <tr className="border-t border-[#0755E9] bg-[#F7F9FC] text-sm">
                <td className="p-2 sm:p-3">Total</td>
                <td colSpan={5}></td>
                <td className="p-2 sm:p-3">08</td>
                <td className="p-2 sm:p-3">-</td>
                <td className="p-2 sm:p-3">Rs 7,392</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
