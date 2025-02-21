import { Hono } from "hono";
import { getPool } from "../lib/client.js";

export const routerPersonal = new Hono();

routerPersonal.get("/", async (c) => {
  const queryResult = await getPool().query('SELECT * FROM "Personal"');
  return c.json(queryResult.rows);
});

routerPersonal.post("/", async (c) => {
  const requestPersonal = await c.req.json();
  const text = `INSERT INTO "Personal"(name, rolle, gehalt) VALUES ($1,$2,$3) RETURNING *`;
  const values = [
    requestPersonal.name,
    requestPersonal.rolle,
    requestPersonal.gehalt,
  ];
  const response = await getPool().query(text, values);
  return c.json(response.rows);
});

routerPersonal.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const text = `DELETE FROM "Personal" WHERE id = $1 RETURNING *`;
  const values = [id];

  const result = await getPool().query(text, values);

  if (result.rowCount === 0) {
    return c.json({ message: "Kein Eintrag gefunden" }, 404);
  }

  return c.json({
    message: "Eintrag erfolgreich gelöscht",
    deleted: result.rows[0],
  });
});
