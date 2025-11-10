import { FaArrowLeft } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/medirep-logo.png";
import { LuDownload } from "react-icons/lu";
import dayjs from "dayjs";
export default function OrderDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { order } = location.state || {};
  console.log("🚀 ~ OrderDetails ~ order:", order);
  const handleBack = () => {
    navigate("/orders");
  };
  return (
    <div>
      {" "}
      <div className="bg-secondary lg:h-[calc(100vh-129px)] h-auto rounded-[12px] py-4 px-6">
        <div className="flex flex-wrap gap-5 justify-between items-start">
          <div className="flex flex-wrap items-center gap-4 ">
            <div
              onClick={handleBack}
              className="w-10 h-10 border-[#7d7d7d] border-[1px] rounded-lg cursor-pointer flex justify-center items-center"
            >
              <FaArrowLeft size={16} color="#000000" />
            </div>
            <p className="text-heading font-medium text-[22px] sm:text-[24px]">
              Order Details
            </p>
          </div>
          <button className="h-[55px] w-full md:w-[220px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center">
            <LuDownload size={20} className="text-white" />
            <p className="text-white text-base font-medium">Download Invoice</p>
          </button>
        </div>
        <div className="bg-[#E5EBF7]  mt-4 rounded-[12px] p-4 2xl:h-[calc(90vh-115px)] lg:h-[calc(90vh-149px)] h-auto ">
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth p-4 md:gap-0 gap-5 bg-white border border-primary rounded-lg 2xl:h-[calc(80vh-40px)] xl:h-[calc(65vh-07px)] overflow-y-auto scrollbar-none"
          >
            <div className="flex items-center ">
              <div className="w-[40%]">
                <img src={logo} className="w-[52px] h-auto" />
              </div>
              <p className="text-heading md:text-[24px] text-[16px] font-medium">
                MediRep Bill Invoice
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center mt-5 border-b border-primary pb-5">
              <div className="lg:w-[calc(50%-4px)] w-full">
                <div className="flex items-center ">
                  <p className="text-[#7d7d7d] text-xs w-[120px]">Order ID:</p>
                  <p className="text-heading text-xs">{order?.orderId}</p>
                </div>
                <div className="flex items-center mt-2">
                  <p className="text-[#7d7d7d] text-xs w-[120px]">
                    Customer Name:
                  </p>
                  <p className="text-heading text-xs">{order?.customerName}</p>
                </div>
                <div className="flex items-center mt-2">
                  <p className="text-[#7d7d7d] text-xs w-[120px]">Address:</p>
                  <p className="text-heading text-xs">{order?.address}</p>
                </div>{" "}
                <div className="flex items-center mt-2">
                  <p className="text-[#7d7d7d] text-xs w-[120px]">
                    Order Date:
                  </p>
                  <p className="text-heading text-xs">
                    {order?.createdAt
                      ? dayjs(order.createdAt).format("DD MMM, YYYY")
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="lg:w-[calc(50%-4px)] w-full">
                <div className="flex items-center">
                  <p className="text-[#7d7d7d] text-xs w-[120px]">MR Name:</p>
                  <p className="text-heading text-xs">{order?.mrName}</p>
                </div>
                <div className="flex items-center mt-2">
                  <p className="text-[#7d7d7d] text-xs w-[120px]">
                    Strategy Name:
                  </p>
                  <p className="text-heading text-xs">{order?.strategyName}</p>
                </div>
                <div className="flex items-center mt-2">
                  <p className="text-[#7d7d7d] text-xs w-[120px]">
                    Order Type:
                  </p>
                  <p className="text-heading text-xs">{order?.orderType}</p>
                </div>
              </div>
            </div>
            <div
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              className="overflow-x-auto overflow-y-hidden w-full touch-pan-x"
            >
              <div className="min-w-[700px]">
                <div className="mt-6 border-y-[1px] border-[#7d7d7d] py-3 flex items-center">
                  <p className="text-heading text-xs min-w-[200px] w-[40%] uppercase">
                    Item Detail
                  </p>
                  <p className="text-heading text-xs min-w-[150px] w-[20%] text-end">
                    Qty
                  </p>
                  <p className="text-heading text-xs min-w-[150px] w-[20%] text-end">
                    Rate
                  </p>
                  <p className="text-heading text-xs min-w-[150px] w-[20%] text-end">
                    Amount
                  </p>
                </div>
                <div className="border-b-[1px] border-[#7d7d7d] w-full py-5">
                  {order?.medicines?.map((med: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center py-1 border-b border-gray-200"
                    >
                      <p className="text-heading font-bold min-w-[200px] text-xs w-[40%] uppercase">
                        {med.name}
                      </p>
                      <p className="text-heading font-bold min-w-[150px] text-xs w-[20%] text-end">
                        {med.quantity}
                      </p>
                      <p className="text-heading font-bold min-w-[150px] text-xs w-[20%] text-end">
                        Rs.{med.rate.toLocaleString()}
                      </p>
                      <p className="text-heading font-bold min-w-[150px] text-xs w-[20%] text-end">
                        Rs.{med.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className=" flex  justify-end mt-5 ">
              <div className="mf:w-1/2 w-full ">
                <div className="flex items-center justify-between ">
                  <p className="text-heading text-xs">Subtotal</p>
                  <p className="text-heading text-xs">Rs.{order?.subtotal}</p>
                </div>{" "}
                <div className="flex mt-4 items-center justify-between pb-2 border-b-[1px] border-[#7d7d7d] ">
                  <p className="text-heading text-xs">Tax (10%)</p>
                  <p className="text-heading text-xs">Rs. {order?.tax}</p>
                </div>{" "}
                <div className="flex mt-4 items-center justify-between ">
                  <p className="text-heading text-xs font-bold">Total</p>
                  <p className="text-heading text-xs font-bold">
                    Rs.{order?.total}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-heading text-sm font-bold mt-5">
              Thank you for your business.
            </p>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
