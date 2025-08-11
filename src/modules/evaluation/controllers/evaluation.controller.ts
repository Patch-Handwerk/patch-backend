import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ClientEvaluationService } from '../services/evaluation.service';
import { CalculateProgressDto } from '../dto/calculate-progress.dto';

@ApiTags('evaluation')
@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: ClientEvaluationService) {}

  // Dashboard: Get all phases (for initial dashboard load)
  @Get('phases')
  @ApiOperation({ summary: 'Get all phases for dashboard' })
  @ApiResponse({ status: 200, description: 'Phases retrieved successfully' })
  async getAllPhases() {
    return this.evaluationService.getAllPhases();
  }

  // Get subphases for a specific phase
  @Get('phases/:phaseId/subphases')
  @ApiOperation({ summary: 'Get subphases for a specific phase' })
  @ApiResponse({ status: 200, description: 'Subphases retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Phase not found' })
  @ApiParam({ name: 'phaseId', description: 'ID of the phase', example: 1 })
  async getSubphasesByPhase(@Param('phaseId') phaseId: number) {
    return this.evaluationService.getSubphasesByPhase(phaseId);
  }

  // Get question and answers for a specific subphase
  @Get('subphases/:subphaseId/question')
  @ApiOperation({ summary: 'Get question and answers for a specific subphase' })
  @ApiResponse({ status: 200, description: 'Question and answers retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Subphase or question not found' })
  @ApiParam({ name: 'subphaseId', description: 'ID of the subphase', example: 1 })
  async getQuestionBySubphase(@Param('subphaseId') subphaseId: number) {
    return this.evaluationService.getQuestionBySubphase(subphaseId);
  }

  // Get all data for a specific phase (phases + subphases + questions + answers)
  @Get('phases/:phaseId/complete')
  @ApiOperation({ summary: 'Get complete data for a specific phase' })
  @ApiResponse({ status: 200, description: 'Complete phase data retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Phase not found' })
  @ApiParam({ name: 'phaseId', description: 'ID of the phase', example: 1 })
  async getCompletePhaseData(@Param('phaseId') phaseId: number) {
    return this.evaluationService.getCompletePhaseData(phaseId);
  }

  // Get all data for entire assessment (all phases with complete data)
  @Get('complete-assessment')
  @ApiOperation({ summary: 'Get complete assessment data (all phases)' })
  @ApiResponse({ status: 200, description: 'Complete assessment data retrieved successfully' })
  async getCompleteAssessment() {
    return this.evaluationService.getCompleteAssessment();
  }

  // Calculate progress from selected answers
  @Post('results')
  @ApiOperation({ summary: 'Calculate progress from selected answers' })
  @ApiResponse({ status: 201, description: 'Progress calculated successfully' })
  async calculateProgress(@Body() calculateData: CalculateProgressDto) {
    console.log(calculateData, "calculateDatacontroller");
    return this.evaluationService.progressCalculation(calculateData);
  }
}