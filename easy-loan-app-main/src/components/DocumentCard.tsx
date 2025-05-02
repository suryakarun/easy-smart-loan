
import { Check, Clock, AlertCircle } from 'lucide-react';

export type DocumentStatus = 'approved' | 'pending' | 'attention';

interface DocumentCardProps {
  title: string;
  description: string;
  status: DocumentStatus;
  onClick: () => void;
  feedback?: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ title, description, status, onClick, feedback }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'approved':
        return {
          icon: <Check className="h-5 w-5" />,
          bgColor: 'bg-green-100',
          textColor: 'text-green-600',
          label: 'Approved'
        };
      case 'pending':
        return {
          icon: <Clock className="h-5 w-5" />,
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-600',
          label: 'Pending'
        };
      case 'attention':
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          bgColor: 'bg-red-100',
          textColor: 'text-red-600',
          label: 'Needs Attention'
        };
      default:
        return {
          icon: <Clock className="h-5 w-5" />,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          label: 'Pending'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div 
      className="document-card rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium text-lg">{title}</h3>
          <div className={`flex items-center ${statusInfo.bgColor} ${statusInfo.textColor} text-xs px-2.5 py-1 rounded-full`}>
            {statusInfo.icon}
            <span className="ml-1">{statusInfo.label}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-2">{description}</p>
        
        {feedback && status === 'attention' && (
          <div className="mb-3 p-2 bg-red-50 border border-red-100 rounded text-xs text-red-600">
            {feedback}
          </div>
        )}
        
        <button 
          className="w-full py-2 bg-loan-primary text-white rounded-md hover:bg-loan-button-hover transition-colors"
        >
          {status === 'attention' ? 'Re-upload' : status === 'approved' ? 'View Document' : 'Upload'}
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
