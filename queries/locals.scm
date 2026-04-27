; Local-scope queries for Lateralus

(function_decl) @local.scope
(impl_block) @local.scope
(block) @local.scope
(match_expression) @local.scope

(parameter name: (identifier) @local.definition)
(let_decl   name: (identifier) @local.definition)
(const_decl name: (identifier) @local.definition)

(identifier) @local.reference
