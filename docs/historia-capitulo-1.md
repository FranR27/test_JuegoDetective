# Historia — Capítulo 1: La persona que desapareció

> Documento de canon. Si se cambia un nombre, una fecha o una prueba, hay que actualizar también `src/data/capitulo1.js`, los datos afectados y correr `npm test`.

## Premisa

**CASO 404** es una investigación narrativa en primera persona. El jugador recibe el caso de **Alex Morgan**, auditor interno senior de **Boreal Systems S.A.**, desaparecido el viernes **13 de marzo de 2026**. La empresa sostiene que renunció por motivos personales; su madre y su amiga denuncian que no saben nada de él.

El capítulo se juega desde una mesa de investigación: carpetas de archivos, correo, mensajes, fotografías y un tablero de evidencias. El objetivo es reconstruir la última noche de Alex, comprobar si el correo de despedida y la renuncia son auténticos y descubrir qué estaba a punto de revelar la auditoría.

## El caso en una frase

Alex descubrió tres pagos a **Faro Consulting SRL** por **$480.000** aprobados por Laura Ortega. Se negó a firmar el cierre de la auditoría. Alguien fabricó su renuncia, envió un correo de despedida falso desde la terminal de RRHH y hizo desaparecer su rastro. La **caja 404** sigue cerrada.

## Reparto

| Personaje | Rol | Papel en el caso |
|---|---|---|
| **Alex Morgan** | Auditor interno senior, legajo **0847**, 34 años | Víctima. Hijo único. Metódico y reservado. Dejó respaldos y una nota con la instrucción «no firmar». |
| **Marta Morgan** | Madre de Alex | Denunciante. Confirma que Alex no tiene hermanos y que el correo de despedida es falso. |
| **Valeria Ruiz** | Analista de compliance | Amiga y compañera. Última persona que habló con Alex por mensaje la noche del jueves. Recibió el correo de despedida. |
| **Tomás Ferrer** | Soporte técnico — IT | Aliado. Guardó una copia del log de la sesión sospechosa en el ticket **INC-4471** y no lo reportó por pedido de Alex. |
| **Laura Ortega** | Jefa de Recursos Humanos | Sospechosa. Registró la renuncia de Alex, aprobó los pagos a Faro y lo amenazó frente a testigos. Nivel de acceso 3. |
| **Diego Sosa** | Guardia de seguridad — turno noche | Testigo. Vio a una persona de campera oscura usar la credencial de Alex a las 02:05. Informó la cámara 3 fuera de servicio. |
| **Iván Petrov** | Socio director — Auditoría | Supervisor de Alex. Coordinó la reunión de Rosario del 10/03 y confirmó por escrito que Alex estuvo presente. |

## Cronología

Todas las horas son de Buenos Aires (UTC−3).

### Antecedentes

| Fecha | Hecho |
|---|---|
| Abril de 2021 | Alex ingresa a Boreal Systems. Legajo **0847**. |
| 02/01/2026, 10:00 | Se publica la política **DIR-2026-02** de acceso a carpetas de auditoría: la clave combina legajo del auditor responsable y año fiscal. |
| 09/03/2026, 10:12 | Laura Ortega envía el correo «Auditoría 2026: acceso y plazos» con la política adjunta. |

### 10/03/2026 — La renuncia fabricada

| Hora | Hecho |
|---|---|
| 08:47 | Alex ingresa a la planta de **Logística del Sur** en Rosario con credencial de visitante **V-2291**. |
| 09:00–10:30 | Reunión presencial con el cliente. Alex figura como expositor. |
| **09:12** | En Buenos Aires, el sistema de RRHH registra la renuncia **REN-2026-0847**. La carga **l.ortega** desde el escáner **HR-SCAN-02**. No existe ninguna sesión de `a.morgan`. |
| 10:34 | Firma digital del acta de Rosario. Alex sigue a 300 km de la oficina. |

### 11 y 12/03/2026 — La auditoría y la amenaza

| Fecha y hora | Hecho |
|---|---|
| 11/03, 17:40 | Se genera el mayor analítico con tres pagos a **Faro Consulting SRL**: $160.000 + $150.000 + $170.000 = **$480.000**. |
| 11/03, 18:04 | Laura Ortega escribe a Finanzas para reclasificar los pagos como «servicios de consultoría» y ocultar la cuenta **4.2.3**. |
| 12/03, 17:30 | Acta de la reunión de auditoría Q1. Laura exige el cierre y dice: «Si no firmás, esto va a ser peor para vos». Valeria y Tomás autorizan la transcripción. Laura se retira sin firmar. |
| 12/03, 21:58 | Alex deja la nota preliminar de auditoría: no va a firmar el informe final y la copia completa está en la **caja 404**. |
| 12/03, 23:02–23:19 | Chat con Valeria. Alex le cuenta que encontró una renuncia firmada con su nombre y le pide revisar su correo si no contesta al mediodía del viernes. |

### 13/03/2026 — La última noche

| Hora | Hecho |
|---|---|
| 18:10 | Chat con Laura. Alex la enfrenta por la renuncia en su legajo. Laura vuelve a presionarlo para que firme el cierre. |
| 18:20 | La pizarra de la sala de auditoría queda con «Faro x3 = 480k», «¿quién aprobó?» y «404» encerrado en un círculo. |
| 18:43 | Tomás detecta que el usuario de Alex inició sesión desde la terminal **HR-02**, en el piso 3 de RRHH. Alex estaba en el piso 4. Le pide guardar el registro sin avisar a Laura. |
| 18:52 | Último contacto registrado: chat con Tomás. |
| **19:42** | Alex sale por el molinete principal. Última imagen confirmada: campera oscura y mochila. No vuelve a aparecer en ninguna cámara del perímetro. |
| 20:05 | El teléfono de Alex deja de emitir señal. La notebook queda en el piso 4. |

### 14/03/2026 — La despedida falsa

| Hora | Hecho |
|---|---|
| 01:50–02:30 | La **cámara 3** del acceso peatonal del estacionamiento queda sin señal. No hay orden de mantenimiento: alguien necesitaba que no viera el ingreso. |
| 02:05 | La credencial **0847** entra por el estacionamiento con habilitación manual. Diego Sosa ve a una persona de campera oscura que no era Alex. |
| 02:16:58 | Se abre una sesión de Outlook en la terminal fija **HR-02**, piso 3 de RRHH, con credencial de nivel 3. |
| **02:17:41** | Se envía el correo «Me voy. No me busquen» desde la cuenta de Alex a Valeria, Marta y RRHH. No fue programado: fue manual. |
| 03:10 | Se emite el informe de incidente **SEG-2026-0314** por la cámara 3. |
| 09:40 | Tomás manda a Alex el backup y el log de su usuario, con el análisis forense adjunto. |

### 15 y 16/03/2026 — La investigación

| Fecha y hora | Hecho |
|---|---|
| 15/03, 23:12 | Diego Sosa envía el registro del molinete que le pidieron. |
| 16/03, 07:58 | Marta Morgan escribe: «¿Saben algo de Alex?». |
| 16/03, 08:02 | Valeria Ruiz escribe: «¿Dónde estás?». |
| 16/03, 08:10 | Marta y Valeria denuncian la desaparición. |
| 16/03, 09:00 | Comienza la investigación del jugador. |
| 16/03, 10:20 | Se encuentra la nota manuscrita dentro del locker **404**, cerrada con candado. |
| 16/03, 11:05 | Comparación de firmas: la del legajo (2021) y la escaneada en la renuncia (2026) no coinciden. |
| 16/03, 12:40 | Se completa el análisis forense del correo de despedida. |
| 16/03, 21:00 | Aparece un mensaje programado de Alex: «Si llegaste hasta acá, no me fui. Buscá la caja 404. La llave no está en el edificio. — A.». |

## El correo de despedida

Asunto: **«Me voy. No me busquen»**. Enviado el **14/03/2026 a las 02:17:41** desde `a.morgan@borealsystems.com` a Valeria, Marta y RRHH.

El texto afirma que Alex:

1. se va a la casa de su **hermano** en **Villa Traful**;
2. dejó su **renuncia firmada** en RRHH;
3. deja el cierre de la auditoría en manos de otra persona;
4. pide que no lo busquen;
5. se despide con «nos vemos en la costa».

Dos datos lo delatan:

- Alex es **hijo único**. No tiene hermanos ni medios hermanos. El legajo y la declaración de Marta lo confirman.
- El correo salió a las **02:17** desde la terminal **HR-02** del piso de RRHH. Alex había salido a las **19:42** y no volvió a ingresar. El ingreso manual de las 02:05 no tiene imagen porque la cámara 3 estaba intervenida.

## La renuncia fabricada

Formulario **REN-2026-0847**, registrado el **10/03/2026 a las 09:12**.

- Lo cargó **l.ortega** desde el escáner **HR-SCAN-02**.
- La firma está escaneada, sin validación biométrica.
- No existe ninguna sesión de `a.morgan` en el sistema.
- A esa misma hora Alex estaba en una reunión presencial en **Rosario**, a 300 km, con acta firmada por Iván Petrov y credencial de visitante **V-2291**.

## La auditoría y el móvil

Tres pagos a **Faro Consulting SRL**, proveedor que no está en el registro de proveedores aprobados:

| Fecha | Factura | Importe | Aprobación |
|---|---|---|---|
| 15/01/2026 | F-2026-0114 | $160.000 | Laura Ortega |
| 12/02/2026 | F-2026-0208 | $150.000 | Laura Ortega |
| 10/03/2026 | F-2026-0311 | $170.000 | Laura Ortega |
| | **Total** | **$480.000** | |

La cuenta **4.2.3** fue renombrada para ocultar los movimientos. Laura pidió a Finanzas reclasificarlos antes del cierre. Alex documentó todo y se negó a firmar.

## Objetos y documentos clave

| Pieza | Dónde está | Qué aporta |
|---|---|---|
| Legajo 0847 | `f_rrhh` | Hijo único, contacto de emergencia, nivel de acceso 2. |
| Política DIR-2026-02 | `f_rrhh` | Explica el formato de la clave de la carpeta de auditoría. |
| Acta del 10/03 | `f_rrhh` | Coartada de Rosario. |
| Registro de accesos | `f_seguridad` | Salida 19:42, ingreso manual 02:05, sesión VPN 02:17. |
| Incidente de cámara 3 | `f_seguridad` | El corte no fue una falla técnica. |
| Análisis forense del correo | `f_seguridad` (se abre con P1) | Origen exacto del correo: HR-02, 02:16:58. |
| Nota de la caja 404 | `f_personal` (se abre con P1) | Letra de Alex, legajo y la instrucción «no firmar». |
| Nota preliminar de auditoría | `f_auditoria` (se abre con P2) | Tres facturas, monto total y negativa a firmar. |
| Mayor analítico | `f_auditoria` (se abre con P2) | Filas de Faro y cuenta 4.2.3 renombrada. |
| Correo interno de Laura | `f_auditoria` (se abre con P2) | Prueba directa del encubrimiento. |
| Acta del 12/03 | `f_auditoria` (se abre con P2) | Amenaza frente a testigos. |
| Cierre del capítulo | `f_caso` (se abre con P3) | Conclusión y gancho del capítulo 2. |

## Las seis fotografías

| Archivo | Escena |
|---|---|
| `credencial-alex.svg` | Credencial con legajo 0847 hallada en el escritorio. |
| `camara-salida.svg` | Última imagen de Alex saliendo a las 19:42. |
| `camara-offline.svg` | Cámara 3 sin señal durante el ingreso manual. |
| `nota-caja-404.svg` | Nota manuscrita dentro del locker 404. |
| `firmas.svg` | Comparación entre la firma del legajo y la de la renuncia. |
| `pizarra-auditoria.svg` | Pizarra con «Faro x3 = 480k» y «404». |

## Correos y mensajes

**Correo recibido (5):**

1. Laura Ortega — «Auditoría 2026: acceso y plazos» (09/03, adjunta la política).
2. Tomás Ferrer — «Backup y log de tu usuario» (14/03, adjunta el análisis forense).
3. Diego Sosa — «Registro del molinete que me pediste» (15/03, adjunta el CSV de accesos).
4. Marta Morgan — «¿Saben algo de Alex?» (16/03).
5. Valeria Ruiz — «¿Dónde estás?» (16/03).

**Correo enviado (1):** el falso mensaje de despedida del 14/03 a las 02:17:41.

**Conversaciones (3):**

- **Valeria** (12/03, 8 mensajes): Alex descubre la renuncia y le pide guardar la conversación.
- **Tomás** (13/03, 6 mensajes): detecta la sesión desde HR-02 y guarda el log.
- **Laura** (13/03, 7 mensajes): presión para firmar el cierre y amenaza.

## Desenlace del capítulo

El correo de despedida es apócrifo. La renuncia también. El móvil está documentado: **$480.000** desviados a Faro Consulting con aprobación de Laura Ortega. Alex no se fue: lo sacaron del tablero.

El capítulo cierra con 19/19 evidencias y tres acertijos resueltos. El mensaje programado deja el gancho:

> «Si llegaste hasta acá, no me fui. Buscá la caja 404. La llave no está en el edificio. — A.»

**Capítulo 2 — «La caja 404»:** la llave no está en el edificio. Alguien la tiene. Y sabe que estás investigando.
