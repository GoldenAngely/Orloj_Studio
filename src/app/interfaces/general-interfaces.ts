export interface ApiResponse<TResponse> {
  result: TResponse;
  succeeded: boolean;
  message: string | null;
  error: string | null;
}

export interface WorkScheme {
  workSchemeId: number;
  description: string;
  start: string;
  end: string;
  active: boolean;
}

export interface TeamProd {
  teamId: number;
  team: number;
  teamAlias: string;
  ouId: number;
}

export interface OuProd {
  ouId: number;
  shortDescription: string;
  description: string;
  descriptionSh: string;
}

export interface ShiftSchedule {
  shiftScheduleId: number;
  start: string;
  end: string;
  shift: number;
  claimPointStart: string;
  claimPointEnd: string;
  active: boolean;
  schemesId: number;
}

export type TableRow = Record<string, unknown>;

export interface CatalogTable {
  title: string;
  rows: TableRow[];
  columns: string[];
  loading: boolean;
  error: string | null;
}