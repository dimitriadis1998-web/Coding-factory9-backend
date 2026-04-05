import app from './app';
import { connectDB } from './utils/db';

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start();


// ts-node-dev
// This is a development tool similar to nodemon, but designed for TypeScript.
// It:
// Compiles your TypeScript files in memory (no need to run tsc).
// Restarts your server automatically whenever you change a .ts file.
// Is faster than running tsc + nodemon separately.
// So it’s ideal for development.
// 2. --respawn
// This flag tells ts-node-dev to restart the process completely each time a change is detected.
// Why this matters:
// Ensures that any environment variables, imports, or configurations are reloaded.
// Useful if you’re changing files that are not automatically reloaded (like .env or JSON configs).
// 3. --transpile-only
// This flag tells TypeScript to skip type checking when compiling.
// Pros: Faster reload times.
// Cons: Type errors (e.g. wrong variable types) won’t stop the server from running.
// This is fine for development but not for production — in production you’d usually compile with tsc first.