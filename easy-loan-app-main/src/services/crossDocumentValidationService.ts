
/**
 * Cross-document validation service
 * This service compares information across different document types
 * to ensure consistency and detect potential fraud
 */

import { toast } from 'sonner';

// Document data interface for storing extracted information
export interface DocumentData {
  documentType: string;
  name?: string;
  dob?: string;
  gender?: string;
  address?: string;
  idNumber?: string; // Aadhar number, PAN number, etc.
  accountNumber?: string; // For bank statements
  issuer?: string; // Issuing authority/bank
  extractedData?: Record<string, any>; // Additional extracted data
  isValid: boolean;
  feedback: string;
}

// Document set verification result
export interface VerificationSetResult {
  isValid: boolean;
  inconsistencies: DocumentInconsistency[];
  summary: string;
}

// Document inconsistency interface
export interface DocumentInconsistency {
  type: 'name' | 'dob' | 'address' | 'gender' | 'other';
  description: string;
  severity: 'high' | 'medium' | 'low';
  documents: string[];
}

/**
 * Compares two strings for similarity, accounting for common variations
 * @param str1 First string to compare
 * @param str2 Second string to compare
 * @returns Similarity score (0-1)
 */
const compareSimilarity = (str1?: string, str2?: string): number => {
  if (!str1 || !str2) return 0;
  
  // Normalize strings for comparison
  const normalize = (s: string): string => {
    return s.trim().toLowerCase()
      .replace(/\s+/g, ' ') // Replace multiple spaces with one
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ''); // Remove punctuation
  };
  
  const s1 = normalize(str1);
  const s2 = normalize(str2);
  
  // Exact match
  if (s1 === s2) return 1;
  
  // Contained match (one string is part of the other)
  if (s1.includes(s2) || s2.includes(s1)) return 0.9;
  
  // Calculate Levenshtein distance
  const levDistance = (a: string, b: string): number => {
    const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));
    
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }
    
    return matrix[a.length][b.length];
  };
  
  const distance = levDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);
  
  // Return similarity score (0-1)
  return maxLength === 0 ? 1 : 1 - distance / maxLength;
};

/**
 * Check name consistency across documents
 * @param documents Array of document data
 * @returns Array of inconsistencies
 */
const checkNameConsistency = (documents: DocumentData[]): DocumentInconsistency[] => {
  const inconsistencies: DocumentInconsistency[] = [];
  const docsWithNames = documents.filter(doc => doc.name);
  
  if (docsWithNames.length < 2) return inconsistencies;
  
  // Compare each document's name with every other document
  for (let i = 0; i < docsWithNames.length; i++) {
    for (let j = i + 1; j < docsWithNames.length; j++) {
      const doc1 = docsWithNames[i];
      const doc2 = docsWithNames[j];
      
      const similarity = compareSimilarity(doc1.name, doc2.name);
      
      if (similarity < 0.8) {
        inconsistencies.push({
          type: 'name',
          description: `Name mismatch between ${doc1.documentType} (${doc1.name}) and ${doc2.documentType} (${doc2.name})`,
          severity: similarity < 0.5 ? 'high' : 'medium',
          documents: [doc1.documentType, doc2.documentType]
        });
      }
    }
  }
  
  return inconsistencies;
};

/**
 * Check date of birth consistency across documents
 * @param documents Array of document data
 * @returns Array of inconsistencies
 */
const checkDOBConsistency = (documents: DocumentData[]): DocumentInconsistency[] => {
  const inconsistencies: DocumentInconsistency[] = [];
  const docsWithDOB = documents.filter(doc => doc.dob);
  
  if (docsWithDOB.length < 2) return inconsistencies;
  
  // Normalize dates for comparison
  const normalizeDate = (dateStr: string): string => {
    // Handle common date formats
    // DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, etc.
    try {
      // Extract components regardless of separator
      const parts = dateStr.split(/[-/.]/);
      
      if (parts.length !== 3) return dateStr;
      
      // Try to determine format based on values
      let day: string, month: string, year: string;
      
      // If first part is 4 digits, assume YYYY-MM-DD
      if (parts[0].length === 4) {
        [year, month, day] = parts;
      } 
      // If last part is 4 digits, assume DD/MM/YYYY or MM/DD/YYYY
      else if (parts[2].length === 4) {
        year = parts[2];
        // Try to determine if DD/MM or MM/DD based on values
        if (parseInt(parts[0]) > 12) {
          day = parts[0];
          month = parts[1];
        } else {
          // Default to DD/MM format (most common in India)
          day = parts[0];
          month = parts[1];
        }
      } else {
        // Can't determine format, return as is
        return dateStr;
      }
      
      // Return in YYYY-MM-DD format for consistent comparison
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch (e) {
      console.error('Error normalizing date:', e);
      return dateStr;
    }
  };
  
  // Compare each document's DOB with every other document
  for (let i = 0; i < docsWithDOB.length; i++) {
    for (let j = i + 1; j < docsWithDOB.length; j++) {
      const doc1 = docsWithDOB[i];
      const doc2 = docsWithDOB[j];
      
      if (!doc1.dob || !doc2.dob) continue;
      
      const normDate1 = normalizeDate(doc1.dob);
      const normDate2 = normalizeDate(doc2.dob);
      
      if (normDate1 !== normDate2) {
        inconsistencies.push({
          type: 'dob',
          description: `Date of birth mismatch between ${doc1.documentType} (${doc1.dob}) and ${doc2.documentType} (${doc2.dob})`,
          severity: 'high',
          documents: [doc1.documentType, doc2.documentType]
        });
      }
    }
  }
  
  return inconsistencies;
};

/**
 * Check address consistency across documents
 * @param documents Array of document data
 * @returns Array of inconsistencies
 */
const checkAddressConsistency = (documents: DocumentData[]): DocumentInconsistency[] => {
  const inconsistencies: DocumentInconsistency[] = [];
  const docsWithAddress = documents.filter(doc => doc.address);
  
  if (docsWithAddress.length < 2) return inconsistencies;
  
  // Compare each document's address with every other document
  for (let i = 0; i < docsWithAddress.length; i++) {
    for (let j = i + 1; j < docsWithAddress.length; j++) {
      const doc1 = docsWithAddress[i];
      const doc2 = docsWithAddress[j];
      
      const similarity = compareSimilarity(doc1.address, doc2.address);
      
      if (similarity < 0.7) {
        inconsistencies.push({
          type: 'address',
          description: `Address mismatch between ${doc1.documentType} and ${doc2.documentType}`,
          severity: similarity < 0.4 ? 'high' : 'medium',
          documents: [doc1.documentType, doc2.documentType]
        });
      }
    }
  }
  
  return inconsistencies;
};

/**
 * Cross-validate a set of documents
 * @param documents Array of document data
 * @returns Validation result with inconsistencies and summary
 */
export const crossValidateDocuments = (documents: DocumentData[]): VerificationSetResult => {
  console.log('Cross-validating documents:', documents);
  
  // Check individual document validity first
  const invalidDocuments = documents.filter(doc => !doc.isValid);
  if (invalidDocuments.length > 0) {
    return {
      isValid: false,
      inconsistencies: invalidDocuments.map(doc => ({
        type: 'other',
        description: `Invalid ${doc.documentType}: ${doc.feedback}`,
        severity: 'high',
        documents: [doc.documentType]
      })),
      summary: `${invalidDocuments.length} document(s) failed individual verification.`
    };
  }
  
  // Perform cross-document validation
  const nameInconsistencies = checkNameConsistency(documents);
  const dobInconsistencies = checkDOBConsistency(documents);
  const addressInconsistencies = checkAddressConsistency(documents);
  
  const allInconsistencies = [
    ...nameInconsistencies,
    ...dobInconsistencies,
    ...addressInconsistencies
  ];
  
  // Determine overall validity and create summary
  const highSeverityIssues = allInconsistencies.filter(inc => inc.severity === 'high');
  const mediumSeverityIssues = allInconsistencies.filter(inc => inc.severity === 'medium');
  
  const isValid = highSeverityIssues.length === 0;
  
  let summary = '';
  if (allInconsistencies.length === 0) {
    summary = 'All documents are consistent and valid. Verification successful.';
  } else if (highSeverityIssues.length > 0) {
    summary = `Verification failed due to ${highSeverityIssues.length} critical inconsistency(ies).`;
  } else {
    summary = `Verification passed with ${mediumSeverityIssues.length} minor inconsistency(ies) that should be reviewed.`;
  }
  
  return {
    isValid,
    inconsistencies: allInconsistencies,
    summary
  };
};

/**
 * Format document data from OpenAI verification results
 * @param documentType Type of document
 * @param openAIResult Result from OpenAI verification
 * @returns Formatted document data
 */
export const formatDocumentData = (
  documentType: string, 
  openAIResult: { isValid: boolean; feedback: string; extractedData?: Record<string, any>; isCorrectDocumentType?: boolean }
): DocumentData => {
  const extractedData = openAIResult.extractedData || {};
  
  return {
    documentType,
    name: extractedData.name,
    dob: extractedData.dob,
    gender: extractedData.gender,
    address: extractedData.address,
    idNumber: extractedData.documentNumber || extractedData.aadharNumber || extractedData.panNumber,
    accountNumber: extractedData.accountNumber,
    issuer: extractedData.issuer,
    extractedData,
    isValid: openAIResult.isValid,
    feedback: openAIResult.feedback
  };
};

/**
 * Generate a detailed verification report
 * @param result Verification result
 * @returns HTML-formatted report
 */
export const generateVerificationReport = (result: VerificationSetResult): string => {
  const statusClass = result.isValid ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50';
  const statusIcon = result.isValid ? '✓' : '✗';
  
  let reportHtml = `
    <div class="rounded-lg p-4 ${statusClass} mb-4">
      <div class="font-medium flex items-center">
        <span class="mr-2 text-lg">${statusIcon}</span>
        <span>Overall Status: ${result.isValid ? 'VERIFIED' : 'VERIFICATION FAILED'}</span>
      </div>
      <p class="mt-1">${result.summary}</p>
    </div>
  `;
  
  if (result.inconsistencies.length > 0) {
    reportHtml += `
      <div class="text-gray-800 font-medium mb-2">Identified Issues:</div>
      <ul class="space-y-2">
    `;
    
    result.inconsistencies.forEach(issue => {
      const severityClass = 
        issue.severity === 'high' ? 'text-red-700 bg-red-50' :
        issue.severity === 'medium' ? 'text-orange-700 bg-orange-50' :
        'text-yellow-700 bg-yellow-50';
      
      reportHtml += `
        <li class="rounded p-3 ${severityClass}">
          <div class="font-medium">${issue.severity.toUpperCase()} SEVERITY</div>
          <div class="mt-1">${issue.description}</div>
          <div class="mt-1 text-sm">Documents: ${issue.documents.join(', ')}</div>
        </li>
      `;
    });
    
    reportHtml += '</ul>';
  }
  
  return reportHtml;
};
