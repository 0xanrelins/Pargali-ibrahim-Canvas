import { Fragment } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { PanelKind } from './panels'

type PanelContentProps = {
  kind: PanelKind
}

const tableHeadClass = 'h-7 px-1 text-[0.65rem] font-medium text-muted-foreground'
const tableCellClass = 'px-1 py-1 text-right tabular-nums first:text-left'

const watchlistItems = [
  ['ETH/USDT', '+2.4%', 'up'],
  ['SOL/USDT', '-0.8%', 'down'],
  ['AVAX/USDT', '+1.1%', 'up'],
] as const

export function PanelContent({ kind }: PanelContentProps) {
  switch (kind) {
    case 'chart':
      return (
        <Card size="sm" className="h-full gap-0 border-0 bg-transparent py-0 shadow-none ring-0">
          <CardContent className="flex h-full min-h-20 flex-col items-center justify-center px-0 text-center">
            <div
              className="relative mb-2 min-h-20 w-full flex-1 rounded-sm bg-muted/20"
              style={{
                backgroundImage: `linear-gradient(180deg, transparent 70%, var(--chart-glow) 100%)`,
              }}
            >
              <div className="absolute inset-x-[5%] bottom-[30%] top-[20%] skew-x-[-8deg] rounded-b-[50%] border-b-2 border-bid" />
            </div>
            <p className="text-[0.7rem] text-muted-foreground">Chart alanı</p>
          </CardContent>
        </Card>
      )
    case 'orderbook':
      return (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={tableHeadClass}>Price</TableHead>
              <TableHead className={cn(tableHeadClass, 'text-right')}>Size</TableHead>
              <TableHead className={cn(tableHeadClass, 'text-right')}>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-transparent">
              <TableCell className={cn(tableCellClass, 'text-ask')}>67,842.10</TableCell>
              <TableCell className={tableCellClass}>0.42</TableCell>
              <TableCell className={tableCellClass}>28,494</TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell className={cn(tableCellClass, 'text-ask')}>67,841.50</TableCell>
              <TableCell className={tableCellClass}>1.15</TableCell>
              <TableCell className={tableCellClass}>77,917</TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={3}
                className="py-2 text-center text-[0.65rem] text-muted-foreground"
              >
                Spread 0.12
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell className={cn(tableCellClass, 'text-bid')}>67,840.20</TableCell>
              <TableCell className={tableCellClass}>0.88</TableCell>
              <TableCell className={tableCellClass}>59,699</TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell className={cn(tableCellClass, 'text-bid')}>67,839.00</TableCell>
              <TableCell className={tableCellClass}>2.10</TableCell>
              <TableCell className={tableCellClass}>142,462</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
    case 'positions':
      return (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={tableHeadClass}>Symbol</TableHead>
              <TableHead className={cn(tableHeadClass, 'text-right')}>Side</TableHead>
              <TableHead className={cn(tableHeadClass, 'text-right')}>Size</TableHead>
              <TableHead className={cn(tableHeadClass, 'text-right')}>PnL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-transparent">
              <TableCell className={tableCellClass}>BTC/USDT</TableCell>
              <TableCell className={cn(tableCellClass, 'text-long')}>Long</TableCell>
              <TableCell className={tableCellClass}>0.25</TableCell>
              <TableCell className={cn(tableCellClass, 'text-up')}>+$312</TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell className={tableCellClass}>ETH/USDT</TableCell>
              <TableCell className={cn(tableCellClass, 'text-short')}>Short</TableCell>
              <TableCell className={tableCellClass}>4.0</TableCell>
              <TableCell className={cn(tableCellClass, 'text-down')}>-$48</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
    case 'watchlist':
      return (
        <ItemGroup className="gap-0">
          {watchlistItems.map(([symbol, change, direction], index) => (
            <Fragment key={symbol}>
              {index > 0 ? <ItemSeparator className="my-0" /> : null}
              <Item size="xs" className="border-0 px-0 py-2">
                <ItemContent>
                  <ItemTitle>{symbol}</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <Badge
                    variant="outline"
                    className={cn(
                      'border-transparent bg-transparent',
                      direction === 'up' ? 'text-up' : 'text-down',
                    )}
                  >
                    {change}
                  </Badge>
                </ItemActions>
              </Item>
            </Fragment>
          ))}
        </ItemGroup>
      )
    case 'trades':
      return (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={tableHeadClass}>Time</TableHead>
              <TableHead className={cn(tableHeadClass, 'text-right')}>Price</TableHead>
              <TableHead className={cn(tableHeadClass, 'text-right')}>Qty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-transparent">
              <TableCell className={tableCellClass}>12:04:11</TableCell>
              <TableCell className={cn(tableCellClass, 'text-up')}>67,840.20</TableCell>
              <TableCell className={tableCellClass}>0.05</TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell className={tableCellClass}>12:04:08</TableCell>
              <TableCell className={cn(tableCellClass, 'text-down')}>67,839.80</TableCell>
              <TableCell className={tableCellClass}>0.12</TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell className={tableCellClass}>12:04:02</TableCell>
              <TableCell className={cn(tableCellClass, 'text-up')}>67,841.00</TableCell>
              <TableCell className={tableCellClass}>0.33</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
    case 'ticker':
      return (
        <div className="grid h-full grid-cols-2 gap-2">
          {[
            ['24h High', '68,120', 'text-foreground'],
            ['24h Low', '66,402', 'text-foreground'],
            ['Volume', '1.2B', 'text-foreground'],
            ['Funding', '0.01%', 'text-up'],
          ].map(([label, value, valueClass]) => (
            <Card key={label} size="sm" className="rounded-sm py-2 ring-border/60">
              <CardContent className="flex flex-col gap-1 px-2">
                <span className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                  {label}
                </span>
                <span className={cn('text-sm font-semibold tabular-nums', valueClass)}>
                  {value}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    default: {
      const _exhaustive: never = kind
      return _exhaustive
    }
  }
}
