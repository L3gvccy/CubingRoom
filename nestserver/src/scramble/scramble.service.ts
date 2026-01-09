import { Injectable } from "@nestjs/common";
import { getScrambler } from "src/utils/utils";
import { getScrambles } from "cubicdb-module";

@Injectable()
export class ScrambleService {
  generateScramble(event: string) {
    const options = getScrambler(event);
    const scr = getScrambles([
      { scrambler: options.scrambler, length: options.length },
    ]);

    return { scramble: scr[0].scramble };
  }
}
