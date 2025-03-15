
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ResultsTableProps {
  data: any[];
  searchInfo?: {
    keywords?: string;
    location?: string;
    filters?: any;
  };
  totalCount: number;
}

export default function ResultsTable({ data, searchInfo, totalCount }: ResultsTableProps) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b">
        <h3 className="font-medium">Results for: {searchInfo?.keywords}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Found {totalCount} records
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Data extracted from Google Maps based on your search criteria.</TableCaption>
          <TableHeader>
            <TableRow>
              {Object.keys(data[0] || {}).map((header) => (
                <TableHead key={header}>
                  {header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: any, index: number) => (
              <TableRow key={index}>
                {Object.values(item).map((value: any, valueIndex: number) => (
                  <TableCell key={valueIndex}>
                    {typeof value === 'string' && value.startsWith('http') ? (
                      <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View Image
                      </a>
                    ) : (
                      String(value)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
