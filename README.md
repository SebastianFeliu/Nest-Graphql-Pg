<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
  <a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
  <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

---

# GraphQL NestJS API

Este proyecto es una API construida con **NestJS**, **GraphQL** y **PostgreSQL**, que permite gestionar usuarios: creación, lectura, actualización, eliminación y generación masiva de datos con `faker`.

## 🚀 Características

- API con GraphQL (queries y mutations).
- Base de datos PostgreSQL vía TypeORM.
- Separación de entidades, modelos y DTOs.
- Testing completo con Jest (unitarios y E2E).
- Semilla de usuarios generados automáticamente.
- 100% de cobertura en `UserService`.

## 🛠️ Tecnologías Utilizadas

- **NestJS**
- **GraphQL** + **Apollo Server**
- **PostgreSQL** + **TypeORM**
- **Jest** para pruebas
- **faker.js** para datos de prueba

## 📂 Estructura del Proyecto

```plaintext
src/
├── app.module.ts
├── user/
│   ├── dto/              # DTOs para entrada y filtros
│   ├── models/           # Modelos GraphQL (sin ID expuesto por defecto)
│   ├── entities/         # Entidad TypeORM con ID
│   ├── user.module.ts
│   ├── user.resolver.ts
│   ├── user.service.ts
```

## ⚙️ Configuración del proyecto

```bash
$ yarn install
```

## ▶️ Ejecución

```bash
# desarrollo
$ yarn start:dev

# producción
$ yarn start:prod
```

## 🧪 Pruebas

```bash
# unitarias
$ yarn test

# end-to-end
$ yarn test:e2e

# cobertura
$ yarn test:cov
```

## 🐳 Docker (opcional)

Si deseas levantar la app con Postgres vía Docker:

```bash
$ docker-compose up --build
```

## 📬 Endpoints disponibles

```graphql
# Crear un usuario
mutation {
  createUser(input: { name: "Alice", age: 30 }) {
    id
    name
    age
  }
}

# Listar usuarios
query {
  users {
    name
    age
  }
}

# Listar usuarios con paginación (skip primeros 10, luego tomar 5)
query {
  users(limit: 5, offset: 10) {
    name
    age
  }
}

# Listar usuarios con filtro de edad mínima (ej: mayores de 40)
query {
  users(filter: { minAge: 40 }) {
    name
    age
  }
}

# Listar usuarios con filtro + paginación
query {
  users(filter: { minAge: 50 }, limit: 3, offset: 5) {
    name
    age
  }
}

# Semillar base de datos
mutation {
  seedUsers(count: 100) {
    name
    age
  }
}

# Actualizar
mutation {
  updateUser(id: "<uuid>", input: { name: "New Name" }) {
    name
    age
  }
}

# Eliminar
mutation {
  deleteUser(id: "<uuid>")
}
```

## ✨ Autor

Desarrollado por Sebastián Feliú — inspirado en la comunidad NestJS.

## 📝 Licencia

Este proyecto está bajo licencia [MIT](LICENSE).
