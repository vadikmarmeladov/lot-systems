// LOT SYSTEMS CORPORATION — COSMO® CIA Device Tables Migration
// Adds DeviceToken, DeviceLog, and PairingToken tables for CIA device API

'use strict';

/** @param {import('knex').Knex} knex */
exports.up = async function (knex) {
  // Pairing tokens — short-lived, single-use, issued from Settings → Devices
  await knex.schema.createTable('pairing_tokens', (t) => {
    t.string('id').primary().notNullable();
    t.string('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('token').notNullable().unique();
    t.timestamp('used_at').nullable();
    t.timestamp('expires_at').notNullable();
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    t.index('token');
    t.index('user_id');
  });

  // Device tokens — permanent per-device, issued at registration
  await knex.schema.createTable('device_tokens', (t) => {
    t.string('id').primary().notNullable();
    t.string('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('device_id').notNullable().unique();
    t.string('token').notNullable().unique();
    t.string('firmware_version').nullable();
    t.string('hardware_rev').nullable();
    t.string('mac_address').nullable();
    t.string('display_name').nullable();           // e.g. "Vadik's CIA"
    t.timestamp('last_seen_at').nullable();
    t.integer('battery_pct').nullable();
    t.float('temp_c').nullable();
    t.float('humidity_pct').nullable();
    t.float('pressure_hpa').nullable();
    t.boolean('weather_sync_enabled').notNullable().defaultTo(true);
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    t.index('user_id');
    t.index('token');
  });

  // Device log entries — records COPY button presses and other device actions
  await knex.schema.createTable('device_logs', (t) => {
    t.string('id').primary().notNullable();
    t.string('device_token_id').notNullable().references('id').inTable('device_tokens').onDelete('CASCADE');
    t.string('action').notNullable();             // 'copy', 'camera', 'weather'
    t.string('notification_id').nullable();
    t.text('notification_text').nullable();
    t.float('weather_temp').nullable();
    t.float('weather_humidity').nullable();
    t.float('weather_pressure').nullable();
    t.timestamp('device_timestamp').nullable();   // timestamp from device
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    t.index('device_token_id');
    t.index('created_at');
  });
};

/** @param {import('knex').Knex} knex */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('device_logs');
  await knex.schema.dropTableIfExists('device_tokens');
  await knex.schema.dropTableIfExists('pairing_tokens');
};
