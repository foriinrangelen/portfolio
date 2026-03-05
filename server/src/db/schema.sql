DROP TABLE IF EXISTS portfolio_techs;
DROP TABLE IF EXISTS portfolio_sections;
DROP TABLE IF EXISTS portfolios;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'guest',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE portfolios (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  detail TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  github TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE portfolio_sections (
  id TEXT NOT NULL,
  portfolio_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  image TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (portfolio_id, id),
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);

CREATE TABLE portfolio_techs (
  portfolio_id TEXT NOT NULL,
  name TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (portfolio_id, name),
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);

INSERT INTO users (username, password, role) VALUES ('admin', '!admin124', 'admin');
INSERT INTO users (username, password, role) VALUES ('guest', '123123', 'guest');
