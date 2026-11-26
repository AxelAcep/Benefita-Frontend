import { LoaderCircle } from "lucide-react";

export default function TableLoading({ columns }: { columns: number }) {
  return (
    <tr>
      <td colSpan={columns} className="px-5 py-8">
        <div role="status" aria-live="polite" className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-700">
          <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin motion-reduce:animate-none" />
          Memuat data perusahaan...
        </div>
        <div aria-hidden="true" className="mt-6 space-y-3 animate-pulse motion-reduce:animate-none">
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="flex gap-4">
              <div className="h-4 w-8 rounded bg-zinc-100" />
              <div className="h-4 flex-1 rounded bg-zinc-100" />
              <div className="h-4 w-1/4 rounded bg-zinc-100" />
            </div>
          ))}
        </div>
      </td>
    </tr>
  );
}
