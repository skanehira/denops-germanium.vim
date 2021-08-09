import { Option } from "./deps.ts";

export interface Result {
  Code: number;
  Output: string;
  StderrOutput: string;
}

export async function run(op: Option): Promise<Result> {
  // build command
  const cmd = ["germanium"];
  if (op.Output) {
    cmd.push("-o", op.Output);
  } else {
    cmd.push("-c");
  }
  if (op.Style) {
    cmd.push("-s", op.Style);
  }
  if (op.Font) {
    cmd.push("-f", op.Font);
  }
  if (op.BackgroundColor) {
    cmd.push("-b", op.BackgroundColor);
  }
  cmd.push("-l", op.Language);

  // run command
  const runopt: Deno.RunOptions = {
    cmd: cmd,
    stdout: "piped",
    stderr: "piped",
  };
  if (op.InputFile) {
    cmd.push(op.InputFile);
  } else {
    runopt["stdin"] = "piped";
  }

  const p = Deno.run(runopt);
  if (p.stdin) {
    const input = new TextEncoder().encode(op.Input);
    await p.stdin.write(input);
    p.stdin.close();
  }

  const status = await p.status();
  const decoder = new TextDecoder();
  const result: Result = {
    Code: status.code,
    Output: decoder.decode(await p.output()),
    StderrOutput: decoder.decode(await p.stderrOutput()),
  };

  p.close();
  return result;
}
