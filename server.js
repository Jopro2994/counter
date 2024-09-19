const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Verbindung zur SQLite-Datenbank
const db = new sqlite3.Database(':memory:');

// Erstelle eine Tabelle für den Zähler
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS counter (value INTEGER)");
    db.run("INSERT INTO counter (value) VALUES (0)");
});

app.use(express.static('public'));

// API-Endpunkt zum Abrufen des Zählerstandes
app.get('/counter', (req, res) => {
    db.get("SELECT value FROM counter", (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ counter: row.value });
    });
});

// API-Endpunkt zum Erhöhen des Zählerstandes
app.post('/increment', (req, res) => {
    db.run("UPDATE counter SET value = value + 1", function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        db.get("SELECT value FROM counter", (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ counter: row.value });
        });
    });
});

// API-Endpunkt zum Zurücksetzen des Zählerstandes
app.post('/reset', (req, res) => {
    db.run("UPDATE counter SET value = 0", function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        db.get("SELECT value FROM counter", (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ counter: row.value });
        });
    });
});

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});
