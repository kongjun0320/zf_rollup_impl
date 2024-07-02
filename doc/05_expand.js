const ast = {
  body: ['statement1', 'statement2', 'statement3'],
};

function expandAllStatements() {
  const allStatements = [];
  ast.body.forEach((statement) => {
    let statements = expandStatement(statement);
    allStatements.push(...statements);
  });
  return allStatements;
}

function expandStatement(statement) {
  return [statement];
}
