import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"

export type OpportunityRow = {
  id: string
  title: string
  rationale?: string
  market: string
  score: number | string
}

export function OpportunityTable({ rows }: { rows: OpportunityRow[] }) {
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Opportunity</TableHead>
            <TableHead>Market</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((o) => (
            <TableRow key={o.id}>
              <TableCell>
                <strong>{o.title}</strong>
                {o.rationale ? (
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {o.rationale}
                  </span>
                ) : null}
              </TableCell>
              <TableCell>{o.market}</TableCell>
              <TableCell className="font-bold">{o.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
