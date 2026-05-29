export interface VisitRecord {
  id: string;
  visitorName: string;
  company: string;
  hostEmployee: string;
  department: string;
  idTypeMasked: string;
  checkInDate: string;
  checkInTime: string;
  checkOutTime: string;
  totalDuration: string;
  visitPurpose: string;
  status: 'Pending' | 'Approved' | 'Checked-In' | 'Checked-Out' | 'Denied';
}

export interface ReportMetrics {
  totalVisitors: number;
  avgDuration: string;
  deniedEntries: number;
  overstays: number;
  uniqueCompanies: number;
  mostVisitedDepartment: string;
}

export interface ReportFilters {
  department?: string;
  hostEmployee?: string;
  visitPurpose?: string;
  status?: string;
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

export type ReportType = 
  | 'Full Visitor Log'
  | 'Pending Approvals'
  | 'Overstay'
  | 'Department-wise'
  | 'Frequent Visitors'
  | 'Security Incidents';
