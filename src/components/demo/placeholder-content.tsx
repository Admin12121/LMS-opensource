import { Card, CardContent } from "@/components/ui/card";

export default function PlaceholderContent() {
  return (
    <Card className="rounded-lg border-none mt-4 h-[calc(100vh_-120px)]">
      <CardContent className="p-4 h-full">
        <div className="flex justify-center h-full items-center min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
          <div className="flex flex-col relative">
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
