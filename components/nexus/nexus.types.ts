export type Product =
  | "curpify"
  | "cryptolink"
  | "evilink"
  | "evi_link"
  | "data_link"
  | "vsecrets"
  | "status_hub"
  | "mcpone"
  | "nexus";

export type McpPoint = {
  t?: string;
  v?: number;
};

export type McpItem = {
  label?: string;
  value?: any;
  unit?: string;
  tone?: string;
  points?: McpPoint[];
};

export type McpSection = {
  id: string;
  type: string;
  title: string | null;

  text?: string | null;
  kind?: string | null;
  message?: string | null;
  details?: string | null;

  items?: McpItem[] | null;
};

export type Msg = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  ts: number;
  product: string;

  sections?: McpSection[];

  traceId?: string;
  toolCalls?: any[];
  toolResults?: any[];
};