
import { ArrowRight, Scan } from 'lucide-react';

interface SingleVerificationPromptProps {
  handleSingleVerificationClick: () => void;
}

const SingleVerificationPrompt: React.FC<SingleVerificationPromptProps> = ({
  handleSingleVerificationClick
}) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-8">
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full text-blue-700 mr-4">
          <Scan className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Verify Your Documents Efficiently</h3>
          <p className="text-blue-700 mb-4">
            Upload each document individually for verification. Ensure you upload the correct document type for each requirement.
            <span className="block mt-2 font-medium">All documents must match their required types (e.g., Aadhar Card must be a valid Aadhar document).</span>
          </p>
          <button 
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md 
              transition-colors flex items-center"
            onClick={handleSingleVerificationClick}
          >
            Start Document Verification <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleVerificationPrompt;
