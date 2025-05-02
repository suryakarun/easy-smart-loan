
import { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { env } from '@huggingface/transformers';
import AnimatedSection from './AnimatedSection';
import FileUploader from './documentVerifiers/FileUploader';
import VerificationInfo, { VerificationProcess } from './documentVerifiers/VerificationInfo';
import { verifyPhotoDocument } from './documentVerifiers/PhotoVerifier';
import { verifyAadharDocument } from './documentVerifiers/AadharVerifier';
import { verifyGenericDocument } from './documentVerifiers/GenericVerifier';
import { loadVerificationModels } from '../services/documentVerificationService';
import CopilotButton from './documentVerifiers/CopilotButton';

interface DocumentVerifierProps {
  documentType: string;
  documentName: string;
  onClose: () => void;
  onVerificationComplete: (result: { isValid: boolean; feedback: string }) => void;
}

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = false;

const DocumentVerifier: React.FC<DocumentVerifierProps> = ({
  documentType,
  documentName,
  onClose,
  onVerificationComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  
  // Load models based on document type
  useEffect(() => {
    const initializeModels = async () => {
      try {
        setIsModelLoading(true);
        await loadVerificationModels(documentType);
      } catch (error) {
        console.error('Failed to load models:', error);
        toast.error('Could not load verification models. Basic validation will be used instead.');
      } finally {
        setIsModelLoading(false);
      }
    };
    
    initializeModels();
  }, [documentType]);
  
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
  
  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first.');
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsUploading(false);
    setIsVerifying(true);
    
    // Document verification logic - perform actual validation
    let verificationResult = { 
      isValid: false,
      feedback: `Unable to verify ${documentName}. Please try again.`
    };
    
    try {
      console.log(`Verifying document type: ${documentType}`);
      
      // Perform different verification based on document type
      if (documentType === 'photo') {
        const photoResult = await verifyPhotoDocument(file, previewUrl || '');
        verificationResult = {
          isValid: photoResult.isValid,
          feedback: photoResult.feedback || `Photo verification ${photoResult.isValid ? 'successful' : 'failed'}. ${photoResult.isValid ? '' : 'Please ensure your photo is clear and properly lit.'}`
        };
      } else if (documentType === 'aadhar') {
        const aadharResult = await verifyAadharDocument(file, previewUrl);
        verificationResult = {
          isValid: aadharResult.isValid,
          feedback: aadharResult.feedback || `Aadhar verification ${aadharResult.isValid ? 'successful' : 'failed'}. ${aadharResult.isValid ? '' : 'Please ensure your Aadhar card is authentic and clearly visible.'}`
        };
      } else {
        const genericResult = await verifyGenericDocument(file, documentType, previewUrl || undefined);
        verificationResult = {
          isValid: genericResult.isValid,
          feedback: genericResult.feedback || `${documentType} verification ${genericResult.isValid ? 'successful' : 'failed'}. ${genericResult.isValid ? '' : 'Please check the document and try again.'}`
        };
      }
      
      console.log('Verification result:', verificationResult);
    } catch (error) {
      console.error('Verification error:', error);
      verificationResult = {
        isValid: false,
        feedback: `Error verifying ${documentName}. Please try a different file.`
      };
    }
    
    // Add delay to make verification feel more natural
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsVerifying(false);
    onVerificationComplete(verificationResult);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <AnimatedSection className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Upload {documentName}</h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600"
              disabled={isUploading || isVerifying}
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">Please upload a clear, legible copy of your {documentName}.</p>
            
            <VerificationInfo documentType={documentType} />
            
            <FileUploader 
              file={file}
              previewUrl={previewUrl}
              isUploading={isUploading}
              isVerifying={isVerifying}
              isModelLoading={isModelLoading}
              handleFileChange={handleFileChange}
              handleRemoveFile={handleRemoveFile}
            />
          </div>
          
          <div className="flex justify-end">
            <CopilotButton documentType={documentType} documentName={documentName} />
            <button
              onClick={onClose}
              className="px-4 py-2 mx-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={isUploading || isVerifying}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || isUploading || isVerifying || isModelLoading}
              className="px-4 py-2 bg-loan-primary text-white rounded-lg hover:bg-loan-button-hover disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
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
            </button>
          </div>
          
          <VerificationProcess isVerifying={isVerifying} />
        </div>
      </AnimatedSection>
    </div>
  );
};

export default DocumentVerifier;
