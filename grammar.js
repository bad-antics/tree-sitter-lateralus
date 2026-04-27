/**
 * tree-sitter-lateralus
 *
 * Minimal viable tree-sitter grammar for the Lateralus systems language.
 * Scope: source.lateralus
 */

module.exports = grammar({
  name: 'lateralus',

  extras: $ => [
    /\s/,
    $.line_comment,
    $.block_comment,
  ],

  word: $ => $.identifier,

  rules: {
    source_file: $ => repeat($._top_level),

    _top_level: $ => choice(
      $.import_decl,
      $.function_decl,
      $.struct_decl,
      $.enum_decl,
      $.const_decl,
      $.let_decl,
      $.impl_block,
      $.type_alias,
    ),

    line_comment: $ => token(seq('//', /.*/)),
    block_comment: $ => token(seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')),

    // -- imports -----------------------------------------------------------
    import_decl: $ => seq(
      choice('import', 'use'),
      $.path,
    ),

    path: $ => seq(
      $.identifier,
      repeat(seq('::', $.identifier)),
    ),

    // -- functions ---------------------------------------------------------
    function_decl: $ => seq(
      optional($.visibility),
      'fn',
      field('name', $.identifier),
      field('params', $.parameter_list),
      optional(seq('->', field('return_type', $._type))),
      field('body', $.block),
    ),

    parameter_list: $ => seq(
      '(',
      optional(seq(
        $.parameter,
        repeat(seq(',', $.parameter)),
        optional(','),
      )),
      ')',
    ),

    parameter: $ => seq(
      optional('mut'),
      field('name', $.identifier),
      ':',
      field('type', $._type),
    ),

    // -- structs / enums ---------------------------------------------------
    struct_decl: $ => seq(
      optional($.visibility),
      'struct',
      field('name', $.identifier),
      '{',
      repeat(seq($.field_decl, optional(','))),
      '}',
    ),

    field_decl: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', $._type),
    ),

    enum_decl: $ => seq(
      optional($.visibility),
      'enum',
      field('name', $.identifier),
      '{',
      repeat(seq($.identifier, optional(','))),
      '}',
    ),

    impl_block: $ => seq(
      'impl',
      field('target', $.identifier),
      '{',
      repeat($.function_decl),
      '}',
    ),

    type_alias: $ => seq(
      optional($.visibility),
      'type',
      field('name', $.identifier),
      '=',
      $._type,
    ),

    // -- bindings ----------------------------------------------------------
    const_decl: $ => seq(
      optional($.visibility),
      'const',
      field('name', $.identifier),
      optional(seq(':', field('type', $._type))),
      '=',
      field('value', $._expression),
    ),

    let_decl: $ => seq(
      'let',
      optional('mut'),
      field('name', $.identifier),
      optional(seq(':', field('type', $._type))),
      optional(seq('=', field('value', $._expression))),
    ),

    visibility: $ => choice('pub', 'priv', 'extern'),

    // -- types -------------------------------------------------------------
    _type: $ => choice(
      $.primitive_type,
      $.path,
      $.generic_type,
      $.reference_type,
      $.tuple_type,
    ),

    primitive_type: $ => choice(
      'bool', 'str', 'string', 'char',
      'int', 'i8', 'i16', 'i32', 'i64', 'i128', 'isize',
      'uint', 'u8', 'u16', 'u32', 'u64', 'u128', 'usize',
      'f32', 'f64', 'byte', 'void', 'never', 'any',
    ),

    generic_type: $ => seq($.path, '<', $._type, repeat(seq(',', $._type)), '>'),
    reference_type: $ => seq('&', optional('mut'), $._type),
    tuple_type: $ => seq('(', optional(seq($._type, repeat(seq(',', $._type)))), ')'),

    // -- block / expressions ----------------------------------------------
    block: $ => seq('{', repeat($._statement), '}'),

    _statement: $ => choice(
      $.let_decl,
      $.const_decl,
      $.return_statement,
      $.expression_statement,
      $.if_expression,
      $.while_loop,
      $.for_loop,
      $.match_expression,
    ),

    return_statement: $ => prec.right(seq('return', optional($._expression))),
    expression_statement: $ => $._expression,

    if_expression: $ => seq(
      'if', $._expression, $.block,
      repeat(seq('else', 'if', $._expression, $.block)),
      optional(seq('else', $.block)),
    ),

    while_loop: $ => seq('while', $._expression, $.block),
    for_loop: $ => seq('for', $.identifier, 'in', $._expression, $.block),

    match_expression: $ => seq(
      'match', $._expression,
      '{',
      repeat(seq($._expression, '=>', $._expression, optional(','))),
      '}',
    ),

    _expression: $ => choice(
      $.string_literal,
      $.number_literal,
      $.boolean_literal,
      $.null_literal,
      $.call_expression,
      $.field_access,
      $.binary_expression,
      $.pipeline_expression,
      $.parenthesized_expression,
      $.path,
    ),

    parenthesized_expression: $ => seq('(', $._expression, ')'),
    call_expression: $ => prec.left(10, seq($._expression, '(', optional(seq($._expression, repeat(seq(',', $._expression)))), ')')),
    field_access: $ => prec.left(11, seq($._expression, '.', $.identifier)),

    binary_expression: $ => choice(
      prec.left(1, seq($._expression, choice('||'), $._expression)),
      prec.left(2, seq($._expression, choice('&&'), $._expression)),
      prec.left(3, seq($._expression, choice('==', '!=', '<', '>', '<=', '>='), $._expression)),
      prec.left(4, seq($._expression, choice('+', '-'), $._expression)),
      prec.left(5, seq($._expression, choice('*', '/', '%'), $._expression)),
    ),

    pipeline_expression: $ => prec.left(0, seq($._expression, '|>', $._expression)),

    // -- literals ----------------------------------------------------------
    string_literal: $ => /"([^"\\]|\\.)*"/,
    number_literal: $ => choice(
      /0[xX][0-9a-fA-F_]+/,
      /0[bB][01_]+/,
      /0[oO][0-7_]+/,
      /[0-9][0-9_]*\.[0-9_]+([eE][+-]?[0-9]+)?/,
      /[0-9][0-9_]*/,
    ),
    boolean_literal: $ => choice('true', 'false'),
    null_literal: $ => choice('null', 'nil', 'none'),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
  },
});
