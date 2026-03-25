import { ReportFieldLimits } from '../types/reportWorkspace';

export const DEFAULT_REPORT_FIELD_LIMITS: ReportFieldLimits = {
  workItem: 500,
  plannedBuildDate: 100,
  approvalDate: 100,
  weeklyStatusAndRisk: 1000,
  supportPlan: 1000,
  executiveDiscussion: 1000,
};
