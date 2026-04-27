# tree-sitter-lateralus

Tree-sitter grammar for the [Lateralus](https://github.com/bad-antics/lateralus-lang) systems language (`.ltl`).

## Editor support

This grammar is consumed by:

- **Neovim** via [`nvim-treesitter`](https://github.com/nvim-treesitter/nvim-treesitter)
- **Helix** (drop into `runtime/grammars/`)
- **Zed** (`extensions/lateralus`)
- **Emacs** via `tree-sitter-langs`
- **GitHub** (potential future inclusion via [`github-linguist/linguist`](https://github.com/github-linguist/linguist))
- **CLI parsing** via the `tree-sitter` binary

## Build

```bash
npm install
npx tree-sitter generate
npx tree-sitter test
```

## Files

| Path | Purpose |
|---|---|
| `grammar.js` | The grammar definition |
| `queries/highlights.scm` | Syntax-highlighting query |
| `queries/folds.scm` | Code-fold ranges |
| `queries/locals.scm` | Local-scope analysis |

## Companion projects

- [lateralus-lang](https://github.com/bad-antics/lateralus-lang) — reference compiler
- [VS Code extension](https://marketplace.visualstudio.com/items?itemName=lateralus.lateralus-lang) — uses TextMate grammar from `lateralus-grammar`
- [`lateralus-grammar` (npm)](https://www.npmjs.com/package/lateralus-grammar) — TextMate grammar

## License

MIT © bad-antics
