require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./pool');

const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema);

const tables = db.prepare(`
  SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;
`).all();

console.log('Tablas:', tables.map(t => t.name));
console.log('DB OK en:', process.env.DB_PATH);

try {
  db.prepare(`INSERT INTO posts (id, user_id, title, body) VALUES (1, 999, 't', 'b')`).run();
  console.log('FK NO funciona (esto no debería insertarse)');
} catch (e) {
  console.log('FK funciona: no permite post sin user');
}