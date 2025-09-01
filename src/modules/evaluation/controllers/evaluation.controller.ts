import { Controller, Post, Get, Body, Param, Query, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ClientEvaluationService } from '../services/evaluation.service';
import { CalculateProgressDto } from '../dto/calculate-progress.dto';
import { JwtBlacklistGuard } from 'src/common/guards/jwt-blacklist.guard';
import { RequestWithUser } from 'src/config/types/RequestWithUser';
import { 
  PhaseResponseDto, 
  SubphaseResponseDto, 
  QuestionResponseDto, 
  ProgressResponseDto,
  CompletePhaseResponseDto,
  CompleteAssessmentResponseDto,
  UserProgressResponseDto,
  CalculateProgressResponseDto
} from '../dto/evaluation-response.dto';

@ApiTags('evaluation')
@ApiBearerAuth()
@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: ClientEvaluationService) {}

  // Dashboard: Get all phases (for initial dashboard load)
  @Get('phases')
  @ApiOperation({ 
    summary: 'Get all phases for dashboard',
    description: 'Retrieves all available phases for the evaluation dashboard. This endpoint provides the main navigation structure for the assessment system.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Phases retrieved successfully',
    type: [PhaseResponseDto]
  })
  async getAllPhases() {
    return this.evaluationService.getAllPhases();
  }

  // Get subphases for a specific phase
  @Get('phases/:phaseId/subphases')
  @ApiOperation({ 
    summary: 'Get subphases for a specific phase',
    description: 'Retrieves all subphases associated with a specific evaluation phase. This endpoint provides the detailed breakdown of assessment components within a phase.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Subphases retrieved successfully',
    type: [SubphaseResponseDto]
  })
  @ApiResponse({ status: 404, description: 'Phase not found' })
  @ApiParam({ name: 'phaseId', description: 'ID of the phase to get subphases for', example: 1 })
  async getSubphasesByPhase(@Param('phaseId') phaseId: number, @Req() req: RequestWithUser) {
    return this.evaluationService.getSubphasesByPhase(phaseId);
  }

  // Get question and answers for a specific subphase
  @Get('subphases/:subphaseId/question')
  @ApiOperation({ 
    summary: 'Get question and answers for a specific subphase',
    description: 'Retrieves the question and all possible answers for a specific subphase. This endpoint provides the assessment content that users will interact with.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Question and answers retrieved successfully',
    type: QuestionResponseDto
  })
  @ApiResponse({ status: 404, description: 'Subphase or question not found' })
  @ApiParam({ name: 'subphaseId', description: 'ID of the subphase to get question for', example: 1 })
  async getQuestionBySubphase(@Param('subphaseId') subphaseId: number) {
    return this.evaluationService.getQuestionBySubphase(subphaseId);
  }

  // Get all data for a specific phase (phases + subphases + questions + answers)
  @Get('phases/:phaseId/complete')
  @ApiOperation({ 
    summary: 'Get complete data for a specific phase',
    description: 'Retrieves complete assessment data for a specific phase including all subphases, questions, and answers. This endpoint provides comprehensive phase information in a single request.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Complete phase data retrieved successfully',
    type: CompletePhaseResponseDto
  })
  @ApiResponse({ status: 404, description: 'Phase not found' })
  @ApiParam({ name: 'phaseId', description: 'ID of the phase to get complete data for', example: 1 })
  async getCompletePhaseData(@Param('phaseId') phaseId: number) {
    return this.evaluationService.getCompletePhaseData(phaseId);
  }

  // Get all data for entire assessment (all phases with complete data)
  @Get('/complete-assessment')
  @ApiOperation({ 
    summary: 'Get complete assessment data (all phases)',
    description: 'Retrieves complete assessment data for all phases including subphases, questions, and answers. This endpoint provides the entire assessment structure in a single request.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Complete assessment data retrieved successfully',
    type: CompleteAssessmentResponseDto
  })
  async getCompleteAssessment() {
    return this.evaluationService.getCompleteAssessment();
  }

  // Calculate progress from selected answers
  @UseGuards(JwtBlacklistGuard)
  @Post('/answers')
  @ApiOperation({ 
    summary: 'Calculate progress from selected answers',
    description: 'Calculates and stores user progress based on their selected answers. This endpoint processes the evaluation responses and updates the user\'s progress in the system.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Progress calculated and stored successfully',
    type: CalculateProgressResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid request data or validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  async calculateProgress(@Body() calculateData: CalculateProgressDto, @Req() req: RequestWithUser) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not found in request. Please check your JWT token.');
    }
    const userId = req.user.id;
    return this.evaluationService.progressCalculation(calculateData, userId);
  }

  // Get progress for the current user
  @UseGuards(JwtBlacklistGuard)
  @Get(':id/progress')
  @ApiOperation({ 
    summary: 'Get progress for the current user',
    description: 'Retrieves the progress data for a specific user. This endpoint shows the user\'s assessment progress including completed phases, scores, and current status.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User progress retrieved successfully',
    type: UserProgressResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  @ApiResponse({ status: 404, description: 'No progress data found for the user' })
  @ApiParam({ name: 'id', description: 'User ID to get progress for', example: 1 })
  async getUserProgress(@Param('id') id: number) {
    return this.evaluationService.getUserProgress(id);
  }
}