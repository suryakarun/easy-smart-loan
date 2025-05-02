
import { useState } from 'react';
import { Check } from 'lucide-react';

export type LoanType = 'personal' | 'home' | 'vehicle' | 'education' | 'business';

interface LoanTypeSelectorProps {
  selectedType: LoanType;
  onChange: (type: LoanType) => void;
}

const loanTypes: { id: LoanType; name: string; description: string }[] = [
  { id: 'personal', name: 'Personal Loan', description: 'Quick funding for personal needs' },
  { id: 'home', name: 'Home Loan', description: 'Finance your dream home' },
  { id: 'vehicle', name: 'Vehicle Loan', description: 'Car, bike, or other vehicle financing' },
  { id: 'education', name: 'Education Loan', description: 'Invest in your education journey' },
  { id: 'business', name: 'Business Loan', description: 'Grow your business with needed capital' },
];

const LoanTypeSelector: React.FC<LoanTypeSelectorProps> = ({ selectedType, onChange }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium mb-4">Select Loan Type</h3>
      <div className="space-y-3">
        {loanTypes.map((type) => (
          <div
            key={type.id}
            className={`flex items-center p-4 rounded-lg border ${
              selectedType === type.id
                ? 'border-loan-primary bg-blue-50'
                : 'border-gray-200 hover:border-loan-primary hover:bg-blue-50'
            } cursor-pointer transition-colors`}
            onClick={() => onChange(type.id)}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
              selectedType === type.id ? 'bg-loan-primary text-white' : 'border border-gray-300'
            }`}>
              {selectedType === type.id && <Check className="w-3 h-3" />}
            </div>
            <div>
              <h4 className="font-medium">{type.name}</h4>
              <p className="text-sm text-gray-600">{type.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanTypeSelector;
