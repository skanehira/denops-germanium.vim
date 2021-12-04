.PHONY: init
init:
	@repo=$$(basename `git rev-parse --show-toplevel`) && repo=($${repo/-/ }) && repo=$${repo[1]/\.*/ } && mv denops/template denops/$${repo}

.PHONY: coverage
coverage:
	@deno test --allow-all --unstable --coverage=cov
	@deno coverage cov
	@rm -rf cov

.PHONY: test
test:
	@deno test --allow-all --unstable

.PHONY: test-local
test-local:
	@DENOPS_PATH=$$GHQ_ROOT/github.com/vim-denops/denops.vim DENOPS_TEST_NVIM=$$(which nvim) DENOPS_TEST_VIM=$$(which vim) deno test -A --unstable --coverage=cov

.PHONY: coverage
coverage: test-local
	@deno coverage cov
	@rm -rf cov
