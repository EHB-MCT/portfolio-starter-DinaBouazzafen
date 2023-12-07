/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
 exports.up = function(knex) {
    return knex.schema.table('makeup', function(table) {
      table.string('color'); // Adding a new column for color
    });
  };
  
  /**
   * @param {import("knex").Knex} knex
   * @returns {Promise<void>}
   */
  exports.down = function(knex) {
    return knex.schema.table('makeup', function(table) {
      table.dropColumn('color'); // Removing the color column
    });
  };
  