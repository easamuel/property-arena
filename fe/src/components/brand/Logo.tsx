import { Link, useLocation, useNavigate } from 'react-router-dom';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  /** Kept for call-site compat — mark has transparent canvas (no white plate). */
  variant?: 'default' | 'onDark' | 'auto';
  to?: string;
  className?: string;
  /** Runs before navigation (e.g. leave workspace layout for homepage). */
  onNavigate?: () => void;
};

const heights = { sm: 'h-8', md: 'h-11', lg: 'h-16' };

function scrollPageTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document.querySelectorAll('main').forEach((el) => {
    el.scrollTop = 0;
  });
}

/**
 * Official PropertyArena mark (exact brand asset).
 * Canvas is transparent — house / "Property" whites stay as brand fill.
 * On homepage, click scrolls to top; elsewhere navigates home.
 */
export function Logo({ size = 'md', to = '/', className = '', onNavigate }: LogoProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === '/' || pathname === '';

  const onClick = (e: React.MouseEvent) => {
    onNavigate?.();
    if (!isHome) return;
    e.preventDefault();
    scrollPageTop();
    if (window.location.hash) {
      navigate('/', { replace: true });
    }
  };

  return (
    <Link
      to={to}
      onClick={onClick}
      aria-label="PropertyArena home"
      className={`inline-flex shrink-0 items-center transition-opacity hover:opacity-90 ${className}`}
    >
      <img
        src="/logo.png"
        alt="PropertyArena"
        className={`${heights[size]} w-auto max-w-[11rem] object-contain object-left`}
        decoding="async"
      />
    </Link>
  );
}

export default Logo;
