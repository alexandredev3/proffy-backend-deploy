exports.up = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table
      .integer("avatar_id")
      .references("id")
      .inTable("files")
      .onUpdate("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.dropColumn("avatar_id");
  });
};
