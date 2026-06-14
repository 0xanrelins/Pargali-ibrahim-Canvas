import type { PanelKind } from './panels'

type PanelContentProps = {
  kind: PanelKind
}

export function PanelContent({ kind }: PanelContentProps) {
  switch (kind) {
    case 'chart':
      return (
        <div className="panel-content panel-content--chart">
          <div className="chart-line" />
          <p className="content-hint">Chart alanı</p>
        </div>
      )
    case 'orderbook':
      return (
        <table className="data-table">
          <thead>
            <tr>
              <th>Price</th>
              <th>Size</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="ask">
              <td>67,842.10</td>
              <td>0.42</td>
              <td>28,494</td>
            </tr>
            <tr className="ask">
              <td>67,841.50</td>
              <td>1.15</td>
              <td>77,917</td>
            </tr>
            <tr className="spread">
              <td colSpan={3}>Spread 0.12</td>
            </tr>
            <tr className="bid">
              <td>67,840.20</td>
              <td>0.88</td>
              <td>59,699</td>
            </tr>
            <tr className="bid">
              <td>67,839.00</td>
              <td>2.10</td>
              <td>142,462</td>
            </tr>
          </tbody>
        </table>
      )
    case 'positions':
      return (
        <table className="data-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Side</th>
              <th>Size</th>
              <th>PnL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>BTC/USDT</td>
              <td className="long">Long</td>
              <td>0.25</td>
              <td className="up">+$312</td>
            </tr>
            <tr>
              <td>ETH/USDT</td>
              <td className="short">Short</td>
              <td>4.0</td>
              <td className="down">-$48</td>
            </tr>
          </tbody>
        </table>
      )
    case 'watchlist':
      return (
        <ul className="watchlist">
          <li>
            <span>ETH/USDT</span>
            <span className="up">+2.4%</span>
          </li>
          <li>
            <span>SOL/USDT</span>
            <span className="down">-0.8%</span>
          </li>
          <li>
            <span>AVAX/USDT</span>
            <span className="up">+1.1%</span>
          </li>
        </ul>
      )
    case 'trades':
      return (
        <table className="data-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Price</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>12:04:11</td>
              <td className="up">67,840.20</td>
              <td>0.05</td>
            </tr>
            <tr>
              <td>12:04:08</td>
              <td className="down">67,839.80</td>
              <td>0.12</td>
            </tr>
            <tr>
              <td>12:04:02</td>
              <td className="up">67,841.00</td>
              <td>0.33</td>
            </tr>
          </tbody>
        </table>
      )
    case 'ticker':
      return (
        <div className="ticker-grid">
          <div className="ticker-stat">
            <span className="ticker-label">24h High</span>
            <span className="ticker-value">68,120</span>
          </div>
          <div className="ticker-stat">
            <span className="ticker-label">24h Low</span>
            <span className="ticker-value">66,402</span>
          </div>
          <div className="ticker-stat">
            <span className="ticker-label">Volume</span>
            <span className="ticker-value">1.2B</span>
          </div>
          <div className="ticker-stat">
            <span className="ticker-label">Funding</span>
            <span className="ticker-value up">0.01%</span>
          </div>
        </div>
      )
  }
}
