"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.alterTable('users', table => {
        table.integer('avatar_id')
            .references('id')
            .inTable('files')
            .onUpdate('CASCADE');
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.alterTable('users', table => {
        table.dropColumn('avatar_id');
    });
}
exports.down = down;
