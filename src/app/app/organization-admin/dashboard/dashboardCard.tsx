import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-4">
        <CardTitle className="text-base font-bold text-gray-600">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-4xl font-bold text-gray-900">{value.toLocaleString()}</div>
        <p className="text-xs text-gray-500 mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}