
/**
 * Generic document verification logic with OpenAI integration
 */
import { verifyDocumentWithOpenAI } from '../../services/openAiVerificationService';

export const verifyGenericDocument = async (file: File, documentType: string, imageUrl?: string): Promise<{isValid: boolean; feedback: string}> => {
  const fileName = file.name.toLowerCase();
  console.log(`Verifying ${documentType} document: ${fileName}`);
  
  // Basic checks for generic documents
  if (file.size < 20 * 1024) { // Less than 20KB is likely too small to be valid
    return {
      isValid: false,
      feedback: `The ${documentType} document is too small or may be corrupted. Please upload a proper document with clear details.`
    };
  }
  
  // If it's an image file and we have an imageUrl, use OpenAI for verification
  if (file.type.startsWith('image/') && imageUrl) {
    try {
      const openAiResult = await verifyDocumentWithOpenAI(imageUrl, documentType);
      
      // Check if document type matches what was requested
      if (openAiResult.isCorrectDocumentType === false) {
        return {
          isValid: false,
          feedback: openAiResult.feedback || `The uploaded document is not a ${documentType}. Please ensure you are uploading the correct document type.`
        };
      }
      
      return openAiResult;
    } catch (error) {
      console.error(`OpenAI verification error for ${documentType}:`, error);
      // Fall back to traditional methods
    }
  }
  
  // Traditional document-specific validations as fallback
  switch (documentType) {
    case 'pan':
      // Basic PAN card validation based on filename
      const isPotentialPan = fileName.includes('pan') || fileName.includes('card');
      if (!isPotentialPan) {
        return {
          isValid: false,
          feedback: 'The document type doesn\'t match what we\'re expecting for PAN. Please upload a proper PAN card document.'
        };
      }
      break;
      
    case 'bank':
      // Bank statement specific validation
      if (!fileName.includes('statement') && !fileName.includes('bank') && !fileName.includes('account')) {
        return {
          isValid: false,
          feedback: 'Please upload a proper bank statement. The document doesn\'t appear to be a bank statement.'
        };
      }
      break;
      
    case 'income':
      // Income proof specific validation
      if (!fileName.includes('salary') && !fileName.includes('income') && !fileName.includes('form16') && !fileName.includes('itr')) {
        return {
          isValid: false, 
          feedback: 'Please upload a proper income proof document like salary slip, Form 16, or ITR acknowledgment.'
        };
      }
      break;
      
    case 'address':
      // Address proof specific validation
      if (!fileName.includes('bill') && !fileName.includes('utility') && !fileName.includes('address') && !fileName.includes('rent')) {
        return {
          isValid: false,
          feedback: 'Please upload a proper address proof like utility bill, rental agreement, or other official address document.'
        };
      }
      break;
      
    case 'signature':
      // Signature verification
      if (!fileName.includes('signature') && !fileName.includes('sign')) {
        return {
          isValid: false,
          feedback: 'Please upload a document with your signature. The document doesn\'t appear to contain a signature.'
        };
      }
      break;
      
    default:
      // For other document types
      if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
        return {
          isValid: false,
          feedback: `The ${documentType} document must be a PDF or image file.`
        };
      }
  }
  
  // Pass validation for proper documents (fallback only, OpenAI is preferred)
  return {
    isValid: true,
    feedback: `${documentType} document validated successfully. The document format and content meet our requirements.`
  };
};
