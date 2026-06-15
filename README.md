# Veebipood

Veebipood on Node.js ja Expressi põhine REST API, mis võimaldab hallata kasutajaid, tooteid ja tellimusi. Rakendus toetab kasutajate registreerimist ja sisselogimist, toodete vaatamist ning tellimuste loomist ja haldamist.

## Tehnoloogiad

* Node.js
* Express.js
* JavaScript (CommonJS)
* REST API
* GitHub Actions (CI)
* In-memory andmesalv (andmed hoitakse rakenduse mälus)

## Käivitamine

Paigalda sõltuvused:

```bash
npm install
```

Käivita rakendus:

```bash
docker compose up --build -d
```

Server käivitub vaikimisi pordil 3000.

## Testikasutajad

| Nimi         | Kasutajanimi   | Parool |
| ------------ | ----- | ------ |
| Mari         | Kuusk | 1234   |
| Mart         | Kuusk | 4321   |

## Teadaolevad vead

Ei ole

## API endpointid

### Kasutajad

| Meetod | URL               | Kirjeldus                               |
| ------ | ----------------- | --------------------------------------- |
| POST   | /api/users/signup | Registreerib uue kasutaja               |
| POST   | /api/users/login  | Logib kasutaja sisse ja tagastab tokeni |
| POST   | /api/users/logout | Logib kasutaja välja                    |
| GET    | /api/users/me     | Tagastab sisselogitud kasutaja andmed   |

### Tooted

| Meetod | URL                           | Kirjeldus                          |
| ------ | ----------------------------- | ---------------------------------- |
| GET    | /api/products                 | Tagastab kõik tooted               |
| GET    | /api/products/:id             | Tagastab konkreetse toote ID järgi |
| GET    | /api/products/search?name=... | Otsib tooteid nime järgi           |
| GET    | /api/products/categories      | Tagastab kõik kategooriad          |
| GET    | /api/products/category/:cat   | Tagastab kategooria tooted         |

### Tellimused

| Meetod | URL                    | Kirjeldus                                 |
| ------ | ---------------------- | ----------------------------------------- |
| POST   | /api/orders            | Loob uue tellimuse                        |
| GET    | /api/orders            | Tagastab kõik tellimused                  |
| GET    | /api/orders/me         | Tagastab sisselogitud kasutaja tellimused |
| GET    | /api/orders/:id        | Tagastab konkreetse tellimuse             |
| PATCH  | /api/orders/:id/status | Muudab tellimuse staatust                 |

## Arhitektuur

Rakendus kasutab kihilist (Layered Architecture) arhitektuuri.

## GitHub Actions

GitHub Actions käivitub automaatselt iga push'i ja pull request'i korral.

Automaatika:

1. Paigaldab projekti sõltuvused.
2. Käivitab testid.
3. Kontrollib, et rakendus käivitub korrektselt.
4. Annab tagasisidet, kas build ja testid läbisid edukalt.

See aitab avastada vead enne muudatuste ühendamist põhiharusse.
