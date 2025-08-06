import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Phase } from 'src/database/entities/phase.entity';
import { SubPhase } from 'src/database/entities/sub_phase.entity';
import { ClientEvaluationQuestion } from 'src/database/entities/client_evaluation_question.entity';
import { ClientEvaluationAnswer } from 'src/database/entities/client_evaluation_answer.entity';
import { ClientAnswer } from '../../../database/entities/client_answer.entity';
import { Stage } from 'src/database/entities/stage.entity';
import { User } from 'src/database/entities/user.entity';
import { CalculateProgressDto } from '../dto/calculate-progress.dto';

@Injectable()
export class ClientEvaluationService {
  constructor(
    @InjectRepository(Phase)
    private phaseRepo: Repository<Phase>,
    @InjectRepository(SubPhase)
    private subPhaseRepo: Repository<SubPhase>,
    @InjectRepository(ClientEvaluationQuestion)
    private questionRepo: Repository<ClientEvaluationQuestion>,
    @InjectRepository(ClientEvaluationAnswer)
    private answerRepo: Repository<ClientEvaluationAnswer>,
    @InjectRepository(ClientAnswer)
    private clientAnswerRepo: Repository<ClientAnswer>,
    @InjectRepository(Stage)
    private stageRepo: Repository<Stage>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async progressCalculation(calculateData: CalculateProgressDto) {
    try {
      const { tenantId, phaseName, subphaseName, questionId, questionText, selectedAnswers } = calculateData;

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
      const clientAnswer = this.clientAnswerRepo.create({
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

      await this.clientAnswerRepo.save(clientAnswer);

      return {
        message: 'Progress calculated successfully',
        totalPoints,
        calculatedLevel: dominantLevel,
        calculatedStage: dominantStage,
        calculatedDescription: dominantDescription,
        selectedAnswersCount: selectedAnswers.length
      };

    } catch (error) {
      throw new Error(`Failed to calculate progress: ${error.message}`);
    }
  }
}