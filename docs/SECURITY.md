# Política de Seguridad

---

## 🔐 Gestión de secretos

- Todos los secretos viven en **Vercel Environment Variables**.
- Nunca en el repositorio, ni en el cliente, ni en logs.
- El archivo `.env` está en `.gitignore`.
- Rotación de credenciales cada 90 días o ante sospecha de filtración.

---

## 🛡️ Autenticación (Supabase)

- Contraseñas hasheadas con bcrypt (por defecto en Supabase Auth).
- Opción de 2FA para moderadores y admins.
- Sesiones con refresh tokens rotativos.
- Rate limiting en intentos de login.

---

## 🔒 Row-Level Security

Todas las tablas tienen RLS habilitado. Políticas clave:

- `edits`: solo el autor o moderadores pueden ver edits no aprobados.
- `votes`: solo el usuario puede insertar/borrar sus propios votos.
- `profiles`: lectura pública, escritura solo del propio usuario.
- `reports`: solo moderadores pueden leer todos; usuarios solo crean.

---

## 🌐 Seguridad de red

- **HTTPS** obligatorio (Vercel lo aplica automáticamente).
- **CSP** (Content Security Policy) configurada para permitir solo dominios
  necesarios (twitch.tv, youtube.com, instagram.com, tiktok.com).
- **CORS** restringido en las Vercel Functions al dominio de producción.

---

## 📤 Subida de archivos

- Validación del tipo MIME en cliente y servidor.
- Tamaño máximo: 100 MB por edit.
- Escaneo básico de contenido (por implementar).
- Nombres de archivo aleatorios (UUID) para evitar colisiones.
- Almacenamiento en bucket privado; servido vía signed URLs.

---

## 🚨 Reporte de vulnerabilidades

Si encuentras una vulnerabilidad, **no abras un issue público**.
Envía un email a [er179822@gmail.com](mailto:er179822@gmail.com) con:

- Descripción del problema.
- Pasos para reproducirlo.
- Impacto potencial.
- Sugerencia de mitigación (opcional).

Responderemos en un plazo máximo de 72 horas.
