import { Controller, Post, Get, Body, Param, Query, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ClientEvaluationService } from '../services/evaluation.service';
import { CalculateProgressDto } from '../dto/calculate-progress.dto';
import { JwtBlacklistGuard } from 'src/common/guards/jwt-blacklist.guard';
import { RequestWithUser } from 'src/config/types/RequestWithUser';

@ApiTags('evaluation')
@ApiBearerAuth()
@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: ClientEvaluationService) {}

  // Dashboard: Get all phases (for initial dashboard load)
  @Get('phases')
  @ApiOperation({ summary: 'Get all phases for dashboard' })
  @ApiResponse({ status: 200, description: 'Phases retrieved successfully' })
  async getAllPhases(@Req() req: RequestWithUser) {
    // const userId = req.user.id;
    return this.evaluationService.getAllPhases();
  }

  // Get subphases for a specific phase
  @Get('phases/:phaseId/subphases')
  @ApiOperation({ summary: 'Get subphases for a specific phase' })
  @ApiResponse({ status: 200, description: 'Subphases retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Phase not found' })
  @ApiParam({ name: 'phaseId', description: 'ID of the phase', example: 1 })
  async getSubphasesByPhase(@Param('phaseId') phaseId: number, @Req() req: RequestWithUser) {
    // const userId = req.user.id;
    return this.evaluationService.getSubphasesByPhase(phaseId);
  }

  // Get question and answers for a specific subphase
  @Get('subphases/:subphaseId/question')
  @ApiOperation({ summary: 'Get question and answers for a specific subphase' })
  @ApiResponse({ status: 200, description: 'Question and answers retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Subphase or question not found' })
  @ApiParam({ name: 'subphaseId', description: 'ID of the subphase', example: 1 })
  async getQuestionBySubphase(@Param('subphaseId') subphaseId: number, @Req() req: RequestWithUser) {
    // const userId = req.user.id;
    return this.evaluationService.getQuestionBySubphase(subphaseId);
  }

  // Get all data for a specific phase (phases + subphases + questions + answers)
  @Get('phases/:phaseId/complete')
  @ApiOperation({ summary: 'Get complete data for a specific phase' })
  @ApiResponse({ status: 200, description: 'Complete phase data retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Phase not found' })
  @ApiParam({ name: 'phaseId', description: 'ID of the phase', example: 1 })
  async getCompletePhaseData(@Param('phaseId') phaseId: number, @Req() req: RequestWithUser) {
    // const userId = req.user.id;
    return this.evaluationService.getCompletePhaseData(phaseId);
  }

  // Get all data for entire assessment (all phases with complete data)
  @Get('/complete-assessment')
  @ApiOperation({ summary: 'Get complete assessment data (all phases)' })
  @ApiResponse({ status: 200, description: 'Complete assessment data retrieved successfully' })
  async getCompleteAssessment(@Req() req: RequestWithUser) {
    // const userId = req.user.id;
    return this.evaluationService.getCompleteAssessment();
  }

  // Calculate progress from selected answers
  @UseGuards(JwtBlacklistGuard)
  @Post('/answers')
  @ApiOperation({ summary: 'Calculate progress from selected answers' })
  @ApiResponse({ status: 201, description: 'Progress calculated successfully' })
  async calculateProgress(@Body() calculateData: CalculateProgressDto, @Req() req: RequestWithUser) {
    console.log('Full request user object:', req.user);
    console.log('Request headers:', req.headers.authorization);
    
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not found in request. Please check your JWT token.');
    }
    
    const userId = req.user.id;
    console.log('User ID extracted:', userId);

    return this.evaluationService.progressCalculation(calculateData, userId);
  }

  // Get progress for the current user
  @UseGuards(JwtBlacklistGuard)
  @Get(':id/progress')
  @ApiOperation({ summary: 'Get progress for the current user' })
  @ApiResponse({ status: 200, description: 'User progress retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No progress data found' })
  async getUserProgress(@Param('id') id: number, @Req() req: RequestWithUser) {
    // const userId = req.user.id;
    return this.evaluationService.getUserProgress(id);
  }
}