# @kristall/server

API de Kristall. NestJS 11 + TypeORM 1 sobre PostgreSQL, con caché en Redis.

## Puesta en marcha

```bash
pnpm install
cp apps/server/.env.example apps/server/.env   # rellenar credenciales
createdb kristall                              # TypeORM crea el esquema, no la base
cd apps/server
pnpm migration:run
pnpm dev
```

`migration:run` aplica todas las migraciones pendientes en orden de timestamp y las
registra en la tabla `migrations`. Para comprobar que quedó todo aplicado:

```bash
pnpm migration:show   # todas deben salir con [X]
```

La migración inicial ejecuta `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`, que requiere
permisos de superusuario en Postgres. Si el entorno usa un rol restringido, hay que crear
la extensión una vez a mano; la migración pasa de largo gracias al `IF NOT EXISTS`.

## Scripts

```bash
pnpm dev            # watch mode
pnpm build          # nest build (type check con tsc + compilación con swc)
pnpm start:prod     # ejecuta el build
pnpm test           # unit
pnpm test:e2e       # end to end
pnpm lint
```

## Migraciones

`synchronize` está desactivado en todos los entornos. El esquema solo cambia mediante
migraciones versionadas en git.

La configuración vive en `src/database/data-source.ts` y la comparten la app (vía
`TypeOrmModule.forRoot`) y el CLI de TypeORM, para que no puedan divergir. Las migraciones
están en `src/database/migrations/`.

### Cambiar o agregar un modelo

1. Edita la entidad. Por ejemplo, añadir un campo a `User`:

   ```ts
   @Column({ nullable: true })
   phone: string;
   ```

2. Genera la migración:

   ```bash
   pnpm migration:generate src/database/migrations/AddUserPhone
   ```

3. **Lee el SQL generado y corrígelo si hace falta.** Ver la sección siguiente.

4. Aplícala:

   ```bash
   pnpm migration:run
   ```

5. Commitea la entidad y la migración **en el mismo commit**. Si van separados, quien haga
   pull en medio se queda con código que espera columnas que su base no tiene.

### Revisar siempre el SQL generado

El generador compara estados, no entiende intenciones. Hay tres casos en los que produce
SQL que destruye datos o que falla al ejecutarse:

**Renombrar una columna** sale como `DROP COLUMN` + `ADD COLUMN`. Reescríbelo:

```ts
await queryRunner.query(
  `ALTER TABLE "user" RENAME COLUMN "name" TO "fullName"`,
);
```

**Columna nueva `NOT NULL` sobre una tabla con filas** falla en seco. Hazlo en tres pasos
dentro de la misma migración: añadir nullable, poblar con un `UPDATE`, y después
`SET NOT NULL`.

**Cambiar el tipo de una columna con datos** también sale como `DROP` + `ADD`. Casi siempre
lo que quieres es:

```ts
await queryRunner.query(
  `ALTER TABLE "user" ALTER COLUMN "role" TYPE character varying USING "role"::text`,
);
```

`src/database/migrations/1785458235588-AlignVarcharColumns.ts` es un ejemplo real de esto
en el repo: el generador proponía borrar y recrear `user.email`, `user.name`, `user.role` y
`account.password`, lo que habría vaciado las credenciales existentes.

### Migraciones a mano

Para lo que no se deriva de las entidades — seeds, backfills, índices, poblar una columna
nueva — el generador no sirve. Crea el archivo vacío y escribe el SQL:

```bash
pnpm migration:create src/database/migrations/BackfillUserRoles
```

### Reglas

- **Una migración aplicada es inmutable.** Si te equivocaste, otra migración encima. Editar
  una vieja hace que tu base y la de tus compañeros diverjan en silencio.
- **Escribe siempre el `down`**, aunque no lo uses. Te obliga a comprobar si el cambio es
  reversible; si no lo es, mejor saberlo antes de desplegarlo.
- **`migration:revert` es para local.** Revierte solo la última. En producción se avanza, no
  se retrocede.
- **Cambios destructivos en producción, en dos despliegues**: primero se deja de usar la
  columna, en el siguiente se borra.
- **Nunca `migrationsRun: true`.** Con varias instancias arrancando en paralelo tendrías dos
  procesos migrando a la vez.

### Base ya existente sin registro de migraciones

Si te encuentras una base creada por `synchronize` (tablas ya presentes, tabla `migrations`
vacía o inexistente), no ejecutes la migración inicial: fallaría porque los objetos ya
existen. Hay que marcarla como aplicada sin ejecutar su SQL, insertando su fila a mano:

```sql
CREATE TABLE IF NOT EXISTS "migrations" (
  "id" SERIAL NOT NULL,
  "timestamp" bigint NOT NULL,
  "name" character varying NOT NULL,
  CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")
);

INSERT INTO "migrations"("timestamp", "name")
VALUES (1785454896602, 'InitialSchema1785454896602');
```

TypeORM no tiene un equivalente a `--fake`. Después, `pnpm migration:generate` sobre un
nombre cualquiera debe responder _"No changes in database schema were found"_; si detecta
cambios, la base y las entidades no cuadran y hay que resolver el drift con una migración
antes de seguir.

## Despliegue

Las migraciones son un paso explícito del despliegue, previo al arranque de la app:

```bash
pnpm build
pnpm migration:run:prod   # usa el DataSource compilado en dist/
pnpm start:prod
```
