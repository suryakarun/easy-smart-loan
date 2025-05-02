
import { useState } from 'react';
import { X, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import AnimatedSection from './AnimatedSection';
import FileUploader from './documentVerifiers/FileUploader';
import { Button } from './ui/button';
import { verifyDocumentWithOpenAI } from '../services/openAiVerificationService';

interface SingleIdentityVerifierProps {
  onClose: () => void;
  onVerificationComplete: (results: { [key: string]: { isValid: boolean; feedback: string } }) => void;
  documents: Array<{
    id: string;
    name: string;
  }>;
}

const SingleIdentityVerifier: React.FC<SingleIdentityVerifierProps> = ({
  onClose,
  onVerificationComplete,
  documents
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [verificationResults, setVerificationResults] = useState<Record<string, { isValid: boolean; feedback: string }>>({});
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Invalid file type. Please upload PDF, JPG or PNG files only.');
        return;
      }
      
      // Check file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File is too large. Maximum size is 5MB.');
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview URL for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // For PDFs, just show icon
        setPreviewUrl(null);
      }
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
  };
  
  const handleVerification = async () => {
    if (!file) {
      toast.error('Please upload your identity document first.');
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsUploading(false);
    setIsVerifying(true);
    setVerificationStep(0);
    
    // First, identify what document type was uploaded
    let uploadedDocumentType = '';
    let uploadedDocumentDetails: any = null;
    
    if (previewUrl) {
      try {
        // Use OpenAI to identify the document type
        const openAiResult = await verifyDocumentWithOpenAI(previewUrl, 'identity');
        
        if (openAiResult.extractedData && openAiResult.extractedData.documentType) {
          uploadedDocumentType = openAiResult.extractedData.documentType.toLowerCase();
          uploadedDocumentDetails = openAiResult.extractedData;
          console.log('Identified document type:', uploadedDocumentType);
        } else {
          toast.error('Unable to identify the document type. Please upload a clearer image.');
          setIsVerifying(false);
          return;
        }
      } catch (error) {
        console.error('Error identifying document:', error);
        toast.error('Error identifying document. Please try again.');
        setIsVerifying(false);
        return;
      }
    } else {
      toast.error('No document preview available. Please try uploading again.');
      setIsVerifying(false);
      return;
    }
    
    // Process each required document and check if it can be verified with the uploaded identity
    const documentResults: { [key: string]: { isValid: boolean; feedback: string } } = {};
    const totalDocuments = documents.length;
    
    for (let i = 0; i < totalDocuments; i++) {
      const doc = documents[i];
      setVerificationStep(i + 1);
      setVerificationProgress(Math.round(((i + 1) / totalDocuments) * 100));
      
      // Add a small delay to make the verification process visible
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if the document matches the uploaded identity document
      if (doc.id.toLowerCase() === uploadedDocumentType) {
        documentResults[doc.id] = {
          isValid: true,
          feedback: `${doc.name} verified successfully. Document type matches.`
        };
      } else {
        // For Pan Card, only accept Pan Card
        if (doc.id === 'pan' && uploadedDocumentType !== 'pan') {
          documentResults[doc.id] = {
            isValid: false,
            feedback: `${doc.name} verification failed. You uploaded a ${uploadedDocumentType.toUpperCase()} but we need a PAN Card.`
          };
        }
        // For Aadhar Card, only accept Aadhar Card
        else if (doc.id === 'aadhar' && uploadedDocumentType !== 'aadhar') {
          documentResults[doc.id] = {
            isValid: false,
            feedback: `${doc.name} verification failed. You uploaded a ${uploadedDocumentType.toUpperCase()} but we need an Aadhar Card.`
          };
        }
        // For other documents, check if they can be inferred from the identity document
        else {
          // In a real system, we might be able to infer certain documents from others
          // For now, we'll mark them as not verified
          documentResults[doc.id] = {
            isValid: false,
            feedback: `${doc.name} verification failed. The uploaded document type (${uploadedDocumentType.toUpperCase()}) doesn't match required document.`
          };
        }
      }
      
      // Update verification results in real-time
      setVerificationResults({...documentResults});
    }
    
    // Verification complete for all documents
    setIsVerifying(false);
    
    // Return all document verification results
    onVerificationComplete(documentResults);
    
    // Show appropriate toast message
    const anyVerified = Object.values(documentResults).some(result => result.isValid);
    if (anyVerified) {
      toast.success(`Successfully verified your ${uploadedDocumentType.toUpperCase()} document!`);
    } else {
      toast.error('No documents could be verified with your uploaded identity. Please upload the correct document types.');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <AnimatedSection className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Single Identity Verification</h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600"
              disabled={isUploading || isVerifying}
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Upload your identity document to verify the corresponding document requirement. Each document type will only be accepted for its matching requirement.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-blue-800 mb-2">Important Information</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Each document type is verified separately</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Aadhar Card will only be accepted for Aadhar verification</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>PAN Card will only be accepted for PAN verification</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Make sure your document is clear and readable</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-yellow-800 mb-2">Accepted Identity Documents</h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Aadhar Card - for Aadhar verification</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>PAN Card - for PAN verification</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Passport - for Address/Identity verification</span>
                </li>
              </ul>
            </div>
            
            <FileUploader 
              file={file}
              previewUrl={previewUrl}
              isUploading={isUploading}
              isVerifying={isVerifying}
              isModelLoading={false}
              handleFileChange={handleFileChange}
              handleRemoveFile={handleRemoveFile}
            />
            
            {isVerifying && (
              <div className="mt-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Verifying documents ({verificationStep}/{documents.length})</span>
                  <span className="text-sm font-medium">{verificationProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-loan-primary h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${verificationProgress}%` }}
                  ></div>
                </div>
                <div className="mt-4 space-y-3">
                  {documents.slice(0, verificationStep).map((doc, index) => {
                    const result = verificationResults[doc.id];
                    return (
                      <div key={doc.id} className="flex items-center">
                        {index < verificationStep - 1 ? (
                          result?.isValid ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                          )
                        ) : (
                          <Loader className="animate-spin h-5 w-5 mr-2 text-loan-primary" />
                        )}
                        <span className="text-sm">{doc.name}</span>
                        {index < verificationStep - 1 && result && (
                          <span className={`ml-2 text-xs ${result.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-1.5 py-0.5 rounded`}>
                            {result.isValid ? 'Verified' : 'Failed'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isUploading || isVerifying}
              className="mx-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerification}
              disabled={!file || isUploading || isVerifying}
              className="bg-loan-primary text-white hover:bg-loan-button-hover disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
            >
              {isUploading ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Uploading...
                </>
              ) : isVerifying ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Verifying...
                </>
              ) : (
                'Verify Document'
              )}
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default SingleIdentityVerifier;
