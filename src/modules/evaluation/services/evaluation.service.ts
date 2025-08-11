import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Phase } from 'src/database/entities/phase.entity';
import { SubPhase } from 'src/database/entities/sub_phase.entity';
import { Question } from 'src/database/entities/questions.entity';
import { Answer } from 'src/database/entities/answers.entity';
import { Results } from '../../../database/entities/results.entity';
import { Stage } from 'src/database/entities/stage.entity';
import { User } from 'src/database/entities/user.entity';
import { CalculateProgressDto } from '../dto/calculate-progress.dto';
import { HttpException } from '@nestjs/common';

@Injectable()
export class ClientEvaluationService {
  constructor(
    @InjectRepository(Phase)
    private phaseRepo: Repository<Phase>,
    @InjectRepository(SubPhase)
    private subPhaseRepo: Repository<SubPhase>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
    @InjectRepository(Answer)
    private answerRepo: Repository<Answer>,
    @InjectRepository(Results)
    private resultsRepo: Repository<Results>,
    @InjectRepository(Stage)
    private stageRepo: Repository<Stage>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async progressCalculation(calculateData: CalculateProgressDto) {
    try {
      const { tenantId, phaseName, subphaseName, questionId, questionText, selectedAnswers } = calculateData;

      // Validate input data
      if (!selectedAnswers || selectedAnswers.length === 0) {
        throw new BadRequestException('At least one answer must be selected');
      }

      if (!tenantId || !phaseName || !subphaseName || !questionId) {
        throw new BadRequestException('Missing required fields: tenantId, phaseName, subphaseName, questionId');
      }

      // Verify user exists
      const user = await this.userRepo.findOne({ where: { id: tenantId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${tenantId} not found`);
      }

      console.log(calculateData);
      // Calculate total points
      const totalPoints = selectedAnswers.reduce((sum, answer) => sum + answer.point, 0);
      console.log(totalPoints, "totalPoints");

      // Group answers by level to find dominant level
      const levelGroups = {};
      selectedAnswers.forEach(answer => {
        const level = answer.level || 1;
        if (!levelGroups[level]) {
          levelGroups[level] = {
            count: 0,
            totalPoints: 0,
            stages: {},
            descriptions: {}
          };
        }
        levelGroups[level].count++;
        levelGroups[level].totalPoints += answer.point;
        
        // Track stages and descriptions for this level
        if (answer.stage) {
          levelGroups[level].stages[answer.stage] = (levelGroups[level].stages[answer.stage] || 0) + 1;
        }
        if (answer.description) {
          levelGroups[level].descriptions[answer.description] = (levelGroups[level].descriptions[answer.description] || 0) + 1;
        }
      });

      // Find dominant level (prioritize higher levels, then count, then points)
      let dominantLevel = 1;
      let maxCount = 0;
      let maxPoints = 0;

      Object.keys(levelGroups).forEach(level => {
        const levelData = levelGroups[level];
        const levelNum = parseInt(level);
        
        // Prioritize higher levels first
        if (levelNum > dominantLevel) {
          dominantLevel = levelNum;
          maxCount = levelData.count;
          maxPoints = levelData.totalPoints;
        } else if (levelNum === dominantLevel) {
          // If same level, use count and points as tiebreaker
          if (levelData.count > maxCount || (levelData.count === maxCount && levelData.totalPoints > maxPoints)) {
            maxCount = levelData.count;
            maxPoints = levelData.totalPoints;
          }
        }
      });

      // Find dominant stage and description for the dominant level
      const dominantLevelData = levelGroups[dominantLevel];
      let dominantStage = 'Digital Apprentice'; // default
      let dominantDescription = 'Analog'; // default

      if (dominantLevelData) {
        // Find most common stage within the dominant level
        let maxStageCount = 0;
        Object.keys(dominantLevelData.stages).forEach(stage => {
          if (dominantLevelData.stages[stage] > maxStageCount) {
            dominantStage = stage;
            maxStageCount = dominantLevelData.stages[stage];
          }
        });

        // Find most common description within the dominant level
        let maxDescCount = 0;
        Object.keys(dominantLevelData.descriptions).forEach(desc => {
          if (dominantLevelData.descriptions[desc] > maxDescCount) {
            dominantDescription = desc;
            maxDescCount = dominantLevelData.descriptions[desc];
          }
        });
      }

      // Save to database
      const result = this.resultsRepo.create({
        tenant_id: tenantId,
        phase_name: phaseName,
        subphase_name: subphaseName,
        question_id: questionId,
        selected_answer_text: selectedAnswers.map(a => a.answerText).join('; '),
        selected_answer_point: totalPoints,
        total_points: totalPoints,
        level: dominantLevel,
        stage: dominantStage,
        description: dominantDescription,
        created_at: new Date()
      });

      await this.resultsRepo.save(result);

      return {
        message: 'Progress calculated successfully',
        totalPoints,
        calculatedLevel: dominantLevel,
        calculatedStage: dominantStage,
        calculatedDescription: dominantDescription,
        selectedAnswersCount: selectedAnswers.length
      };

    } catch (error) {
      // Re-throw HTTP exceptions as they are
      if (error instanceof HttpException) {
        throw error;
      }
      
      // Log the error for debugging
      console.error('Progress calculation error:', error);
      
      // Throw appropriate HTTP exception
      if (error.code === 'ER_NO_SUCH_TABLE' || error.code === 'ER_ACCESS_DENIED_ERROR') {
        throw new InternalServerErrorException('Database connection error');
      }
      
      throw new InternalServerErrorException('Failed to calculate progress');
    }
  }
}