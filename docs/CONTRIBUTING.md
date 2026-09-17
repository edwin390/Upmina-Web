# Guía de Contribución

Gracias por querer contribuir a UPMINA Web. Esta guía describe las convenciones
del proyecto para mantener un código limpio y consistente.

---

## 🌿 Flujo de Git

- `main`: rama de producción (protegida, requiere PR y review)
- `develop`: rama de integración
- `feat/nombre-corto`: nuevas funcionalidades
- `fix/nombre-corto`: correcciones
- `chore/nombre-corto`: tareas de mantenimiento

### Ejemplo

```bash
git checkout -b feat/youtube-hero-video
# ... trabaja ...
git commit -m "feat(youtube): agregar hero video con el último video"
git push origin feat/youtube-hero-video
```

---

## ✍️ Convención de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/es/):

```
<tipo>(<scope>): <descripción corta>

[cuerpo opcional]

[footer opcional]
```

### Tipos permitidos

- `feat`: nueva funcionalidad
- `fix`: corrección de bug
- `docs`: cambios en documentación
- `style`: cambios de formato (no afectan lógica)
- `refactor`: reorganización de código
- `perf`: mejoras de performance
- `test`: añadir o modificar tests
- `chore`: tareas de build, dependencias, etc.

### Ejemplos

```
feat(twitch): agregar badge de estado en vivo
fix(instagram): corregir renovación de token a los 60 días
feat(youtube): agregar hero video con el último video
fix(youtube): corregir parseo de duración ISO 8601
refactor(youtube): extraer lógica de thumbnails a utilidad
docs(readme): actualizar instrucciones de instalación
```

---

## 🎨 Convenciones de Código

### TypeScript

- Modo `strict: true` obligatorio.
- Nada de `any`. Si no se sabe el tipo, usar `unknown` y narrowing.
- Preferir `interface` para props y objetos públicos; `type` para uniones.

### React

- Componentes funcionales con hooks.
- Props siempre tipadas con `interface`.
- Un componente por archivo, con el nombre del archivo coincidiendo.
- Preferir composición sobre props booleanas (`<Card><CardBody/></Card>`).
- Nombres de archivos en PascalCase para componentes.

### Estilos

- Tailwind utility-first. Sin CSS modules.
- Colores y espaciados siempre desde el `tailwind.config.js` (design tokens).
- HeroUI para componentes base. Variantes custom solo si HeroUI no cubre.

### Hooks

- Prefijo `use` siempre.
- Nombre de archivo en camelCase: `useTwitchStatus.ts`.
- Cada hook con su test unitario.

---

## 🧪 Tests

- Toda nueva funcionalidad debe incluir tests.
- Cobertura mínima: 70% en lógica de negocio.
- Los tests viven junto al archivo: `Component.test.tsx`.
- Usar `describe` / `it` descriptivos en inglés técnico.

---

## 🔀 Pull Requests

### Checklist antes de abrir PR

- [ ] El código compila (`npm run build`)
- [ ] Pasan todos los tests (`npm run test`)
- [ ] Pasa el linter (`npm run lint`)
- [ ] Se actualizó la documentación si aplica
- [ ] Se añadieron tests si aplica
- [ ] No hay `console.log` olvidados

### Plantilla de PR

```markdown
## Descripción
<qué hace este PR y por qué>

## Tipo de cambio
- [ ] Nueva funcionalidad
- [ ] Corrección
- [ ] Refactor
- [ ] Documentación

## Screenshots (si aplica UI)

## Checklist
- [ ] Tests pasan
- [ ] Linter pasa
- [ ] Documentación actualizada
```

---

## 🔐 Seguridad

- Nunca commitear archivos `.env` o credenciales.
- Si accidentalmente commiteas un secreto, revócalo inmediatamente y
  reescribe la historia de Git.
- Reportar vulnerabilidades por email privado, no en issues públicas.

---

## 📞 Contacto

Dudas sobre contribución: er179822@gmail.com
