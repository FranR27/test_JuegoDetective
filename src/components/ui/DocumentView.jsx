import { getFoto, photoSrc } from '../../data/fotografias.js';
import { formatDate } from '../../lib/format.js';
import Badge from './Badge.jsx';
import EmptyState from './EmptyState.jsx';
import './DocumentView.css';

const KIND_LABEL = {
  pdf: 'PDF',
  txt: 'TXT',
  csv: 'CSV',
  img: 'IMAGEN',
};

const CLASSIFICATION = {
  interno: { label: 'Interno', tone: 'info' },
  confidencial: { label: 'Confidencial', tone: 'danger' },
  restringido: { label: 'Restringido', tone: 'danger' },
  personal: { label: 'Personal', tone: 'accent' },
};

function Block({ block }) {
  switch (block.type) {
    case 'heading':
      return <h3 className="case-doc__heading">{block.text}</h3>;

    case 'paragraph':
      return <p className="case-doc__paragraph">{block.text}</p>;

    case 'kv':
      return (
        <dl className="case-doc__kv">
          {block.items.map((item) => (
            <div className="case-doc__kv-row" key={`${item.label}-${item.value}`}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      );

    case 'table': {
      const highlighted = new Set(block.highlightRows ?? []);
      return (
        <div className="case-doc__table-wrap">
          <table className="case-doc__table">
            <thead>
              <tr>
                {block.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr
                  key={`row-${rowIndex}`}
                  className={highlighted.has(rowIndex) ? 'is-highlighted' : undefined}
                >
                  {row.map((cell, cellIndex) => (
                    <td key={`cell-${cellIndex}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag className={`case-doc__list ${block.ordered ? 'is-ordered' : ''}`.trim()}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </Tag>
      );
    }

    case 'note':
      return (
        <aside className={`case-doc__note case-doc__note--${block.tone ?? 'info'}`}>
          {block.text}
        </aside>
      );

    case 'quote':
      return (
        <blockquote className="case-doc__quote">
          <p>{block.text}</p>
          {block.source ? <footer>— {block.source}</footer> : null}
        </blockquote>
      );

    case 'signature':
      return (
        <div className="case-doc__signature">
          <span className="case-doc__signature-name">{block.name}</span>
          <span className="case-doc__signature-role">{block.role}</span>
          <span className="case-doc__signature-date">{block.date}</span>
        </div>
      );

    case 'image': {
      const photo = getFoto(block.photoId);
      if (!photo) return null;
      return (
        <figure className="case-doc__figure">
          <img
            src={photoSrc(photo.file)}
            alt={photo.title}
            loading="lazy"
            className="case-doc__image"
          />
          <figcaption>{block.caption ?? photo.description}</figcaption>
        </figure>
      );
    }

    default:
      return null;
  }
}

export default function DocumentView({ document, className = '' }) {
  if (!document) {
    return (
      <EmptyState
        icon="file"
        title="Elegí un documento"
        description="La lista de la izquierda muestra lo que ya está desbloqueado. Los documentos con candado aparecen al resolver un acertijo."
      />
    );
  }

  const classification = CLASSIFICATION[document.classification] ?? CLASSIFICATION.interno;

  return (
    <article className={`case-doc ${className}`.trim()} aria-label={document.title}>
      <div className="case-doc__inner">
        <header className="case-doc__head">
          <div className="case-doc__stamp" aria-hidden="true">
            {document.classification === 'personal' ? 'PERSONAL' : 'CONFIDENCIAL'}
          </div>
          <p className="case-doc__eyebrow">
            CASO 404 · {document.kind ? KIND_LABEL[document.kind] ?? document.kind : 'DOC'}
          </p>
          <h2 className="case-doc__title">{document.title}</h2>
          {document.summary ? <p className="case-doc__summary">{document.summary}</p> : null}
          <div className="case-doc__meta">
            <span>
              <strong>Fecha:</strong> {formatDate(document.date)}
            </span>
            <span>
              <strong>Autor:</strong> {document.author}
            </span>
            <Badge tone={classification.tone}>{classification.label}</Badge>
            {document.tags?.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </header>

        <div className="case-doc__body">
          {document.blocks.map((block, index) => (
            <Block block={block} key={`${block.type}-${index}`} />
          ))}
        </div>

        <footer className="case-doc__foot">
          <span>Boreal Systems · Expediente CASO 404</span>
          <span>{document.id}</span>
        </footer>
      </div>
    </article>
  );
}
