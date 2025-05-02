import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import { DocumentStatus } from '../components/DocumentCard';
import AnimatedSection from '../components/AnimatedSection';
import { LoanFormData } from '../components/LoanForm';
import DocumentVerifier from '../components/DocumentVerifier';
import SingleIdentityVerifier from '../components/SingleIdentityVerifier';
import DocumentsHeader from '../components/documents/DocumentsHeader';
import SingleVerificationPrompt from '../components/documents/SingleVerificationPrompt';
import DocumentsGrid from '../components/documents/DocumentsGrid';
import DocumentsSidebar from '../components/documents/DocumentsSidebar';
import CopilotDialog from '../components/documents/CopilotDialog';

interface Document {
  id: string;
  name: string;
  description: string;
  status: DocumentStatus;
  required: string[];
  feedback?: string;
}

const Documents = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocument, setActiveDocument] = useState<string | null>(null);
  const [verifierOpen, setVerifierOpen] = useState(false);
  const [singleVerifierOpen, setSingleVerifierOpen] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  
  const loanData = location.state?.loanData as LoanFormData || {
    loanType: 'personal',
    loanAmount: 100000,
    loanTerm: 12
  };
  
  useEffect(() => {
    const storedDocuments = localStorage.getItem('easyLoanDocuments');
    
    if (storedDocuments) {
      setDocuments(JSON.parse(storedDocuments));
    } else {
      initializeDocuments();
    }
  }, [loanData.loanType]);
  
  useEffect(() => {
    if (documents.length > 0) {
      localStorage.setItem('easyLoanDocuments', JSON.stringify(documents));
    }
  }, [documents]);
  
  const initializeDocuments = () => {
    const getRequiredDocuments = () => {
      const commonDocuments = [
        {
          id: 'aadhar',
          name: 'Aadhar Card',
          description: 'Valid Aadhar Card with clear photo and details',
          status: 'pending' as DocumentStatus,
          required: ['personal', 'home', 'vehicle', 'education', 'business']
        },
        {
          id: 'pan',
          name: 'PAN Card',
          description: 'Valid PAN Card linked to your Aadhar',
          status: 'pending' as DocumentStatus,
          required: ['personal', 'home', 'vehicle', 'education', 'business']
        },
        {
          id: 'income',
          name: 'Income Proof',
          description: 'Salary Slips, Form 16, or Bank Statements',
          status: 'pending' as DocumentStatus,
          required: ['personal', 'home', 'vehicle', 'education', 'business']
        },
        {
          id: 'bank',
          name: 'Bank Statements',
          description: 'Last 6 months bank statements',
          status: 'pending' as DocumentStatus,
          required: ['personal', 'home', 'vehicle', 'education', 'business']
        },
        {
          id: 'photo',
          name: 'Recent Photograph',
          description: 'Passport size photograph (not older than 3 months)',
          status: 'pending' as DocumentStatus,
          required: ['personal', 'home', 'vehicle', 'education', 'business']
        },
        {
          id: 'address',
          name: 'Address Proof',
          description: 'Utility Bills, Rental Agreement, or Passport',
          status: 'pending' as DocumentStatus,
          required: ['personal', 'home', 'vehicle', 'education', 'business']
        },
        {
          id: 'signature',
          name: 'Signature Verification',
          description: 'Signed declaration on bank\'s format',
          status: 'pending' as DocumentStatus,
          required: ['personal', 'home', 'vehicle', 'education', 'business']
        }
      ];
      
      const additionalDocuments: Document[] = [];
      
      switch (loanData.loanType) {
        case 'home':
          additionalDocuments.push(
            {
              id: 'property',
              name: 'Property Documents',
              description: 'Sale Deed, Property Registration, Tax Receipts',
              status: 'pending',
              required: ['home']
            },
            {
              id: 'estimation',
              name: 'Cost Estimation',
              description: 'Builder\'s Estimate or Purchase Agreement',
              status: 'pending',
              required: ['home']
            }
          );
          break;
        case 'vehicle':
          additionalDocuments.push(
            {
              id: 'vehicle-details',
              name: 'Vehicle Details',
              description: 'Quotation from Dealer, Vehicle Specifications',
              status: 'pending',
              required: ['vehicle']
            },
            {
              id: 'driving-license',
              name: 'Driving License',
              description: 'Valid Driving License',
              status: 'pending',
              required: ['vehicle']
            }
          );
          break;
        case 'education':
          additionalDocuments.push(
            {
              id: 'admission-letter',
              name: 'Admission Letter',
              description: 'Admission Confirmation from Institution',
              status: 'pending',
              required: ['education']
            },
            {
              id: 'course-details',
              name: 'Course Details',
              description: 'Course Duration, Fee Structure',
              status: 'pending',
              required: ['education']
            }
          );
          break;
        case 'business':
          additionalDocuments.push(
            {
              id: 'business-proof',
              name: 'Business Registration',
              description: 'GST Registration, Shop Act License, etc.',
              status: 'pending',
              required: ['business']
            },
            {
              id: 'financial-statements',
              name: 'Financial Statements',
              description: 'Balance Sheet, Profit & Loss Statement',
              status: 'pending',
              required: ['business']
            },
            {
              id: 'business-plan',
              name: 'Business Plan',
              description: 'Detailed Business Plan for Loan Utilization',
              status: 'pending',
              required: ['business']
            }
          );
          break;
      }
      
      return [...commonDocuments, ...additionalDocuments].filter(
        doc => doc.required.includes(loanData.loanType)
      );
    };
    
    setDocuments(getRequiredDocuments());
  };
  
  const handleDocumentClick = (id: string) => {
    if (documents.every(doc => doc.status === 'pending')) {
      setSingleVerifierOpen(true);
    } else {
      setActiveDocument(id);
      setVerifierOpen(true);
    }
  };
  
  const handleVerificationResult = (result: {isValid: boolean; feedback?: string}) => {
    setVerifierOpen(false);
    
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === activeDocument 
          ? { 
              ...doc, 
              status: result.isValid ? 'approved' : 'attention',
              feedback: result.feedback
            } 
          : doc
      )
    );
    
    if (result.isValid) {
      toast.success('Document verified successfully!');
    } else {
      toast.error('Document verification failed. Please check feedback and try again.');
    }
    
    setActiveDocument(null);
  };
  
  const handleSingleVerificationResult = (results: { [key: string]: { isValid: boolean; feedback: string } }) => {
    setSingleVerifierOpen(false);
    
    setDocuments(docs => 
      docs.map(doc => ({
        ...doc,
        status: results[doc.id]?.isValid ? 'approved' : 'attention',
        feedback: results[doc.id]?.feedback
      }))
    );
  };
  
  const handleSingleVerificationClick = () => {
    setSingleVerifierOpen(true);
  };
  
  const handleBackClick = () => {
    navigate('/new-loan');
  };
  
  const navigateToTrackLoan = () => {
    navigate('/track-loan');
  };
  
  const allApproved = documents.every(doc => doc.status === 'approved');
  const allPending = documents.every(doc => doc.status === 'pending');
  
  const activeDocumentInfo = activeDocument 
    ? documents.find(doc => doc.id === activeDocument) 
    : null;
  
  const copilotContext = activeDocumentInfo ? activeDocumentInfo.id : 'documents';
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        <DocumentsHeader 
          handleBackClick={handleBackClick}
          setShowCopilot={setShowCopilot}
          loanType={loanData.loanType}
          documentsCount={documents.length}
        />
        
        {allPending && (
          <SingleVerificationPrompt handleSingleVerificationClick={handleSingleVerificationClick} />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {documents.length > 0 ? (
            <>
              <DocumentsGrid 
                documents={documents}
                handleDocumentClick={handleDocumentClick}
                allApproved={allApproved}
                navigateToTrackLoan={navigateToTrackLoan}
              />
              
              <DocumentsSidebar 
                documents={documents}
                allPending={allPending}
                allApproved={allApproved}
                navigateToTrackLoan={navigateToTrackLoan}
              />
            </>
          ) : (
            <div className="col-span-3 text-center py-8">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
              <p className="text-gray-700">There was an error loading documents. Please refresh.</p>
            </div>
          )}
        </div>
      </div>
      
      {verifierOpen && activeDocumentInfo && (
        <DocumentVerifier 
          documentType={activeDocumentInfo.id} 
          documentName={activeDocumentInfo.name}
          onClose={() => {
            setVerifierOpen(false);
            setActiveDocument(null);
          }}
          onVerificationComplete={handleVerificationResult}
        />
      )}
      
      {singleVerifierOpen && (
        <SingleIdentityVerifier 
          onClose={() => setSingleVerifierOpen(false)}
          onVerificationComplete={handleSingleVerificationResult}
          documents={documents}
        />
      )}
      
      <CopilotDialog 
        showCopilot={showCopilot}
        setShowCopilot={setShowCopilot}
        context={copilotContext}
      />
    </div>
  );
};

export default Documents;
