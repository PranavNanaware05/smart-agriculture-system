export function LoadingSpinner({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-leaf-200 border-t-leaf-600 ${sizes[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
