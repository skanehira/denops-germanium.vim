import { assertEquals, Option, path } from "./deps.ts";
import { run } from "./run.ts";

Deno.test("run with full options", async () => {
  const outputFile = path.join(
    Deno.cwd(),
    "tmp.png",
  );

  const wantFile = path.join(
    Deno.cwd(),
    "denops",
    "germanium",
    "testdata",
    "want.png",
  );

  const opt: Option = {
    Input: `package main
func main() {
  println(1)
}`,
    Language: "go",
    Style: "native",
    BackgroundColor: "#b3e6ff",
    Output: "tmp.png",
  };
  const result = await run(opt);
  assertEquals(
    result.Code,
    0,
    `
    output file: ${outputFile}
    result code: ${result.Code}
    result stdout: ${result.Output}
    result stderr: ${result.StderrOutput}
    `,
  );

  const want = Deno.readFile(wantFile);
  const got = Deno.readFile(outputFile);

  await Deno.remove(outputFile);

  assertEquals(want, got);
});

Deno.test("run with specify file", async () => {
  const outputFile = path.join(
    Deno.cwd(),
    "tmp.png",
  );

  const wantFile = path.join(
    Deno.cwd(),
    "denops",
    "germanium",
    "testdata",
    "want.png",
  );

  const opt: Option = {
    InputFile: path.join(
      Deno.cwd(),
      "denops",
      "germanium",
      "testdata",
      "input.go",
    ),
    Language: "go",
    Style: "native",
    BackgroundColor: "#b3e6ff",
    Output: "tmp.png",
  };
  const result = await run(opt);
  assertEquals(
    result.Code,
    0,
    `
    output file: ${outputFile}
    result code: ${result.Code}
    result stdout: ${result.Output}
    result stderr: ${result.StderrOutput}
    `,
  );

  const want = Deno.readFile(wantFile);
  const got = Deno.readFile(outputFile);

  await Deno.remove(outputFile);

  assertEquals(want, got);
});
