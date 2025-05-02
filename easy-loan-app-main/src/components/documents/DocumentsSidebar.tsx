
import AnimatedSection from '../AnimatedSection';
import DocumentTracker from '../DocumentTracker';
import { DocumentStatus } from '../DocumentCard';

interface Document {
  id: string;
  name: string;
  status: DocumentStatus;
  feedback?: string;
}

interface DocumentsSidebarProps {
  documents: Document[];
  allPending: boolean;
  allApproved: boolean;
  navigateToTrackLoan: () => void;
}

const DocumentsSidebar: React.FC<DocumentsSidebarProps> = ({
  documents,
  allPending,
  allApproved,
  navigateToTrackLoan
}) => {
  return (
    <div>
      <AnimatedSection delay={0.2}>
        <DocumentTracker 
          documents={documents} 
          useSingleVerification={allPending}
        />
        
        <div className="mt-6 bg-loan-accent rounded-lg p-5 border border-blue-200">
          <h3 className="font-medium mb-3">Document Guidelines</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex">
              <span className="mr-2">•</span>
              <span>Use a government-issued identity document</span>
            </li>
            <li className="flex">
              <span className="mr-2">•</span>
              <span>Maximum file size: 5MB per document</span>
            </li>
            <li className="flex">
              <span className="mr-2">•</span>
              <span>Supported formats: PDF, JPG, PNG</span>
            </li>
            <li className="flex">
              <span className="mr-2">•</span>
              <span>Document should be clear and uncropped</span>
            </li>
          </ul>
        </div>
        
        <div className="mt-6">
          <button 
            className="w-full bg-loan-primary hover:bg-loan-button-hover text-white px-6 py-3 rounded-md transition-colors flex items-center justify-center"
            onClick={navigateToTrackLoan}
            disabled={!allApproved}
          >
            <span>Track Application</span>
          </button>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default DocumentsSidebar;
