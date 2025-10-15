
````markdown
# BookVerse API

This is a NestJS-based REST API for **BookVerse**, a platform for book reviews with user authentication and voting.

---

## Features

- **User authentication** with JWT tokens  
- CRUD operations for **Books** and **Reviews**  
- One review per user per book (enforced unique constraint)  
- Voting system with one vote (up/down) per user per review  
- **Swagger** API documentation  
- MongoDB with TypeORM using `ObjectId` for IDs  
- Input validation with `class-validator`  
- Error handling with proper HTTP exceptions  

---

## Requirements

- Node.js >= 18.x  
- MongoDB  

---

## Installation

1. Clone repo:

```bash
git clone https://github.com/sdrashti1001/bookverse.git
cd bookverse
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root with:

```
PORT=3000
JWT_SECRET=your_jwt_secret_here
DATABASE_TYPE=mongodb
DATABASE_URI=your_mongodb_url
DATABASE_NAME=test_db
PASSWORD_SALT_ROUNDS=10

```

4. Start the server:

```bash
npm run start:dev
```

---

## API Documentation

Visit: [http://localhost:3000/api](http://localhost:3000/api) for Swagger UI.

---

## Usage Overview

### Authentication

* Obtain JWT token by logging in
* Pass JWT token in Swagger or HTTP `Authorization: Bearer <token>` header

### Reviews

* **Create Review:** One review per user per book
* **Vote on Review:** One vote per user per review, either up or down

---

## Tech Stack

* NestJS
* TypeORM with MongoDB
* class-validator and Swagger for DTOs and API docs

---

## Scripts

```bash
npm run start       # Run production server
npm run start:dev   # Run dev server with hot reload
npm run build       # Build the project
```

---

## Contributing

Feel free to open issues or PRs.

---

## License


MIT License
