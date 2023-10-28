# Collaborative whiteboard

This is the rewrite of my previous version

## How to run?

- Create `.env` file which contains the following variables:

   ```env
   VITE_KEYCLOAK_URL=""
   VITE_KEYCLOAK_REALM=""
   VITE_KEYCLOAK_CLIENT=""
   ```

- Make sure the [backend server](https://github.com/Nirlep5252/whiteboard-backend) is running

- Install dependencies:

   ```bash
   bun install
   ```

- Run:

   ```bash
   bun run dev
   ```
