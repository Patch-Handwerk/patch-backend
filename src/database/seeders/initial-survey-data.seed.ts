import { DataSource } from "typeorm";
import { Phase } from "../entities/phase.entity";
import { SubPhase } from "../entities/sub_phase.entity";
import { Question } from "../entities/questions.entity";
import { Answer } from "../entities/answers.entity";
import { Stage } from "../entities/stage.entity";
import { phasesData, stagesData } from "./seed-data";

export default class InitialSurveyDataSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const phaseRepo = dataSource.getRepository(Phase);
    const subPhaseRepo = dataSource.getRepository(SubPhase);
    const questionRepo = dataSource.getRepository(Question);
    const answerRepo = dataSource.getRepository(Answer);
    const stageRepo = dataSource.getRepository(Stage);

    // Helper function to get or create a phase
    const getOrCreatePhase = async (name: string) => {
      let phase = await phaseRepo.findOne({
        where: { name }
      });
      if (!phase) {
        phase = await phaseRepo.save({ name });
      }
      return phase;
    };

    // Helper function to get or create a subphase
    const getOrCreateSubPhase = async (name: string, parentPhase: Phase) => {
      let subPhase = await subPhaseRepo.findOne({
        where: { name, parentPhase: { id: parentPhase.id } }
      });
      if (!subPhase) {
        subPhase = await subPhaseRepo.save({ name, parentPhase });
      }
      return subPhase;
    };

    // Helper function to get or create a question
    const getOrCreateQuestion = async (questionText: string, subPhase: SubPhase, sortId: number) => {
      let question = await questionRepo.findOne({
        where: { subPhase: { id: subPhase.id } }
      });
      if (!question) {
        question = await questionRepo.save({
          question: questionText,
          sortId,
          subPhase,
        });
      }
      return question;
    };

    // Helper function to get or create an answer with level, stage, and description
    const getOrCreateAnswer = async (
      answerText: string, 
      question: Question, 
      point: number, 
      level: number,
      stage: string,
      description: string,
      isStopAnswer: boolean = false
    ) => {
      let answer = await answerRepo.findOne({
        where: { answer: answerText, question: { id: question.id } }
      });
      if (!answer) {
        answer = await answerRepo.save({
          answer: answerText,
          point,
          is_stop_answer: isStopAnswer,
          question,
          level,
          stage,
          description,
        });
      }
      return answer;
    };

    // Helper function to get or create a stage
    const getOrCreateStage = async (name: string, minimumToAchieve: number, maximumToAchieve: number) => {
      let stage = await stageRepo.findOne({
        where: { name }
      });
      if (!stage) {
        stage = await stageRepo.save({ name, minimum_to_achieve: minimumToAchieve, maximum_to_achieve: maximumToAchieve });
      }
      return stage;
    };

    // Seed phases, subphases, questions, and answers from data
    for (const phaseData of phasesData) {
      const phase = await getOrCreatePhase(phaseData.name);
      
      for (const subPhaseData of phaseData.subphases) {
        const subPhase = await getOrCreateSubPhase(subPhaseData.name, phase);
        const question = await getOrCreateQuestion(subPhaseData.question.text, subPhase, subPhaseData.question.sortId);
        
        // Create answers for each level in this question
        for (const answerLevel of subPhaseData.question.answerLevels) {
          console.log(`Creating answers for ${subPhaseData.name} - Level ${answerLevel.level}: ${answerLevel.description} (${answerLevel.stage})`);
          
          for (const answerData of answerLevel.answers) {
            await getOrCreateAnswer(
              answerData.text, 
              question, 
              answerData.point, 
              answerLevel.level,
              answerLevel.stage,
              answerLevel.description,
              answerData.isStopAnswer || false
            );
          }
        }
      }
    }

    // Seed stages
    for (const stageData of stagesData) {
      await getOrCreateStage(stageData.name, stageData.minimumToAchieve, stageData.maximumToAchieve);
    }

    console.log("✅ Seeding completed successfully!");
  }
}

