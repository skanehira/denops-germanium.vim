import { buildOption } from "./builder.ts";
import { assertEquals, assertThrowsAsync, Option, test } from "./deps.ts";

test({
  mode: "all",
  name: "build full option",
  fn: async (denops) => {
    await denops.cmd(`new a.go`);
    await denops.call("setline", 1, [
      "package main",
      "func main() {",
      "\tprintln(1)",
      "}",
    ]);
    const got = await buildOption(
      denops,
      1,
      4,
      "-o=tmp.png -l=go -s=dracula -b=#fefef2 -f=Cica",
    );
    const want: Option = {
      Output: "tmp.png",
      Input: `package main
func main() {
	println(1)
}`,
      Language: "go",
      Style: "dracula",
      BackgroundColor: "#fefef2",
      Font: "Cica",
    };

    assertEquals(got, want);
  },
});

const buildOptionErrorTests = [
  {
    name: "invalid arg",
    arg: "-o",
    want: "failed to get option or value: -o",
  },
  {
    name: "without arg",
    arg: "",
    want: "failed to get file path",
  },
];

for (const tt of buildOptionErrorTests) {
  test({
    mode: "all",
    name: test.name,
    fn: async (denops) => {
      await assertThrowsAsync(
        async () => {
          await buildOption(denops, 1, 1, tt.arg);
        },
        Error,
        tt.want,
      );
    },
  });
}

test({
  mode: "all",
  name: "get file extension error",
  fn: async (denops) => {
    await denops.cmd("new test");
    await assertThrowsAsync(
      async () => {
        await buildOption(denops, 1, 1, "");
      },
      Error,
      "failed to get file extension. filetype is undefined",
    );
  },
});

test({
  mode: "all",
  name: "build option with modified buffer",
  fn: async (denops) => {
    await denops.cmd("new a.go | setlocal ft=go");
    await denops.call("setline", 1, ["package main", "const i = 1"]);
    const result = await buildOption(denops, 1, 2, undefined);
    const want: Option = {
      Language: "go",
      Style: "native",
      Input: "package main\nconst i = 1",
    };
    assertEquals(result, want);
  },
});

test({
  mode: "all",
  name: "build option with specify range",
  fn: async (denops) => {
    await denops.cmd("new a.go | setlocal ft=go");
    await denops.call("setline", 1, [
      "package main",
      "const i = 1",
      "const j = 2",
    ]);
    const result = await buildOption(denops, 1, 2, undefined);
    const want: Option = {
      Language: "go",
      Style: "native",
      Input: "package main\nconst i = 1",
    };
    assertEquals(result, want);
  },
});
