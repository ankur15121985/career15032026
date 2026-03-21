export interface University {
  id?: string;
  name: string;
  fees: string;
  duration?: string;
  location: string;
  ranking?: string;
  specialization?: string;
  website?: string;
}

export interface CareerNode {
  id: string;
  name: string;
  description?: string;
  children?: CareerNode[];
  universities?: University[];
  isLeaf?: boolean;
  type?: 'root' | 'branch' | 'leaf';
  parent_id?: string | null;
  duration?: string;
  job_roles?: string;
}
