import "dotenv/config";
import express from "express";
import { Pool, Client } from "pg";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/utem_admisiones";
const STATE_ID = "principal";

const app = express();
app.use(express.json({ limit: "2mb" }));

let databaseReady = false;

function databaseUrlFor(databaseName) {
  const url = new URL(DATABASE_URL);
  url.pathname = `/${databaseName}`;
  return url.toString();
}

function currentDatabaseName() {
  return new URL(DATABASE_URL).pathname.replace("/", "") || "utem_admisiones";
}

function quoteIdentifier(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

async function ensureDatabase() {
  const databaseName = currentDatabaseName();
  const adminClient = new Client({ connectionString: databaseUrlFor("postgres") });

  await adminClient.connect();
  try {
    const exists = await adminClient.query("SELECT 1 FROM pg_database WHERE datname = $1", [databaseName]);
    if (!exists.rowCount) {
      await adminClient.query(`CREATE DATABASE ${quoteIdentifier(databaseName)}`);
      console.log(`Base de datos creada: ${databaseName}`);
    }
  } finally {
    await adminClient.end();
  }
}

const pool = new Pool({ connectionString: DATABASE_URL });

async function ensureSchema() {
  await pool.query(`
    CREATE SCHEMA IF NOT EXISTS admision;

    CREATE TABLE IF NOT EXISTS admision.prototipo_estado (
      id TEXT PRIMARY KEY,
      datos JSONB NOT NULL,
      actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

function validateApplicantsPayload(req, res, next) {
  if (!req.body || !Array.isArray(req.body.applicants)) {
    return res.status(400).json({ error: "El cuerpo debe incluir applicants como arreglo." });
  }
  return next();
}

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, database: currentDatabaseName() });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get("/api/prototype-state", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT datos, actualizado_en FROM admision.prototipo_estado WHERE id = $1",
      [STATE_ID]
    );

    if (!result.rowCount) {
      return res.json({ applicants: null, updatedAt: null });
    }

    return res.json({
      applicants: result.rows[0].datos.applicants || [],
      updatedAt: result.rows[0].actualizado_en,
    });
  } catch (error) {
    return res.status(503).json({ error: "PostgreSQL no disponible", detail: error.message });
  }
});

app.put("/api/prototype-state", validateApplicantsPayload, async (req, res) => {
  try {
    const payload = { applicants: req.body.applicants };
    await pool.query(
      `
        INSERT INTO admision.prototipo_estado (id, datos, actualizado_en)
        VALUES ($1, $2::jsonb, NOW())
        ON CONFLICT (id)
        DO UPDATE SET datos = EXCLUDED.datos, actualizado_en = NOW()
      `,
      [STATE_ID, JSON.stringify(payload)]
    );

    return res.json({ ok: true });
  } catch (error) {
    return res.status(503).json({ error: "PostgreSQL no disponible", detail: error.message });
  }
});

app.delete("/api/prototype-state", async (_req, res) => {
  try {
    await pool.query("DELETE FROM admision.prototipo_estado WHERE id = $1", [STATE_ID]);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(503).json({ error: "PostgreSQL no disponible", detail: error.message });
  }
});

app.use(express.static(__dirname));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

async function start() {
  try {
    await ensureSchema();
    databaseReady = true;
  } catch (error) {
    try {
      await ensureDatabase();
      await ensureSchema();
      databaseReady = true;
    } catch (fallbackError) {
      console.warn("No se pudo conectar PostgreSQL; el prototipo iniciara en modo local.");
      console.warn(fallbackError.message || error.message);
    }
  }

  app.listen(PORT, () => {
    const mode = databaseReady ? "conectado a PostgreSQL" : "sin PostgreSQL";
    console.log(`Prototipo ${mode} en http://localhost:${PORT}`);
  });
}

start();
