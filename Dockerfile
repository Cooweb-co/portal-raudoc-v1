# Usa la imagen oficial de Bun
# Ver todas las versiones en https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Instala las dependencias en un directorio temporal
# Esto cacheará las dependencias y acelerará las futuras compilaciones
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Instala las dependencias de producción
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copia node_modules desde el directorio temporal
# Luego copia todos los archivos del proyecto (no ignorados) a la imagen
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Construcción del proyecto
ENV NODE_ENV=production
RUN bun run build

# Copia las dependencias de producción y el código fuente en la imagen final
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/dist ./dist
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/bun.lockb .

# Instala un servidor HTTP para servir la aplicación
RUN bun add http-server

# Exponer el puerto que usará la aplicación
EXPOSE 8080

# Ejecuta la aplicación
CMD ["http-server", "dist"]
