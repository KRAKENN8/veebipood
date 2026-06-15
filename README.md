# Veebipood

Veebipood on Node.js ja Expressi baasil loodud e-poe süsteem, mis võimaldab kasutajatel registreeruda, sisse logida, vaadata tooteid ning esitada tellimusi.

Rakendus kasutab mikroteenuste arhitektuuri, kus kasutajate, toodete ja tellimuste haldus on eraldatud iseseisvateks teenusteks ning kogu liiklus läbib API Gateway teenust.

## Tehnoloogiad

- Node.js
- Express.js
- Docker
- Docker Compose
- REST API
- GitHub Actions (CI)

## Käivitamine

### Docker Compose

```bash
docker compose build
docker compose up
```

Rakendus käivitub aadressil:

```text
http://localhost:3000
```

## Teenused

| Teenus | Port | Kirjeldus |
|----------|------|----------|
| API Gateway | 3000 | Kõik kliendi päringud läbivad gateway |
| User Service | 3001 | Kasutajate haldus ja autentimine |
| Product Service | 3002 | Toodete haldus |
| Order Service | 3003 | Tellimuste haldus |

## Testikasutajad

| Nimi         | Kasutajanimi   | Parool |
| ------------ | ----- | ------ |
| Mari         | Kuusk | 1234   |
| Mart         | Kuusk | 4321   |

## Arhitektuur

Rakendus kasutab mikroteenuste arhitektuuri.

Iga äriloogika osa töötab eraldi teenusena:

- User Service haldab kasutajaid ja sessioone
- Product Service haldab tooteid ja laoseisu
- Order Service haldab tellimusi
- API Gateway vahendab kõik kliendi päringud

### Arhitektuuri skeem

```text
Client
   │
   ▼
API Gateway (3000)
   │
   ├── User Service (3001)
   ├── Product Service (3002)
   └── Order Service (3003)
```

## Projekti struktuur

```text
veebipood/
│
├── docker-compose.yml
│
├── src/
│   │
│   ├── api-gateway/
│   │   ├── server.js
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── user-service/
│   │   ├── server.js
│   │   ├── data.js
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── product-service/
│   │   ├── server.js
│   │   ├── data.js
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── order-service/
│   │   ├── server.js
│   │   ├── data.js
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   └── test.js
│
├── README.md
├── package.json
└── package-lock.json
```

## Monoliit vs Mikroteenused

### Algne monoliit

```text
src/
├── routes/
│   ├── users.js
│   ├── products.js
│   └── orders.js
├── data.js
└── server.js
```

Kõik funktsionaalsus töötas ühes Node.js protsessis ja kasutas ühist andmesalve.

### Mikroteenuste lahendus

```text
API Gateway
    │
    ├── User Service
    ├── Product Service
    └── Order Service
```

Teenused suhtlevad omavahel HTTP REST päringute abil.

## API Endpointid

### Kasutajad

| Meetod | URL | Kirjeldus |
|---------|------|------------|
| POST | /api/users/signup | Uue kasutaja registreerimine |
| POST | /api/users/login | Sisselogimine |
| POST | /api/users/logout | Väljalogimine |
| GET | /api/users/me | Sisselogitud kasutaja info |
| GET | /api/users | Kõik kasutajad |

### Tooted

| Meetod | URL | Kirjeldus |
|---------|------|------------|
| GET | /api/products | Kõik tooted |
| GET | /api/products/:id | Toote detailid |
| GET | /api/products/search?name= | Otsi toodet nime järgi |
| GET | /api/products/categories | Kõik kategooriad |
| GET | /api/products/category/:cat | Tooted kategooria järgi |

### Tellimused

| Meetod | URL | Kirjeldus |
|---------|------|------------|
| POST | /api/orders | Uue tellimuse loomine |
| GET | /api/orders | Kõik tellimused |
| GET | /api/orders/me | Kasutaja tellimused |
| GET | /api/orders/:id | Tellimus ID järgi |
| PATCH | /api/orders/:id/status | Tellimuse staatuse muutmine |

### Statistika

| Meetod | URL | Kirjeldus |
|---------|------|------------|
| GET | /api/stats | Rakenduse statistika |

## GitHub Actions

Projekt kasutab GitHub Actions CI töövoogu.

Iga push ja pull request korral:

1. Paigaldatakse sõltuvused
2. Käivitatakse rakendus
3. Käivitatakse automaattestid
4. Kontrollitakse, et API töötab korrektselt

See aitab avastada vead enne muudatuste ühendamist põhiharuga.