
import { ArrowLeft, Bot } from 'lucide-react';
import { Button } from '../ui/button';
import AnimatedSection from '../AnimatedSection';

interface DocumentsHeaderProps {
  handleBackClick: () => void;
  setShowCopilot: (show: boolean) => void;
  loanType: string;
  documentsCount: number;
}

const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({
  handleBackClick,
  setShowCopilot,
  loanType,
  documentsCount
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <button 
          onClick={handleBackClick}
          className="flex items-center text-loan-primary hover:text-loan-secondary transition-colors mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to Loan Application</span>
        </button>
        
        <Button
          onClick={() => setShowCopilot(true)}
          variant="outline"
          className="flex items-center justify-center bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 mb-4"
        >
          <Bot size={18} className="mr-2" />
          <span>Need Help?</span>
        </Button>
      </div>
      
      <AnimatedSection>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Verification</h1>
        <p className="text-gray-600">
          Please upload your identity document to verify all {documentsCount} required documents for your {loanType} loan application.
        </p>
      </AnimatedSection>
    </div>
  );
};

export default DocumentsHeader;
