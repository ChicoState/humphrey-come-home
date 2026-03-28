/**
 * PolaroidRail — infinite-scroll marquee of polaroid-style photo cards.
 *
 * @prop {Array}   photos   — [{ src, label }]
 * @prop {number}  [speed]  — animation duration in seconds (default 40)
 * @prop {boolean} [reverse] — scroll in the opposite direction
 */
import { useNavigate } from 'react-router';
import styles from './PolaroidRail.module.css';
import Image from './Image';

const ANGLES = [-4, 3, -2, 5, -3, 2, -5, 4, -1, 3];

function PolaroidCard({ photo, angle }) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.polaroid}
      style={{ '--angle': `${angle}deg` }}
      onClick={photo.id ? () => navigate(`/animals/${photo.id}`) : undefined}
    >
      <div className={styles.imageWrap}>
        <Image src={photo.src} alt={photo.label || ''} className={styles.image} />
      </div>
      {photo.label && <span className={styles.label}>{photo.label}</span>}
    </div>
  );
}

export default function PolaroidRail({ photos, speed = 40, reverse = false }) {
  const items = photos.map((photo, i) => (
    <PolaroidCard
      key={i}
      photo={photo}
      angle={ANGLES[i % ANGLES.length]}
    />
  ));

  return (
    <div className={`${styles.marquee} ${reverse ? styles.reverse : ''}`} style={{ '--speed': `${speed}s` }}>
      <div className={styles.track}>
        <div className={styles.segment}>{items}</div>
        <div className={styles.segment}>{items}</div>
      </div>
    </div>
  );
}
