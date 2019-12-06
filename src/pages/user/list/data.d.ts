export interface TableListItem {
  user_name?: string;
  real_name: string;
  email: string;
  phone: string;
  status: number;
  creator: string;
  created_at: Date;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  page: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  page: number;
}
