---
name: db-migration
description: >
  Creer et valider des migrations Prisma PostgreSQL.
  Utiliser quand on ajoute/modifie des tables, des colonnes, des index,
  ou qu'on cree le schema initial.
  Triggers : "migration", "schema", "base de donnees", "ajouter une table", "ajouter un champ".
---

# Prisma Migration -- Bonnes pratiques PostgreSQL

## Types obligatoires

| Donnee | Type Prisma | Type PostgreSQL |
|--------|-------------|-----------------|
| Identifiants | `String @id @default(uuid()) @db.Uuid` | `UUID` |
| Prix/Montants | `Int` (centimes) | `INTEGER` |
| Dates | `DateTime @db.Timestamptz()` | `TIMESTAMPTZ` |
| Texte libre | `String` (sans @db.VarChar) | `TEXT` |
| JSON structure | `Json @default("{}") @db.JsonB` | `JSONB` |
| Booleens | `Boolean @default(false)` | `BOOLEAN` |
| Statuts | `enum` Prisma | `TEXT` avec CHECK |

## Nommage
- Models : `PascalCase` + `@@map("snake_case")`
- Champs : `camelCase` + `@map("snake_case")`
- Tables de liaison : `{table1}_{table2}` en snake_case

## Index obligatoires
- Toute foreign key doit avoir un `@@index([fkField])`
- Requetes frequentes : index composite dans l'ordre de selectivite
- Filtres recurrents : index partiel si possible
- Recherche texte : GIN index sur `to_tsvector` (migration SQL raw)

## Exemple de schema

```prisma
model Bike {
  id             String     @id @default(uuid()) @db.Uuid
  name           String     @map("name")
  brand          String     @map("brand")
  model          String     @map("model_name")
  type           BikeType   @map("type")
  size           String     @map("size")
  priceCents     Int        @map("price_cents")
  dailyRateCents Int        @map("daily_rate_cents")
  status         BikeStatus @default(AVAILABLE) @map("status")
  metadata       Json       @default("{}") @map("metadata") @db.JsonB
  createdAt      DateTime   @default(now()) @map("created_at") @db.Timestamptz()
  updatedAt      DateTime   @updatedAt @map("updated_at") @db.Timestamptz()

  @@index([status])
  @@index([type, status])
  @@index([brand, model])
  @@map("bikes")
}
```

## Process post-migration
1. `pnpm prisma migrate dev --name {description}`
2. Verifier le SQL genere dans `prisma/migrations/`
3. `pnpm prisma generate`
4. Ajouter manuellement index partiels, GIN, CHECK si necessaire
