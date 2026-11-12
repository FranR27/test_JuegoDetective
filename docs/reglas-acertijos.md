# Reglas de los acertijos

El capítulo tiene tres acertijos encadenados. Cada uno abre documentos, una carpeta o evidencias nuevas. La fuente de la verdad está en `src/data/acertijos.js`; los bloqueos de documentos, carpetas y evidencias están en `src/data/archivos.js` y `src/data/evidencias.js`.

## Resumen

| Orden | Id | Tipo | Se habilita al resolver | Desbloquea |
|---|---|---|---|---|
| 1 | `p1_despedida` | Opción múltiple (2 de 6) | Nada (disponible desde el inicio) | 2 documentos + 3 evidencias |
| 2 | `p2_auditoria` | Contraseña | `p1_despedida` | 1 carpeta + 4 documentos + 4 evidencias |
| 3 | `p3_renuncia` | Opción múltiple (2 de 6) | `p2_auditoria` | 1 documento + 3 evidencias + cierre |

---

## P1 — «La despedida que no cierra»

**Pregunta:** el correo de despedida parece escrito por Alex. ¿Qué dos datos demuestran que no lo escribió él?

**Respuesta canónica:** `p1_hermano` + `p1_vpn` (en cualquier orden).

### Opciones

| Id | Texto | ¿Correcta? | Por qué |
|---|---|---|---|
| `p1_hermano` | Dice que se va a la casa de su hermano en Villa Traful. | **Sí** | Alex es hijo único. El legajo y Marta lo confirman. |
| `p1_vpn` | Fue enviado a las 02:17 desde la terminal HR-02 del edificio, cuando Alex ya había salido y no volvió a entrar. | **Sí** | Alex salió a las 19:42. La sesión de HR-02 es de otra persona. |
| `p1_renuncia` | Afirma que dejó su renuncia firmada en RRHH. | No | Es sospechoso, pero la renuncia existe: la prueba está en cómo se cargó (P3). |
| `p1_auditoria` | Dice que deja el cierre de la auditoría en manos de otra persona. | No | Es coherente con la presión que recibía; no prueba autoría. |
| `p1_costa` | Se despide con «nos vemos en la costa». | No | Es un detalle de estilo, no una prueba. |
| `p1_silencio` | Pide que no lo busquen. | No | Es parte del guion de desaparición voluntaria, no una prueba de suplantación. |

### Desbloqueos

| Tipo | Id | Título |
|---|---|---|
| Documento | `doc_metadatos_despedida` | Análisis forense — correo de despedida |
| Documento | `doc_nota_caja` | Nota manuscrita — caja 404 |
| Evidencia | `ev_metadatos` | Metadatos del correo de despedida |
| Evidencia | `ev_declaracion_marta` | Declaración de Marta Morgan |
| Evidencia | `ev_nota_caja` | Nota de la caja 404 |

### Pistas

1. El correo dice que Alex se va a lo de su hermano. Buscá la composición familiar en el legajo de RRHH.
2. El correo salió a las 02:17. Compará esa hora con la última salida registrada y con el origen de la sesión.
3. La terminal HR-02 está en el piso de RRHH. Alex no volvió a entrar al edificio después de las 19:42, y el ingreso manual de las 02:05 no tiene imagen.

### Texto de recompensa

- Se abre el análisis forense del correo en Seguridad.
- Se suma la declaración de Marta Morgan a Evidencias.
- Se habilita la nota manuscrita de la caja 404.

---

## P2 — «La carpeta AUDITORIA_2026»

**Pregunta:** la carpeta `AUDITORIA_2026` pide una clave. El formato está en la política interna.

**Respuesta canónica:** `0847-2026`.

El campo acepta `0847-2026`, `08472026`, `0847 2026`, `0847/2026`, `0847_2026`, con espacios o mayúsculas. El motor normaliza a letras y números: `08472026`. La comparación **no** distingue mayúsculas.

### Cómo se deduce

1. La política `DIR-2026-02` (carpeta de RRHH) explica que la clave combina el **legajo del auditor responsable** y el **año fiscal**, separados por un guion.
2. El legajo de Alex es **0847** (credencial y legajo de personal).
3. El año está en el nombre de la carpeta: **2026**.
4. Clave: **0847-2026**.

### Desbloqueos

| Tipo | Id | Título |
|---|---|---|
| Carpeta | `f_auditoria` | AUDITORIA_2026 |
| Documento | `doc_nota_preliminar` | Nota preliminar de auditoría Q1 |
| Documento | `doc_movimientos` | Mayor analítico — pagos Q1 2026 |
| Documento | `doc_correo_laura` | Copia de correo interno — L. Ortega a Finanzas |
| Documento | `doc_acta_12_03` | Acta de reunión — auditoría Q1 (12/03) |
| Evidencia | `ev_nota_auditoria` | Nota preliminar de auditoría |
| Evidencia | `ev_movimientos_faro` | Mayor analítico — pagos a Faro |
| Evidencia | `ev_correo_interno` | Correo interno de Laura a Finanzas |
| Evidencia | `ev_acta_12_03` | Acta de la reunión del 12/03 |

### Pistas

1. La política DIR-2026-02 explica cómo se arma la clave. Está en la carpeta de RRHH.
2. Necesitás dos datos: el legajo del auditor responsable y el año fiscal. El legajo de Alex aparece en la credencial y en el legajo.
3. Uní 0847 y 2026 con un guion. La carpeta se llama, literalmente, AUDITORIA_2026.

### Texto de recompensa

- Se desbloquea la carpeta AUDITORIA_2026.
- Se abren la nota preliminar, el mayor analítico, el correo interno de Laura y el acta del 12/03.
- Se suman cuatro evidencias nuevas.

---

## P3 — «El historial de renuncia»

**Pregunta:** compará la renuncia con el acta de Rosario y el audit trail. ¿Qué dos pruebas demuestran que Alex no firmó su renuncia?

**Respuesta canónica:** `p3_rosario` + `p3_audit_trail` (en cualquier orden).

### Opciones

| Id | Texto | ¿Correcta? | Por qué |
|---|---|---|---|
| `p3_rosario` | A las 09:12 del 10/03, Alex estaba en una reunión presencial en Rosario, a 300 km de la oficina. | **Sí** | El acta y la credencial V-2291 lo ubican en la planta del cliente. |
| `p3_audit_trail` | El formulario lo cargó `l.ortega` desde el escáner HR-SCAN-02 y no existe ninguna sesión de `a.morgan`. | **Sí** | El sistema registra quién hizo cada acción; ninguna es de Alex. |
| `p3_motivo` | El motivo declarado es «motivos personales». | No | Es un dato real, pero no prueba falsificación. |
| `p3_firma` | La firma del formulario está escaneada. | No | Una firma escaneada es irregular, pero no prueba por sí sola que Alex no la firmó. |
| `p3_vigencia` | La fecha de vigencia de la renuncia es el 20/03/2026. | No | Es un dato administrativo. |
| `p3_formato` | El documento está guardado en formato PDF. | No | Irrelevante. |

### Desbloqueos

| Tipo | Id | Título |
|---|---|---|
| Documento | `doc_conclusion` | Cierre del capítulo 1 — informe del investigador |
| Evidencia | `ev_audit_trail` | Audit trail de la renuncia |
| Evidencia | `ev_renuncia_falsa` | Renuncia fabricada |
| Evidencia | `ev_mensaje_alex` | Mensaje programado de Alex |

`p3_renuncia` es el único acertijo con `chapterComplete: true`. Al resolverlo se muestra el cierre y se habilita el gancho del capítulo 2.

### Pistas

1. Compará la hora del registro de la renuncia con la agenda y el acta del 10/03.
2. El acta de Rosario tiene hora de ingreso y participantes. La renuncia se registró a las 09:12, en plena reunión.
3. El audit trail de RRHH muestra quién subió el formulario. Buscá una sesión de `a.morgan`: no existe.

### Texto de recompensa

- Se abre el cierre del capítulo 1.
- Se suman el audit trail, la renuncia fabricada y el mensaje programado de Alex.
- Se completa el capítulo y se habilita el gancho del capítulo 2.

---

## Reglas de juego

### Intentos y pistas

- Un intento incorrecto incrementa el contador de intentos del acertijo; no bloquea ni penaliza.
- Las pistas son opcionales y se revelan de a una. No contienen la respuesta literal.
- Resolver un acertijo ya resuelto devuelve «Ya lo habías resuelto» sin duplicar desbloqueos.
- No se puede resolver un acertijo si falta su prerrequisito.

### Orden

```text
inicio
  └─ p1_despedida
       └─ p2_auditoria
            └─ p3_renuncia → fin del capítulo
```

### Progreso

- Evidencias iniciales: **9 de 19**.
- Tras P1: **12 de 19**.
- Tras P2: **16 de 19**.
- Tras P3: **19 de 19** y capítulo completo.
- El porcentaje del harness se calcula sobre evidencias visibles: 47% → 63% → 84% → 100%.

### Validación en el backend

En producción el frontend no debe conocer las respuestas. El cliente envía una representación canónica y el backend compara contra un hash SHA-256:

| Acertijo | Respuesta que viaja | `distingueMayusculas` | Hash SHA-256 |
|---|---|---|---|
| `p1_despedida` | `p1_hermano|p1_vpn` | `false` | `879d1a83472b99ebcba505f387b2ed8973a647efea180565e9e2e0bc6adb591f` |
| `p2_auditoria` | `08472026` | `false` | `e2f489d0059c34576b86132e479c8521f2f18895b57dfbf5dd0156f901c6da17` |
| `p3_renuncia` | `p3_audit_trail|p3_rosario` | `false` | `fcb65099d57bb66fb0b9599c3a3b15a8f9d14ef6307fd90a07eb9e18ee7742d8` |

Los ids de las opciones se ordenan alfabéticamente y se unen con `|`. Así el backend valida la combinación sin recibir la respuesta en texto plano. El catálogo completo está en `backend/src/data/capitulo1.js` (referencia en `docs/backend-capitulo1.ejemplo.js`) y el detalle en `docs/integracion.md`.

### Modo QA

El harness tiene un botón **Modo QA** que muestra las respuestas canónicas y las soluciones en el panel de acertijos. Es solo para revisión del equipo: no debe formar parte del juego publicado.

## Cómo agregar o cambiar un acertijo

1. Agregar el objeto en `src/data/acertijos.js` con `id`, `order`, `type`, `answer`, `requiresSolved`, `unlocks`, `hints` y `rewardSummary`.
2. Marcar los documentos, carpetas y evidencias con `lockedByPuzzleId` / `unlockedByPuzzleId` en `archivos.js` y `evidencias.js`.
3. Verificar que `unlocks` coincida exactamente con esos bloqueos: los tests fallan si algo queda huérfano o cruzado.
4. Si el acertijo usa opción múltiple, mantener exactamente 2 respuestas y al menos un distractor por cada respuesta.
5. Actualizar `HASHES_BACKEND` en `src/services/apiCapitulo1.js` y el catálogo `backend/src/data/capitulo1.js` (y su referencia en `docs/backend-capitulo1.ejemplo.js`).
6. Correr `npm test` y `npm run build`.
