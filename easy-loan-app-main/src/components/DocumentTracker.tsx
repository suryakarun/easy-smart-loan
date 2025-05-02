
import { CheckCircle, Clock, AlertCircle, FileText, Braces } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DocumentStatus } from './DocumentCard';

interface DocumentTrackerProps {
  documents: {
    id: string;
    name: string;
    status: DocumentStatus;
    feedback?: string;
  }[];
  showDetailed?: boolean;
  useSingleVerification?: boolean;
}

const DocumentTracker: React.FC<DocumentTrackerProps> = ({ 
  documents, 
  showDetailed = false, 
  useSingleVerification = false 
}) => {
  const approved = documents.filter(doc => doc.status === 'approved').length;
  const total = documents.length;
  const progress = Math.round((approved / total) * 100) || 0;
  
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          Document Submission Progress
          {approved > 0 && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              AI Verified
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">{approved} of {total} complete</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-loan-primary h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {useSingleVerification && approved === 0 && (
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700 mb-4 flex items-start">
            <Braces className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>Verify all documents at once using your single identity document with AI</span>
          </div>
        )}
        
        {showDetailed ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Document</TableHead>
                {showDetailed && <TableHead>Notes</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    {doc.status === 'approved' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {doc.status === 'pending' && (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                    {doc.status === 'attention' && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>{doc.name}</TableCell>
                  {showDetailed && (
                    <TableCell className="text-sm text-gray-600">
                      {doc.status === 'approved' && (doc.feedback || "Verified with AI")}
                      {doc.status === 'pending' && "Awaiting verification"}
                      {doc.status === 'attention' && doc.feedback ? doc.feedback : "Needs attention"}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center">
                {doc.status === 'approved' && (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                )}
                {doc.status === 'pending' && (
                  <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                )}
                {doc.status === 'attention' && (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                )}
                <span className="text-sm">{doc.name}</span>
                {doc.status === 'approved' && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                    AI Verified
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentTracker;
