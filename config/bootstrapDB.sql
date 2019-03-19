-- Create table here

DROP TABLE IF EXISTS todos;

CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  todo_priority integer NOT NULL,
  title varchar(255) NOT NULL,
  done boolean NOT NULL DEFAULT FALSE,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone
);
