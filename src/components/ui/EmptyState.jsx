import Image from 'next/image';

export default function EmptyState({ title, message, action }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <Image src="/images/empty-state.svg" alt="" width={160} height={120} className="mb-5" />
      <h3 className="text-base font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="px-6 py-12 text-center" role="alert">
      <h3 className="text-base font-bold">We could not load this data</h3>
      <p className="mt-1 text-sm text-slate-500">{error?.message || 'Something went wrong.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 text-sm font-semibold text-brand-700 hover:underline">
          Try again
        </button>
      )}
    </div>
  );
}
