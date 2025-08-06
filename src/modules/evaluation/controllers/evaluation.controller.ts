import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ClientEvaluationService } from '../services/evaluation.service';
import { CalculateProgressDto } from '../dto/calculate-progress.dto';

@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: ClientEvaluationService) {}

  @Post('results')
  async calculateProgress(@Body() calculateData: CalculateProgressDto) {
    console.log(calculateData, "calculateDatacontroller");
    return this.evaluationService.progressCalculation(calculateData);
  }
}