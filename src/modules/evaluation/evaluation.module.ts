import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Phase } from "src/database/entities/phase.entity";
import { SubPhase } from "src/database/entities/sub_phase.entity";
import { ClientEvaluationAnswer } from "src/database/entities/client_evaluation_answer.entity";
import { ClientEvaluationQuestion } from "src/database/entities/client_evaluation_question.entity";
import { EvaluationController } from "./controllers/evaluation.controller";
import { ClientEvaluationService } from "./services/evaluation.service";
import { Stage } from "src/database/entities/stage.entity";
import { ClientAnswer } from "src/database/entities/client_answer.entity";
import { User } from "src/database/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Phase, SubPhase, ClientEvaluationQuestion, ClientEvaluationAnswer, Stage, ClientAnswer, User]),
  ],
  controllers: [EvaluationController],
  providers: [ClientEvaluationService],
})
export class EvaluationModule {}
