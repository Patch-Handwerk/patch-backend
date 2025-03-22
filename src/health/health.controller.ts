import { Controller, Get } from "@nestjs/common";
import { timestamp } from "rxjs";

@Controller('health-check') //Controller decorater 
export class HealthController{

    @Get() //Get decorator for our request handler 
    async healthCheck() {
        return {status: 'OK', timestamp: new Date().getTime()};
    }
}