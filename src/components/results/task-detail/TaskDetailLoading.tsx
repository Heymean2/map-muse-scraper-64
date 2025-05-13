
import { motion } from "framer-motion";

export default function TaskDetailLoading() {
  return (
    <motion.div 
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto px-4 py-12 flex justify-center"
    >
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
        <div className="mt-4 text-center text-indigo-600 font-medium">Loading Results</div>
      </div>
    </motion.div>
  );
}
