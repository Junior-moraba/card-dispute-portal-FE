interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function Spinner({ size = 'md' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
  <div className={`${sizeClasses[size]} animate-spin`} data-testid="spinner">
    <div className="w-full h-full rounded-full border-4 border-transparent border-t-red-500 border-r-white border-b-blue-500"></div>
  </div>
);

}
