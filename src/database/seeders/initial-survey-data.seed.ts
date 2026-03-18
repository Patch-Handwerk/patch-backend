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

    // Helper: upsert a phase (create or update translationKey)
    const upsertPhase = async (name: string, translationKey: string) => {
      let phase = await phaseRepo.findOne({ where: { name } });
      if (!phase) {
        phase = await phaseRepo.save({ name, translationKey });
      } else if (phase.translationKey !== translationKey) {
        phase.translationKey = translationKey;
        phase = await phaseRepo.save(phase);
      }
      return phase;
    };

    // Helper: upsert a subphase (create or update translationKey)
    const upsertSubPhase = async (name: string, translationKey: string, parentPhase: Phase) => {
      let subPhase = await subPhaseRepo.findOne({
        where: { name, parentPhase: { id: parentPhase.id } }
      });
      if (!subPhase) {
        subPhase = await subPhaseRepo.save({ name, translationKey, parentPhase });
      } else if (subPhase.translationKey !== translationKey) {
        subPhase.translationKey = translationKey;
        subPhase = await subPhaseRepo.save(subPhase);
      }
      return subPhase;
    };

    // Helper: upsert a question (create or update translationKey)
    const upsertQuestion = async (
      questionText: string,
      translationKey: string,
      subPhase: SubPhase,
      sortId: number,
    ) => {
      let question = await questionRepo.findOne({
        where: { subPhase: { id: subPhase.id } }
      });
      if (!question) {
        question = await questionRepo.save({
          question: questionText,
          translationKey,
          sortId,
          subPhase,
        });
      } else if (question.translationKey !== translationKey) {
        question.translationKey = translationKey;
        question = await questionRepo.save(question);
      }
      return question;
    };

    // Helper: upsert an answer (create or update translation key columns)
    const upsertAnswer = async (
      answerText: string,
      answerTranslationKey: string,
      question: Question,
      point: number,
      level: number,
      stage: string,
      stageKey: string,
      description: string,
      descriptionKey: string,
      isStopAnswer: boolean = false,
    ) => {
      let answer = await answerRepo.findOne({
        where: { answer: answerText, question: { id: question.id } }
      });
      if (!answer) {
        answer = await answerRepo.save({
          answer: answerText,
          answerTranslationKey,
          point,
          is_stop_answer: isStopAnswer,
          question,
          level,
          stage,
          stageKey,
          description,
          descriptionKey,
        });
      } else {
        // Update key columns if they differ (e.g. after re-seeding with new keys)
        let dirty = false;
        if (answer.answerTranslationKey !== answerTranslationKey) { answer.answerTranslationKey = answerTranslationKey; dirty = true; }
        if (answer.stageKey !== stageKey) { answer.stageKey = stageKey; dirty = true; }
        if (answer.descriptionKey !== descriptionKey) { answer.descriptionKey = descriptionKey; dirty = true; }
        if (dirty) answer = await answerRepo.save(answer);
      }
      return answer;
    };

    // Helper: upsert a stage (create or update translationKey)
    const upsertStage = async (
      name: string,
      translationKey: string,
      minimumToAchieve: number,
      maximumToAchieve: number,
    ) => {
      let stage = await stageRepo.findOne({ where: { name } });
      if (!stage) {
        stage = await stageRepo.save({ name, translationKey, minimum_to_achieve: minimumToAchieve, maximum_to_achieve: maximumToAchieve });
      } else if (stage.translationKey !== translationKey) {
        stage.translationKey = translationKey;
        stage = await stageRepo.save(stage);
      }
      return stage;
    };

    // Seed phases, subphases, questions, and answers from data
    for (const phaseData of phasesData) {
      const phase = await upsertPhase(phaseData.name, phaseData.translationKey);

      for (const subPhaseData of phaseData.subphases) {
        const subPhase = await upsertSubPhase(subPhaseData.name, subPhaseData.translationKey, phase);
        const question = await upsertQuestion(
          subPhaseData.question.text,
          subPhaseData.question.translationKey,
          subPhase,
          subPhaseData.question.sortId,
        );

        for (const answerLevel of subPhaseData.question.answerLevels) {
          for (const answerData of answerLevel.answers) {
            await upsertAnswer(
              answerData.text,
              answerData.translationKey,
              question,
              answerData.point,
              answerLevel.level,
              answerLevel.stage,
              answerLevel.stageKey,
              answerLevel.description,
              answerLevel.descriptionKey,
              answerData.isStopAnswer || false,
            );
          }
        }
      }
    }

    // Seed stages
    for (const stageData of stagesData) {
      await upsertStage(
        stageData.name,
        stageData.translationKey,
        stageData.minimumToAchieve,
        stageData.maximumToAchieve,
      );
    }

    console.log("✅ Seeding completed successfully!");
  }
}
