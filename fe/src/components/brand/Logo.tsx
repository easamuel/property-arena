import { Link } from 'react-router-dom';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  /** Kept for call-site compat — mark has transparent canvas (no white plate). */
  variant?: 'default' | 'onDark' | 'auto';
  to?: string;
  className?: string;
};

const heights = { sm: 'h-8', md: 'h-11', lg: 'h-16' };

/**
 * Official PropertyArena mark (exact brand asset).
 * Canvas is transparent — house / "Property" whites stay as brand fill.
 */
export function Logo({ size = 'md', to = '/', className = '' }: LogoProps) {
  return (
    <Link
      to={to}
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
