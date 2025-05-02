
import { CheckCircle } from 'lucide-react';
import AnimatedSection from '../AnimatedSection';
import DocumentCard, { DocumentStatus } from '../DocumentCard';

interface Document {
  id: string;
  name: string;
  description: string;
  status: DocumentStatus;
  required: string[];
  feedback?: string;
}

interface DocumentsGridProps {
  documents: Document[];
  handleDocumentClick: (id: string) => void;
  allApproved: boolean;
  navigateToTrackLoan: () => void;
}

const DocumentsGrid: React.FC<DocumentsGridProps> = ({
  documents,
  handleDocumentClick,
  allApproved,
  navigateToTrackLoan
}) => {
  return (
    <div className="md:col-span-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documents.map((doc, index) => (
          <AnimatedSection key={doc.id} delay={0.1 * index}>
            <DocumentCard 
              title={doc.name}
              description={doc.description}
              status={doc.status}
              onClick={() => handleDocumentClick(doc.id)}
              feedback={doc.feedback}
            />
          </AnimatedSection>
        ))}
      </div>
      
      {allApproved && (
        <AnimatedSection delay={0.3}>
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-5 text-center">
            <div className="flex justify-center mb-3">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-xl font-medium text-green-800 mb-2">All Documents Verified!</h3>
            <p className="text-green-700 mb-4">
              Your documents have been successfully verified. We'll process your loan application now.
            </p>
            <button 
              className="bg-loan-primary hover:bg-loan-button-hover text-white px-6 py-2 rounded-md transition-colors"
              onClick={navigateToTrackLoan}
            >
              Track Application
            </button>
          </div>
        </AnimatedSection>
      )}
    </div>
  );
};

export default DocumentsGrid;
