exports.up = function (knex) {
  return knex.schema.createTable("reset_password", (table) => {
    table.increments("id").primary();
    table.string("password_reset_token").notNullable();
    table.timestamp("password_reset_token_expires").notNullable();
    table.boolean("already_been_used").defaultTo(false);
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reset_password");
};
