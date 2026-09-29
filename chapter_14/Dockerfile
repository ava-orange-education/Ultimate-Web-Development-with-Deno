FROM denoland/deno:2.1.4

# The port that your application listens to.
EXPOSE 8000

WORKDIR /app

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer.
COPY deno.json .
RUN deno install --entrypoint main.ts

# Copy the rest of the application source code.
COPY . .

# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.ts

# Run the application.
CMD ["run", "--allow-net", "main.ts"]
