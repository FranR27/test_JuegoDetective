// Genera el hash que va en src/data/capitulo1.js para la respuesta de un acertijo.
// Uso:  npm run hash -- "respuesta correcta"
//       npm run hash -- "Clave-Con-Mayusculas" --mayusculas
const { hashRespuesta } = require('../src/utils/respuesta');

const argumentos = process.argv.slice(2);
const distingueMayusculas = argumentos.includes('--mayusculas');
const texto = argumentos.filter((arg) => arg !== '--mayusculas').join(' ');

if (!texto) {
  console.error('Uso: npm run hash -- "respuesta" [--mayusculas]');
  process.exit(1);
}

console.log(hashRespuesta(texto, { distingueMayusculas }));
if (distingueMayusculas) {
  console.log('(recordá poner distingueMayusculas: true en ese acertijo)');
}
