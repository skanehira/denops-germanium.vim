import { buildOption, Denops, isNumber, run } from "./deps.ts";

export async function main(denops: Denops): Promise<void> {
  await denops.cmd(
    `command! -complete=file -nargs=* -range Germanium call denops#notify("${denops.name}", "germanium", [<line1>, <line2>, <f-args>])`,
  );

  await denops.cmd(`nnoremap <silent> <Plug>(Germanium) :<C-u>Germanium<CR>`);
  await denops.cmd(`xnoremap <silent> <Plug>(Germanium) :Germanium<CR>`);

  denops.dispatcher = {
    async germanium(start: unknown, end: unknown, arg: unknown): Promise<void> {
      if (!isNumber(start) || !isNumber(end)) {
        console.log(`start or end is not number. start: ${start}, end: ${end}`);
        return;
      }
      try {
        const option = await buildOption(denops, start, end, arg);
        const result = await run(option);
        if (result.Code !== 0) {
          console.error(result.Output, result.StderrOutput);
        } else {
          console.log(`successed`);
        }
      } catch (err) {
        console.error(err.message);
      }
    },
  };
}
