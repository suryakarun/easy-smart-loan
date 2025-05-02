
import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface VerificationInfoProps {
  documentType: string;
}

const VerificationInfo: React.FC<VerificationInfoProps> = ({ documentType }) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-4 text-sm">
      <div className="flex items-start">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <p className="font-medium text-blue-800 mb-2">Document Verification Guidelines</p>
          <p className="text-blue-700">
            We verify all documents carefully to ensure their authenticity. Please make sure your {documentType} document is:
          </p>
          <ul className="list-disc pl-5 mt-2 text-blue-700 space-y-1">
            <li>Clear and legible with all details visible</li>
            <li>Not edited or tampered with</li>
            <li>Recent and valid according to government standards</li>
            <li>Properly named to indicate document type</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

interface VerificationProcessProps {
  isVerifying: boolean;
}

export const VerificationProcess: React.FC<VerificationProcessProps> = ({ isVerifying }) => {
  if (!isVerifying) return null;
  
  return (
    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex items-center text-sm">
      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
      <span className="text-yellow-700">
        Verifying document authenticity. This may take a moment...
      </span>
    </div>
  );
};

export default VerificationInfo;
