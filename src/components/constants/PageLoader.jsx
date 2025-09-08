import React from "react";
import { motion } from "framer-motion";

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <motion.div
        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
};

export default PageLoader;
