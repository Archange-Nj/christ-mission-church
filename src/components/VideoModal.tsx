import { useEffect } from 'react';
import { ExternalLink, X } from 'lucide-react';

interface VideoModalProps {
  youtubeUrl: string;
  title: string;
  onClose: () => void;
}

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    let videoId: string | null = null;

    if (parsed.hostname.includes('youtu.be')) {
      videoId = parsed.pathname.slice(1);
    } else if (parsed.searchParams.has('v')) {
      videoId = parsed.searchParams.get('v');
    }

    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  } catch {
    return null;
  }
}

export default function VideoModal({
  youtubeUrl,
  title,
  onClose,
}: VideoModalProps) {
  const embedUrl = getYoutubeEmbedUrl(youtubeUrl);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fadeUp"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-charcoal-panel shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <p className="truncate pr-4 font-display text-lg font-semibold text-paper">
            {title}
          </p>
          <div className="flex shrink-0 items-center gap-3">
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-mist transition-colors hover:text-gold"
            >
              Ouvrir sur YouTube <ExternalLink size={14} />
            </a>
            <button
              onClick={onClose}
              aria-label="Fermer la vidéo"
              className="rounded-full p-1.5 text-mist transition-colors hover:bg-white/10 hover:text-paper"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="aspect-video w-full bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center text-mist">
              <p>Impossible de charger cette vidéo directement.</p>
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn-gold">
                Voir sur YouTube <ExternalLink size={16} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
