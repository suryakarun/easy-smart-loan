
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import LoanTypeSelector, { LoanType } from './LoanTypeSelector';

interface LoanFormProps {
  onSubmit: (data: LoanFormData) => void;
}

export interface LoanFormData {
  loanType: LoanType;
  loanAmount: number;
  loanTerm: number;
}

const LoanForm: React.FC<LoanFormProps> = ({ onSubmit }) => {
  const [loanType, setLoanType] = useState<LoanType>('personal');
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [loanTerm, setLoanTerm] = useState<number>(12);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLoanAmount(value);
  };
  
  const handleTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLoanTerm(value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      loanType,
      loanAmount,
      loanTerm
    });
  };
  
  // Get min/max values based on loan type
  const getLoanRange = () => {
    switch (loanType) {
      case 'personal':
        return { min: 10000, max: 1000000, step: 10000 };
      case 'home':
        return { min: 500000, max: 10000000, step: 100000 };
      case 'vehicle':
        return { min: 100000, max: 5000000, step: 50000 };
      case 'education':
        return { min: 50000, max: 2000000, step: 50000 };
      case 'business':
        return { min: 200000, max: 5000000, step: 100000 };
      default:
        return { min: 10000, max: 1000000, step: 10000 };
    }
  };
  
  const loanRange = getLoanRange();
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <LoanTypeSelector selectedType={loanType} onChange={setLoanType} />
      
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-medium mb-4">
            Loan Amount (₹)
          </label>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">₹{loanRange.min.toLocaleString()}</span>
              <span className="text-sm text-gray-500">₹{loanRange.max.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={loanRange.min}
              max={loanRange.max}
              step={loanRange.step}
              value={loanAmount}
              onChange={handleAmountChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-loan-primary"
            />
            <div className="bg-loan-primary bg-opacity-10 rounded-md p-3 border border-loan-accent mt-2">
              <span className="text-xl font-semibold text-loan-primary">₹{loanAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-lg font-medium mb-4">
            Loan Term (months)
          </label>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">6 months</span>
              <span className="text-sm text-gray-500">60 months</span>
            </div>
            <input
              type="range"
              min={6}
              max={60}
              step={6}
              value={loanTerm}
              onChange={handleTermChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-loan-primary"
            />
            <div className="bg-loan-primary bg-opacity-10 rounded-md p-3 border border-loan-accent mt-2">
              <span className="text-xl font-semibold text-loan-primary">{loanTerm} months</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          className="w-full flex items-center justify-center bg-loan-primary hover:bg-loan-button-hover text-white py-3 px-8 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-loan-primary focus:ring-opacity-50"
        >
          <span className="mr-2">Continue Application</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
};

export default LoanForm;
