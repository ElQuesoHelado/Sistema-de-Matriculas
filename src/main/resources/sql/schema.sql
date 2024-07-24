ALTER TABLE "curso"
DROP CONSTRAINT IF EXISTS "curso_fk5";

ALTER TABLE "matricula"
DROP CONSTRAINT IF EXISTS "matricula_fk0";

ALTER TABLE "matricula"
DROP CONSTRAINT IF EXISTS "matricula_fk1";

DROP TABLE IF EXISTS "alumno" CASCADE;

DROP TABLE IF EXISTS "curso" CASCADE;

DROP TABLE IF EXISTS "matricula" CASCADE;

DROP TABLE IF EXISTS "docente" CASCADE;

CREATE TABLE IF NOT EXISTS "alumno" (
	"cui" bigint NOT NULL,
	"dni" bigint NOT NULL,
	"pnombre" text NOT NULL,
	"snombre" text,
	"papellido" text NOT NULL,
	"sapellido" text,
	"email1" text NOT NULL,
	"email2" text,
	PRIMARY KEY ("cui")
);

CREATE TABLE IF NOT EXISTS "curso" (
	"codigo" bigint NOT NULL,
	"prerequisito1" bigint,
	"prerequisito2" bigint,
	"nombre" text NOT NULL,
	"creditos" smallint NOT NULL,
	"semestre" smallint NOT NULL,
	"codigo_doc" bigint NOT NULL,
	PRIMARY KEY ("codigo")
);

CREATE TABLE IF NOT EXISTS "matricula" (
	"cui" bigint NOT NULL,
	"codigo_curso" bigint NOT NULL,
	"nota1" real NOT NULL,
	"nota2" real NOT NULL,
	"nota3" real NOT NULL,
	"numero" smallint NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS "docente" (
	"dni" bigint NOT NULL,
	"pnombre" text NOT NULL,
	"snombre" text,
	"papellido" text NOT NULL,
	"sapellido" text,
	"email1" text NOT NULL,
	PRIMARY KEY ("dni")
);

ALTER TABLE "curso"
ADD CONSTRAINT "curso_fk5" FOREIGN KEY ("codigo_doc") REFERENCES "docente" ("dni");

ALTER TABLE "matricula"
ADD CONSTRAINT "matricula_fk0" FOREIGN KEY ("codigo_curso") REFERENCES "curso" ("codigo");

ALTER TABLE "matricula"
ADD CONSTRAINT "matricula_fk1" FOREIGN KEY ("cui") REFERENCES "alumno" ("cui");
