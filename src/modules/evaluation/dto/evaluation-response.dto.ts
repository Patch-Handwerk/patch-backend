import { ApiProperty } from '@nestjs/swagger';

// ─── Shared building blocks ───────────────────────────────────────────────────

export class PhaseRefDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Planungs- und Logistikphase' })
  name: string;

  @ApiProperty({ example: 'assessment.phase.planningAndLogistics' })
  translationKey: string;
}

export class SubphaseRefDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Auftragserfassung' })
  name: string;

  @ApiProperty({ example: 'assessment.subphase.orderCapture' })
  translationKey: string;
}

export class AnswerItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'We use paper-based processes' })
  answer: string;

  @ApiProperty({ example: 'assessment.answer.paperBased' })
  answerTranslationKey: string;

  @ApiProperty({ example: 3 })
  point: number;

  @ApiProperty({ example: false })
  isStopAnswer: boolean;

  @ApiProperty({ example: 1 })
  level: number;

  @ApiProperty({ example: 'Digital Apprentice' })
  stage: string;

  @ApiProperty({ example: 'assessment.stage.digitalApprentice' })
  stageKey: string;

  @ApiProperty({ example: 'Analog' })
  description: string;

  @ApiProperty({ example: 'assessment.description.analog' })
  descriptionKey: string;
}

// ─── GET /evaluation/phases ───────────────────────────────────────────────────

export class PhaseListItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Planungs- und Logistikphase' })
  name: string;

  @ApiProperty({ example: 'assessment.phase.planningAndLogistics' })
  translationKey: string;

  @ApiProperty({ example: 3 })
  subphasesCount: number;
}

export class GetAllPhasesDataDto {
  @ApiProperty({ example: 'Phases retrieved successfully' })
  message: string;

  @ApiProperty({ type: [PhaseListItemDto] })
  phases: PhaseListItemDto[];

  @ApiProperty({ example: 6 })
  count: number;
}

// ─── GET /evaluation/phases/:phaseId/subphases ────────────────────────────────

export class GetSubphasesDataDto {
  @ApiProperty({ example: 'Subphases retrieved successfully' })
  message: string;

  @ApiProperty({ type: PhaseRefDto })
  phase: PhaseRefDto;

  @ApiProperty({ type: [SubphaseRefDto] })
  subphases: SubphaseRefDto[];

  @ApiProperty({ example: 3 })
  count: number;
}

// ─── GET /evaluation/subphases/:subphaseId/question ──────────────────────────

export class QuestionItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'How do you capture orders?' })
  question: string;

  @ApiProperty({ example: 'assessment.question.orderCapture' })
  translationKey: string;

  @ApiProperty({ example: 1 })
  sortId: number;
}

export class GetQuestionDataDto {
  @ApiProperty({ example: 'Question and answers retrieved successfully' })
  message: string;

  @ApiProperty({ type: SubphaseRefDto })
  subphase: SubphaseRefDto;

  @ApiProperty({ type: QuestionItemDto })
  question: QuestionItemDto;

  @ApiProperty({
    description: 'Answers grouped by maturity level (key = level number)',
    example: { '1': [], '2': [] },
  })
  answersByLevel: Record<string, AnswerItemDto[]>;

  @ApiProperty({ example: 18 })
  count: number;

  @ApiProperty({ example: 6 })
  levelsCount: number;
}

// ─── GET /evaluation/phases/:phaseId/complete ─────────────────────────────────

export class CompleteQuestionDto extends QuestionItemDto {
  @ApiProperty({
    description: 'Answers grouped by maturity level',
    example: { '1': [], '2': [] },
  })
  answersByLevel: Record<string, AnswerItemDto[]>;

  @ApiProperty({ example: 18 })
  count: number;
}

export class CompleteSubphaseDto extends SubphaseRefDto {
  @ApiProperty({ type: CompleteQuestionDto, nullable: true })
  question: CompleteQuestionDto | null;
}

export class GetCompletePhaseDataDto {
  @ApiProperty({ example: 'Complete phase data retrieved successfully' })
  message: string;

  @ApiProperty({ type: PhaseRefDto })
  phase: PhaseRefDto;

  @ApiProperty({ type: [CompleteSubphaseDto] })
  subphases: CompleteSubphaseDto[];

  @ApiProperty({ example: 3 })
  count: number;
}

// ─── GET /evaluation/complete-assessment ─────────────────────────────────────

export class CompletePhaseDto extends PhaseRefDto {
  @ApiProperty({ type: [CompleteSubphaseDto] })
  subphases: CompleteSubphaseDto[];

  @ApiProperty({ example: 3 })
  count: number;
}

export class GetCompleteAssessmentDataDto {
  @ApiProperty({ example: 'Complete assessment data retrieved successfully' })
  message: string;

  @ApiProperty({ type: [CompletePhaseDto] })
  phases: CompletePhaseDto[];

  @ApiProperty({ example: 6 })
  count: number;
}

// ─── GET /evaluation/:id/progress ────────────────────────────────────────────

export class ProgressResultItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Planungs- und Logistikphase' })
  phaseName: string;

  @ApiProperty({ example: 'Auftragserfassung' })
  subphaseName: string;

  @ApiProperty({ example: '75%' })
  progress: string;

  @ApiProperty({ example: 3 })
  level: number;

  @ApiProperty({ example: 'Digital Apprentice' })
  stage: string;

  @ApiProperty({ example: 'assessment.stage.digitalApprentice' })
  stageKey: string;

  @ApiProperty({ example: 'Analog' })
  description: string;

  @ApiProperty({ example: 'assessment.description.analog' })
  descriptionKey: string;

  @ApiProperty({ example: 27 })
  totalPoints: number;

  @ApiProperty({ example: 'Answer A; Answer B' })
  selectedAnswers: string;

  @ApiProperty({ example: '2026-03-19T18:06:37.599Z' })
  createdAt: string;
}

export class GetUserProgressDataDto {
  @ApiProperty({ example: 'User progress retrieved successfully' })
  message: string;

  @ApiProperty({ type: [ProgressResultItemDto] })
  data: ProgressResultItemDto[];

  @ApiProperty({ example: 4 })
  count: number;
}

// ─── POST /evaluation/answers ─────────────────────────────────────────────────

export class CalculateProgressResultDto {
  @ApiProperty({ example: 'Progress calculated successfully' })
  message: string;

  @ApiProperty({ example: 1 })
  user_id: number;

  @ApiProperty({ example: 'Planungs- und Logistikphase' })
  phase_name: string;

  @ApiProperty({ example: 'Auftragserfassung' })
  subphase_name: string;

  @ApiProperty({ example: 1 })
  question_id: number;

  @ApiProperty({ example: 'How do you capture orders?' })
  question_text: string;

  @ApiProperty({ example: 'Answer A; Answer B' })
  selected_answer_text: string;

  @ApiProperty({ example: 27 })
  totalPoints: number;

  @ApiProperty({ example: 3 })
  calculatedLevel: number;

  @ApiProperty({ example: 'Digital Apprentice' })
  calculatedStage: string;

  @ApiProperty({
    example: 'assessment.stage.digitalApprentice',
    nullable: true,
  })
  calculatedStageKey: string | null;

  @ApiProperty({ example: 'Analog' })
  calculatedDescription: string;

  @ApiProperty({ example: 'assessment.description.analog', nullable: true })
  calculatedDescriptionKey: string | null;

  @ApiProperty({ example: 3 })
  selectedAnswersCount: number;

  @ApiProperty({ example: 50 })
  progress: number;
}

// ─── ResponseInterceptor envelope ────────────────────────────────────────────
// Every response is wrapped by the global ResponseInterceptor in:
//   { success, message, data: <service return value>, meta }
// Use the *ResponseDto classes below in @ApiResponse decorators so Swagger
// reflects the real wire format. The *DataDto classes above describe only
// the `data` field.

export class ResponseMetaDto {
  @ApiProperty({ example: '2026-03-19T18:06:37.599Z' })
  timestamp: string;

  @ApiProperty({ example: '/evaluation/phases' })
  path: string;

  @ApiProperty({ example: 'GET' })
  method: string;
}

export class GetAllPhasesResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;

  @ApiProperty({ type: GetAllPhasesDataDto })
  data: GetAllPhasesDataDto;

  @ApiProperty({ type: ResponseMetaDto })
  meta: ResponseMetaDto;
}

export class GetSubphasesResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;

  @ApiProperty({ type: GetSubphasesDataDto })
  data: GetSubphasesDataDto;

  @ApiProperty({ type: ResponseMetaDto })
  meta: ResponseMetaDto;
}

export class GetQuestionResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;

  @ApiProperty({ type: GetQuestionDataDto })
  data: GetQuestionDataDto;

  @ApiProperty({ type: ResponseMetaDto })
  meta: ResponseMetaDto;
}

export class GetCompletePhaseResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;

  @ApiProperty({ type: GetCompletePhaseDataDto })
  data: GetCompletePhaseDataDto;

  @ApiProperty({ type: ResponseMetaDto })
  meta: ResponseMetaDto;
}

export class GetCompleteAssessmentResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;

  @ApiProperty({ type: GetCompleteAssessmentDataDto })
  data: GetCompleteAssessmentDataDto;

  @ApiProperty({ type: ResponseMetaDto })
  meta: ResponseMetaDto;
}

export class CalculateProgressResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;

  @ApiProperty({ type: CalculateProgressResultDto })
  data: CalculateProgressResultDto;

  @ApiProperty({ type: ResponseMetaDto })
  meta: ResponseMetaDto;
}

export class GetUserProgressResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;

  @ApiProperty({ type: GetUserProgressDataDto })
  data: GetUserProgressDataDto;

  @ApiProperty({ type: ResponseMetaDto })
  meta: ResponseMetaDto;
}

// ─── Legacy exports (kept for backwards compatibility with existing imports) ──

export class PhaseResponseDto extends PhaseListItemDto {}
export class SubphaseResponseDto extends SubphaseRefDto {}
export class AnswerResponseDto extends AnswerItemDto {}
export class QuestionResponseDto extends QuestionItemDto {}
export class ProgressResponseDto extends ProgressResultItemDto {}
export class CompletePhaseResponseDto extends CompletePhaseDto {}
export class CompleteSubphaseResponseDto extends CompleteSubphaseDto {}
export class CompleteAssessmentResponseDto extends GetCompleteAssessmentDataDto {}
export class UserProgressResponseDto extends GetUserProgressDataDto {}
