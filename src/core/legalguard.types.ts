export type ComplaintType = 'апелляционная' | 'кассационная';

export type FindingStatus = 'pending' | 'accepted' | 'rejected' | 'needs_review';

export interface CaseInfo {
  caseNumber: string;
  courtName: string;
  verdictDate: string;
  clientName: string;
  complaintType: ComplaintType;
}

export interface DeepSeekFinding {
  id: string;
  claim: string;
  sourceQuote?: string;
  legalBasis?: string[];
  confidence: number;
}

export interface ArbiterFinding extends DeepSeekFinding {
  status: FindingStatus;
  legalSignificance: 'high' | 'medium' | 'low' | 'none';
  reasoning: string;
  appealCassationRelevance?: string;
}

export interface StrategyArgument {
  findingId: string;
  position: number;
  heading: string;
  argument: string;
  requestedRelief?: string;
}

export interface FinalControlResult {
  passed: boolean;
  blockingReasons: string[];
  warnings: string[];
  checkedFindingIds: string[];
}

export interface PipelineTraceEntry {
  code: string;
  stage: 'documents' | 'analyst' | 'arbiter' | 'strategist' | 'final-control';
  status: 'ok' | 'warning' | 'error' | 'rejected' | 'pending';
  message: string;
  timestamp: string;
}

export interface LegalGuardResult {
  runId: string;
  findings: DeepSeekFinding[];
  arbiterFindings: ArbiterFinding[];
  strategy: StrategyArgument[];
  finalControl: FinalControlResult | null;
  finalDocument: string | null;
  trace: PipelineTraceEntry[];
  readyForSubmission: boolean;
}

export interface AIProvider {
  name: string;
  isConfigured(): boolean;
}

export interface DeepSeekAnalyzer extends AIProvider {
  analyze(documentText: string): Promise<DeepSeekFinding[]>;
}

export interface ChatGPTArbiter extends AIProvider {
  arbitrate(findings: DeepSeekFinding[], documentText: string): Promise<ArbiterFinding[]>;
}
