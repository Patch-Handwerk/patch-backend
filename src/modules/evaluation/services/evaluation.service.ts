import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phase } from 'src/database/entities/phase.entity';
import { SubPhase } from 'src/database/entities/sub_phase.entity';
import { Results } from '../../../database/entities/results.entity';
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
    @InjectRepository(Results)
    private resultsRepo: Repository<Results>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }

  async progressCalculation(calculateData: CalculateProgressDto, userId: number) {
    try {
      const { phaseName, subphaseName, questionId, questionText, selectedAnswers } = calculateData;

      // Use userId from JWT token
      // const tenantId = userId;

      // Validate input data
      if (!selectedAnswers || selectedAnswers.length === 0) {
        throw new BadRequestException('At least one answer must be selected');
      }

      if (!phaseName || !subphaseName || !questionId) {
        throw new BadRequestException('Missing required fields: phaseName, subphaseName, questionId');
      }

      // Verify user exists
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Allow users to submit multiple answers for different questions
      // Check if user already answered this specific question
      const existingProgress = await this.resultsRepo.findOne({
        where: {
          user_id: userId,
          question_id: questionId,
          phase_name: phaseName,
          subphase_name: subphaseName
        }
      });

      if (existingProgress) {
        throw new BadRequestException(`You have already submitted an answer for this question in ${phaseName} - ${subphaseName}`);
      }




      // Calculate progress percentage based on selected answers
      const totalPoints = selectedAnswers.reduce((sum, answer) => sum + answer.point, 0);

      // Use fixed maximum points for the phase (54 points total)
      const maxPossiblePoints = 54;

      // Calculate progress as percentage (0-100) based on 54 total points
      const progressPercentage = Math.round((totalPoints / maxPossiblePoints) * 100);
      const progressPercentageString = progressPercentage + `%`;

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

      // Progress percentage is already calculated above



      // Save to database with progress as percentage
      const result = this.resultsRepo.create({
        user_id: userId,
        phase_name: phaseName,
        subphase_name: subphaseName,
        progress: progressPercentageString, // Store as percentage (0-100)
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

      const response = {
        message: 'Progress calculated successfully',
        user_id: userId,
        phase_name: phaseName,
        subphase_name: subphaseName,
        question_id: questionId,
        question_text: questionText,
        selected_answer_text: selectedAnswers.map(a => a.answerText).join('; '),
        totalPoints,
        calculatedLevel: dominantLevel,
        calculatedStage: dominantStage,
        calculatedDescription: dominantDescription,
        selectedAnswersCount: selectedAnswers.length,
        progress: progressPercentage, // Progress as percentage (0-100)
      };
      return response;

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
  // Get all phases for dashboard
  async getAllPhases() {
    try {
      const phases = await this.phaseRepo.find({
        relations: ['subPhases'],
        order: { id: 'ASC' }
      });

      return {
        message: 'Phases retrieved successfully',
        data: phases.map(phase => ({
          id: phase.id,
          name: phase.name,
          subphasesCount: phase.subPhases?.length || 0
        })),
        totalPhases: phases.length
      };
    } catch (error) {
      console.error('Error fetching phases:', error);
      throw new InternalServerErrorException('Failed to fetch phases');
    }
  }

  // Get subphases for a specific phase
  async getSubphasesByPhase(phaseId: number) {
    try {
      const phase = await this.phaseRepo.findOne({
        where: { id: phaseId },
        relations: ['subPhases']
      });

      if (!phase) {
        throw new NotFoundException(`Phase with ID ${phaseId} not found`);
      }

      // Sort subphases by ID
      const sortedSubphases = phase.subPhases.sort((a, b) => a.id - b.id);

      return {
        message: 'Subphases retrieved successfully',
        phase: {
          id: phase.id,
          name: phase.name
        },
        data: sortedSubphases.map(subphase => ({
          id: subphase.id,
          name: subphase.name
        })),
        totalSubphases: phase.subPhases.length
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error fetching subphases:', error);
      throw new InternalServerErrorException('Failed to fetch subphases');
    }
  }

  // Get question and answers for a specific subphase
  async getQuestionBySubphase(subphaseId: number) {
    try {
      const subphase = await this.subPhaseRepo.findOne({
        where: { id: subphaseId },
        relations: ['question', 'question.answers']
      });

      if (!subphase) {
        throw new NotFoundException(`Subphase with ID ${subphaseId} not found`);
      }

      if (!subphase.question) {
        throw new NotFoundException(`No question found for subphase ${subphaseId}`);
      }

      // Sort answers by point value and group by level
      const sortedAnswers = subphase.question.answers.sort((a, b) => a.point - b.point);

      // Group answers by level for better organization
      const answersByLevel = {};
      sortedAnswers.forEach(answer => {
        const level = answer.level || 1;
        if (!answersByLevel[level]) {
          answersByLevel[level] = [];
        }
        answersByLevel[level].push({
          id: answer.id,
          answer: answer.answer,
          point: answer.point,
          isStopAnswer: answer.is_stop_answer,
          level: answer.level,
          stage: answer.stage,
          description: answer.description
        });
      });

      return {
        message: 'Question and answers retrieved successfully',
        subphase: {
          id: subphase.id,
          name: subphase.name
        },
        question: {
          id: subphase.question.id,
          question: subphase.question.question,
          sortId: subphase.question.sortId
        },
        answersByLevel,
        totalAnswers: subphase.question.answers.length,
        levelsCount: Object.keys(answersByLevel).length
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error fetching question:', error);
      throw new InternalServerErrorException('Failed to fetch question and answers');
    }
  }

  // Get complete data for a specific phase
  async getCompletePhaseData(phaseId: number) {
    try {
      const phase = await this.phaseRepo.findOne({
        where: { id: phaseId },
        relations: [
          'subPhases',
          'subPhases.question',
          'subPhases.question.answers'
        ],
        order: {
          id: 'ASC'
        }
      });

      if (!phase) {
        throw new NotFoundException(`Phase with ID ${phaseId} not found`);
      }

      // Sort subphases by ID
      const sortedSubphases = phase.subPhases.sort((a, b) => a.id - b.id);

      const subphasesWithData = sortedSubphases.map(subphase => {
        const answersByLevel = {};
        // Sort answers by point value
        const sortedAnswers = subphase.question?.answers?.sort((a, b) => a.point - b.point) || [];

        sortedAnswers.forEach(answer => {
          const level = answer.level || 1;
          if (!answersByLevel[level]) {
            answersByLevel[level] = [];
          }
          answersByLevel[level].push({
            id: answer.id,
            answer: answer.answer,
            point: answer.point,
            isStopAnswer: answer.is_stop_answer,
            level: answer.level,
            stage: answer.stage,
            description: answer.description
          });
        });

        return {
          id: subphase.id,
          name: subphase.name,
          question: subphase.question ? {
            id: subphase.question.id,
            question: subphase.question.question,
            sortId: subphase.question.sortId,
            answersByLevel,
            totalAnswers: subphase.question.answers?.length || 0
          } : null
        };
      });

      return {
        message: 'Complete phase data retrieved successfully',
        phase: {
          id: phase.id,
          name: phase.name
        },
        subphases: subphasesWithData,
        totalSubphases: phase.subPhases.length
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error fetching complete phase data:', error);
      throw new InternalServerErrorException('Failed to fetch complete phase data');
    }
  }

  // Get progress for a specific user
  async getUserProgress(userId: number) {
    try {
      const userResults = await this.resultsRepo.find({
        where: { user_id: userId },
        order: { created_at: 'DESC' }
      });

      if (!userResults || userResults.length === 0) {
        return {
          message: 'No progress data found for this user',
          data: [],
          totalResults: 0
        };
      }

      return {
        message: 'User progress retrieved successfully',
        data: userResults.map(result => ({
          id: result.id,
          phaseName: result.phase_name,
          subphaseName: result.subphase_name,
          progress: result.progress,
          level: result.level,
          stage: result.stage,
          description: result.description,
          totalPoints: result.total_points,
          selectedAnswers: result.selected_answer_text,
          createdAt: result.created_at
        })),
        totalResults: userResults.length
      };
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw new InternalServerErrorException('Failed to fetch user progress');
    }
  }

  // Get complete assessment data (all phases)
  async getCompleteAssessment() {
    try {
      const phases = await this.phaseRepo.find({
        relations: [
          'subPhases',
          'subPhases.question',
          'subPhases.question.answers'
        ],
        order: {
          id: 'ASC'
        }
      });

      const phasesWithData = phases.map(phase => {
        // Sort subphases by ID
        const sortedSubphases = phase.subPhases.sort((a, b) => a.id - b.id);

        const subphasesWithData = sortedSubphases.map(subphase => {
          const answersByLevel = {};
          // Sort answers by point value
          const sortedAnswers = subphase.question?.answers?.sort((a, b) => a.point - b.point) || [];

          sortedAnswers.forEach(answer => {
            const level = answer.level || 1;
            if (!answersByLevel[level]) {
              answersByLevel[level] = [];
            }
            answersByLevel[level].push({
              id: answer.id,
              answer: answer.answer,
              point: answer.point,
              isStopAnswer: answer.is_stop_answer,
              level: answer.level,
              stage: answer.stage,
              description: answer.description
            });
          });

          return {
            id: subphase.id,
            name: subphase.name,
            question: subphase.question ? {
              id: subphase.question.id,
              question: subphase.question.question,
              sortId: subphase.question.sortId,
              answersByLevel,
              totalAnswers: subphase.question.answers?.length || 0
            } : null
          };
        });

        return {
          id: phase.id,
          name: phase.name,
          subphases: subphasesWithData,
          totalSubphases: phase.subPhases.length
        };
      });

      return {
        message: 'Complete assessment data retrieved successfully',
        phases: phasesWithData,
        totalPhases: phases.length,
        totalSubphases: phases.reduce((sum, phase) => sum + phase.subPhases.length, 0)
      };
    } catch (error) {
      console.error('Error fetching complete assessment:', error);
      throw new InternalServerErrorException('Failed to fetch complete assessment data');
    }
  }
}