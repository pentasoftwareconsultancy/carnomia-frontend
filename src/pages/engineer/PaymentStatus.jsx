import { useLocation } from "react-router-dom";
import PaymentManagement from "../admin/PaymentManagement";

const PaymentStatus = () => {
  const query = new URLSearchParams(useLocation().search);
  const isAdm = query.get("isAdm") === "true"; // true if URL has ?isAdm=true

  return <PaymentManagement isAdmin={isAdm} />;
};

export default PaymentStatus;
