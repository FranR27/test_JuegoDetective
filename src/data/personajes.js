/**
 * Personajes y contactos del capítulo 1.
 * `id` se usa en conversaciones, correos y evidencias.
 */
export const personajes = [
  {
    id: 'alex',
    nombre: 'Alex Morgan',
    iniciales: 'AM',
    edad: 34,
    rol: 'Auditor interno senior',
    legajo: '0847',
    relacion: 'Persona desaparecida',
    estado: 'Desaparecido desde el 13/03/2026',
    telefono: '+54 9 11 5555-0107',
    email: 'a.morgan@borealsystems.com',
    descripcion:
      'Metódico, reservado y muy cuidadoso con los respaldos. Ingresó a Boreal Systems en abril de 2021. Hijo único. Vivía solo en Av. Independencia 2240, 6.º B.',
    nota: 'Su teléfono dejó de emitir señal el viernes 13/03 a las 20:05. La notebook quedó en el piso 4.',
  },
  {
    id: 'valeria',
    nombre: 'Valeria Ruiz',
    iniciales: 'VR',
    edad: 31,
    rol: 'Analista de compliance',
    relacion: 'Amiga y compañera de Alex',
    estado: 'Denunciante',
    telefono: '+54 9 11 5555-0188',
    email: 'valeria.ruiz@borealsystems.com',
    descripcion:
      'Trabaja en el mismo piso que Alex. Fue la última persona que habló con él por mensaje la noche del jueves. Desconfía de RRHH desde la reunión del 12/03.',
    nota: 'Alex le pidió que, si no contestaba para el mediodía del viernes, revisara su correo.',
  },
  {
    id: 'tomas',
    nombre: 'Tomás Ferrer',
    iniciales: 'TF',
    rol: 'Soporte técnico — IT',
    relacion: 'Aliado de Alex',
    estado: 'Testigo',
    telefono: '+54 9 11 5555-0163',
    email: 'tomas.ferrer@borealsystems.com',
    descripcion:
      'Administra los logs de acceso y las terminales del edificio. Guardó una copia del registro de la sesión sospechosa y la subió al ticket INC-4471.',
    nota: 'No reportó el incidente por pedido expreso de Alex.',
  },
  {
    id: 'laura',
    nombre: 'Laura Ortega',
    iniciales: 'LO',
    rol: 'Jefa de Recursos Humanos',
    relacion: 'Sospechosa',
    estado: 'Activa en la empresa',
    telefono: '+54 9 11 5555-0121',
    email: 'laura.ortega@borealsystems.com',
    descripcion:
      'Registró la renuncia de Alex el 10/03 a las 09:12. Aprobó los tres pagos a Faro Consulting. El 12/03 le pidió a Alex que postergara el informe y lo amenazó frente a testigos.',
    nota: 'Nivel de acceso 3. Puede entrar al piso de RRHH y usar la terminal HR-02.',
  },
  {
    id: 'diego',
    nombre: 'Diego Sosa',
    iniciales: 'DS',
    rol: 'Guardia de seguridad — turno noche',
    relacion: 'Testigo',
    estado: 'Activo en la empresa',
    telefono: '+54 9 11 5555-0194',
    email: 'diego.sosa@borealsystems.com',
    descripcion:
      'Estaba en la ronda del estacionamiento cuando se registró el ingreso manual de la credencial 0847, a las 02:05 del sábado. Vio a una persona de campera oscura que no era Alex.',
    nota: 'Informó la cámara 3 fuera de servicio y recibió la orden de no hacer ruido.',
  },
  {
    id: 'marta',
    nombre: 'Marta Morgan',
    iniciales: 'MM',
    rol: 'Madre de Alex',
    relacion: 'Denunciante',
    estado: 'Fuera de la empresa',
    telefono: '+54 9 11 5555-0142',
    email: 'marta.morgan@correo.com',
    descripcion:
      'Contrató la investigación. Recibió el correo de despedida el sábado y lo reconoció como falso: Alex es hijo único y no tiene hermanos.',
    nota: 'Único contacto de emergencia registrado en el legajo.',
  },
  {
    id: 'ivan',
    nombre: 'Iván Petrov',
    iniciales: 'IP',
    rol: 'Socio director — Auditoría',
    relacion: 'Supervisor de Alex',
    estado: 'Fuera del país',
    telefono: '+54 9 11 5555-0177',
    email: 'ivan.petrov@borealsystems.com',
    descripcion:
      'Coordinó la reunión del 10/03 en Rosario. Confirmó por escrito que Alex estuvo presente toda la mañana. No responde llamados desde el lunes.',
    nota: 'Su testimonio sostiene la coartada de Alex durante el registro de la renuncia.',
  },
];

export const personajesPorId = Object.fromEntries(personajes.map((p) => [p.id, p]));

export function getPersonaje(id) {
  return personajesPorId[id] ?? null;
}
