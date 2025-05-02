
/**
 * Aadhar card verification logic with OpenAI integration
 */
import { isAadharCard, extractAadharDetails } from '../../services/documentVerificationService';
import { verifyDocumentWithOpenAI } from '../../services/openAiVerificationService';

export const verifyAadharDocument = async (fileToVerify: File, imageUrl: string | null): Promise<{isValid: boolean; feedback: string}> => {
  console.log('Starting Aadhar verification for file:', fileToVerify.name);
  
  // Check for minimum file size to ensure it's not too small to be valid
  if (fileToVerify.size < 50 * 1024) { // Less than 50KB is suspicious for Aadhar
    return {
      isValid: false,
      feedback: 'The uploaded Aadhar document is too small or may be corrupted. Please upload a valid Aadhar card with clear details.'
    };
  }
  
  // If image is available, try to validate it using OpenAI
  if (imageUrl && fileToVerify.type.startsWith('image/')) {
    try {
      // Use OpenAI for verification
      const openAiResult = await verifyDocumentWithOpenAI(imageUrl, 'aadhar');
      
      // Check if this is actually an Aadhar card
      if (openAiResult.isCorrectDocumentType === false) {
        return {
          isValid: false,
          feedback: openAiResult.feedback || 'The uploaded document is not an Aadhar card. Please ensure you are uploading the correct document type.'
        };
      }
      
      // If OpenAI verification fails, fall back to traditional methods
      if (!openAiResult.isValid) {
        // First verify it looks like an Aadhar card using traditional methods
        const isValidAadhar = await isAadharCard(imageUrl);
        if (!isValidAadhar) {
          return {
            isValid: false,
            feedback: 'The uploaded image does not appear to be a valid Aadhar card. Please ensure you upload a clear, complete image of your Aadhar card.'
          };
        }
        
        // Then extract and verify Aadhar details
        const details = await extractAadharDetails(imageUrl);
        console.log('Extracted Aadhar details:', details);
        
        // Verify that essential information is present
        if (!details.aadharNumber || details.aadharNumber.length !== 12) {
          return {
            isValid: false,
            feedback: 'The Aadhar number could not be detected or is invalid. Please upload a clearer image where the Aadhar number is visible.'
          };
        }
        
        if (!details.name || details.name.length < 3) {
          return {
            isValid: false,
            feedback: 'The name on the Aadhar card could not be detected. Please upload a clearer image where your name is visible.'
          };
        }
        
        if (!details.dob) {
          return {
            isValid: false,
            feedback: 'The date of birth on the Aadhar card could not be detected. Please upload a clearer image where your DOB is visible.'
          };
        }
        
        // All checks passed with traditional methods
        return { 
          isValid: true,
          feedback: 'Aadhar card validated successfully. All required details (Aadhar number, name, and DOB) are visible and properly formatted.'
        };
      }
      
      // Return OpenAI verification result
      return openAiResult;
    } catch (error) {
      console.error('Aadhar card verification error:', error);
      return {
        isValid: false,
        feedback: 'Error verifying Aadhar card details. Please upload a clearer image where all details are visible.'
      };
    }
  } else if (!imageUrl && fileToVerify.type === 'application/pdf') {
    // For PDFs, we can only do basic validation without image processing
    return {
      isValid: false,
      feedback: 'For security reasons, we need to verify the content of your Aadhar card. Please upload a clear image (JPG/PNG) instead of a PDF.'
    };
  }
  
  return { 
    isValid: false,
    feedback: 'Unable to verify Aadhar card. Please upload a clear image where all details (Aadhar number, name, DOB) are visible.'
  };
};
