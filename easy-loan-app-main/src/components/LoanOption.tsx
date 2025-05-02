
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LoanOptionProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const LoanOption: React.FC<LoanOptionProps> = ({ icon, title, description, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="loan-button w-full bg-white rounded-xl p-6 shadow-sm hover:shadow-md border border-loan-border transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-loan-accent text-loan-primary">
          {icon}
        </div>
        <h3 className="font-semibold text-xl mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </motion.div>
  );
};

export default LoanOption;
