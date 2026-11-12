import { capitulo1 } from '../../data/capitulo1.js';
import Icon from '../ui/Icon.jsx';
import './ChapterOutro.css';

export default function ChapterOutro({ progress }) {
  return (
    <section className="case-outro" aria-label="Fin del capítulo 1">
      <div className="case-outro__mark">
        <Icon name="check" size={26} />
      </div>
      <p className="case-overline">Caso 404 · Capítulo 1 completado</p>
      <h2 className="case-outro__title">{capitulo1.cierre.titulo}</h2>
      <p className="case-outro__text">{capitulo1.cierre.texto}</p>

      <div className="case-outro__stats">
        <div>
          <strong>{progress?.solvedPuzzles ?? 3}</strong>
          <span>acertijos resueltos</span>
        </div>
        <div>
          <strong>{progress?.foundEvidence ?? '—'}</strong>
          <span>evidencias encontradas</span>
        </div>
        <div>
          <strong>1</strong>
          <span>caso sin cerrar</span>
        </div>
      </div>

      <div className="case-outro__teaser">
        <Icon name="key" size={18} />
        <p>{capitulo1.cierre.ganchoCapitulo2}</p>
      </div>

      <p className="case-outro__note">
        El cierre completo quedó registrado en Archivos → «Cierre del capítulo 1». El gancho del
        capítulo 2 no se implementa en esta entrega: solo se deja preparado el contenido.
      </p>
    </section>
  );
}
