
/**
 * Photo document verification logic with OpenAI integration
 */
import { hasFaceInImage } from '../../services/documentVerificationService';
import { verifyDocumentWithOpenAI } from '../../services/openAiVerificationService';

export const verifyPhotoDocument = async (fileToVerify: File, imageUrl: string): Promise<{isValid: boolean; feedback: string}> => {
  // For photograph documents
  const fileType = fileToVerify.type;
  
  // Only image files are valid for photo documents
  if (!fileType.startsWith('image/')) {
    return {
      isValid: false,
      feedback: 'Please upload a photograph in image format (JPG/PNG). PDF documents cannot be verified as photographs.'
    };
  }
  
  // Check if filename might suggest it's not a proper photo
  const fileName = fileToVerify.name.toLowerCase();
  if (fileName.includes('document') || 
      fileName.includes('receipt') || 
      fileName.includes('pdf') || 
      fileName.includes('scan') || 
      fileName.includes('contract')) {
    return {
      isValid: false,
      feedback: 'The uploaded file does not appear to be a proper photograph. Please upload a clear, front-facing photograph with your face clearly visible.'
    };
  }
  
  // Additional check based on file size - proper photos are usually at least 50KB
  if (fileToVerify.size < 50 * 1024) {
    return {
      isValid: false, 
      feedback: 'The image resolution is too low. Please upload a higher quality photograph where your face is clearly visible.'
    };
  }
  
  // Use OpenAI for advanced photo verification
  try {
    console.log('Sending photo to OpenAI for verification...');
    const openAiResult = await verifyDocumentWithOpenAI(imageUrl, 'photo');
    
    // Check if document type matches what was requested (a photo)
    if (openAiResult.isCorrectDocumentType === false) {
      return {
        isValid: false,
        feedback: openAiResult.feedback || 'The uploaded image is not a proper photograph. Please upload a clear front-facing photograph with your face visible.'
      };
    }
    
    // If OpenAI can't verify, fall back to traditional method
    if (!openAiResult.isValid) {
      console.log('OpenAI verification failed, falling back to traditional method');
      // Try to detect face in the image using the model
      const hasFace = await hasFaceInImage(imageUrl);
      if (!hasFace) {
        return {
          isValid: false,
          feedback: 'No human face detected in the photograph. Please upload a clear front-facing photograph with good lighting where your face is clearly visible.'
        };
      }
      
      return { 
        isValid: true,
        feedback: 'Photograph validated successfully. The image quality is good and your face is clearly visible.'
      };
    }
    
    console.log('OpenAI verification successful:', openAiResult);
    // Return OpenAI verification result
    return openAiResult;
  } catch (error) {
    console.error('Face detection failed:', error);
    
    // Fall back to traditional method if OpenAI fails
    try {
      const hasFace = await hasFaceInImage(imageUrl);
      if (!hasFace) {
        return {
          isValid: false,
          feedback: 'No human face detected in the photograph. Please upload a clear front-facing photograph with good lighting where your face is clearly visible.'
        };
      }
      
      return { 
        isValid: true,
        feedback: 'Photograph validated successfully. The image quality is good and your face is clearly visible.'
      };
    } catch (innerError) {
      console.error('All face detection methods failed:', innerError);
      return {
        isValid: false,
        feedback: 'Unable to verify the photograph. Please ensure your face is clearly visible and the image has good lighting and resolution.'
      };
    }
  }
};
