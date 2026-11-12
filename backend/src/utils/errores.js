/**
 * Error con código HTTP y un código interno estable que el frontend puede usar
 * para decidir qué mostrar (por ejemplo "partida_no_encontrada").
 */
class HttpError extends Error {
  constructor(estado, codigo, mensaje) {
    super(mensaje);
    this.name = 'HttpError';
    this.estado = estado;
    this.codigo = codigo;
  }
}

module.exports = { HttpError };
