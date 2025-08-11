import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Phase } from "src/database/entities/phase.entity";
import { SubPhase } from "src/database/entities/sub_phase.entity";
import { Answer } from "src/database/entities/answers.entity";
import { Question } from "src/database/entities/questions.entity";
import { EvaluationController } from "./controllers/evaluation.controller";
import { ClientEvaluationService } from "./services/evaluation.service";
import { Stage } from "src/database/entities/stage.entity";
import { Results } from "src/database/entities/results.entity";
import { User } from "src/database/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Phase, SubPhase, Question, Answer, Stage, Results, User]),
  ],
  controllers: [EvaluationController],
  providers: [ClientEvaluationService],
})
export class EvaluationModule {}
