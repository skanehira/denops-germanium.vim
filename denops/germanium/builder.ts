import { Denops, isString, Option, Style } from "./deps.ts";

export async function buildOption(
  denops: Denops,
  start: number,
  end: number,
  args: unknown,
): Promise<Option> {
  const option: Option = {
    Language: "",
    Style: "native",
  };

  if (isString(args)) {
    for (const arg of args.split(" ")) {
      if (isOption(arg)) {
        const [key, value] = arg.split("=");
        if (!key || !value) {
          throw new Error(`failed to get option or value: ${arg}`);
        }
        switch (key) {
          case "-o":
            option["Output"] = value;
            break;
          case "-b":
            option["BackgroundColor"] = value;
            break;
          case "-f":
            option["Font"] = value;
            break;
          case "-l":
            option["Language"] = value;
            break;
          case "-s":
            option["Style"] = value as Style;
            break;
        }
      }
    }
  }

  if (start === end && !await denops.eval("&modified")) {
    const file = await denops.call("expand", "%:p") as string;

    try {
      await Deno.lstat(file);
      option["InputFile"] = file;
    } catch (err) {
      // fallback if file is not exists
      if (err instanceof Deno.errors.NotFound) {
        option.Input = (await denops.eval(`getline(1, "$")`) as string[]).join(
          "\n",
        );
      } else {
        throw err;
      }
    }
  } else {
    const input = await denops.eval(`getline(${start}, ${end})`) as string[];
    option["Input"] = input.join("\n");
  }

  if (!option.Language) {
    let ft = await denops.eval("&ft") as string;
    if (ft === "") {
      ft = await denops.eval("&buftype") === "terminal" ? "sh" : "noop";
    }
    option["Language"] = ft;
  }

  return option;
}

function isOption(v: string): boolean {
  return v.substr(0, 1) === "-";
}
