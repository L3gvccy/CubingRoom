import { Penalty } from "src/generated/prisma/enums";

export class SolveDto {
  time: number;
  penalty: Penalty;
  finalTime: number;
}
