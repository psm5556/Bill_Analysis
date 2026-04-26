interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  className = '',
}: DataTableProps<T>) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`text-left py-2 px-3 text-slate-400 font-medium whitespace-nowrap ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-slate-800 ${i % 2 === 0 ? 'bg-slate-900/30' : ''} hover:bg-slate-800/50 transition-colors`}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className={`py-2 px-3 text-slate-200 ${col.className ?? ''}`}>
                  {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
