
interface SearchInfoProps {
  totalCount: number;
  searchInfo?: {
    keywords?: string;
    location?: string;
    filters?: any;
  };
}

export default function SearchInfoCard({ totalCount, searchInfo }: SearchInfoProps) {
  if (totalCount <= 0 || !searchInfo) {
    return null;
  }

  return (
    <div className="mt-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
      <p className="font-medium">Total Records: {totalCount}</p>
      {searchInfo && (
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          <p>Search: {searchInfo.keywords}</p>
          <p>Location: {searchInfo.location}</p>
          {searchInfo.filters && (
            <p>Filters: {JSON.stringify(searchInfo.filters)}</p>
          )}
        </div>
      )}
    </div>
  );
}
