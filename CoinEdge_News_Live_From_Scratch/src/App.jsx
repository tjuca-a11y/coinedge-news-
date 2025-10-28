import { useEffect, useRef, useState } from 'react'

function useAutoScroll(ref, speed = 0.35) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf
    const tick = () => {
      el.scrollTop += speed
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) el.scrollTop = 0
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [ref, speed])
}

function formatSource(link) {
  try { return new URL(link).hostname.replace('www.', '') } catch { return '' }
}

export default function App(){
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const listRef = useRef(null)
  useAutoScroll(listRef, 0.35)

  const fetchNews = async () => {
    try{
      setError(null)
      const res = await fetch('/api/rss')
      const data = await res.json()
      setNews(data)
      setLoading(false)
    }catch(e){
      console.error(e)
      setError('Failed to load news. Try again shortly.')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
    const interval = setInterval(fetchNews, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <header>
        <div className="container nav">
          <div className="brand">
            <div className="logo" />
            <div>CoinEdge News</div>
          </div>
          <div className="cta">
            <span className="badge">Live</span>
            <button className="btn secondary" onClick={fetchNews}>Refresh</button>
            <a href="https://start.coinedge.io" target="_blank" rel="noreferrer">
              <button className="btn">Open Platform</button>
            </a>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div className="card">
            <div style={{color:'var(--accent)', fontWeight:700, fontSize:12}}>CRYPTO HEADLINES</div>
            <h1 className="headline">Stay ahead with real‑time Bitcoin & crypto news.</h1>
            <p className="sub">Curated from trusted sources: CoinDesk, CoinTelegraph, Decrypt, Bitcoin Magazine, NewsBTC. Auto‑updated every 5 minutes.</p>
            <div style={{display:'flex', gap:10, marginTop:18, flexWrap:'wrap'}}>
              <span className="badge">No ads</span>
              <span className="badge">Fast</span>
              <span className="badge">Free</span>
            </div>
          </div>

          <div className="card">
            <div className="newsHeader">
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <div className="logo" style={{width:18,height:18}}/>
                <strong>Live Feed</strong>
              </div>
              {loading ? <span className="badge">Loading…</span> : <span className="badge">{news.length} stories</span>}
            </div>

            <div className="newsList" ref={listRef}>
              {error && <div className="newsItem" style={{borderColor:'#7f1d1d'}}>{error}</div>}
              {!error && news.map((item, idx) => (
                <article key={idx} className="newsItem">
                  <div className="meta">
                    <span>{item.pubDate ? new Date(item.pubDate).toLocaleString() : ''}</span>
                    <span>·</span>
                    <span>{formatSource(item.link)}</span>
                  </div>
                  <a href={item.link} target="_blank" rel="noreferrer" style={{textDecoration:'none', color:'inherit'}}>
                    <h3 className="title">{item.title}</h3>
                  </a>
                  {item.contentSnippet && <p style={{color:'var(--muted)'}}>{item.contentSnippet.slice(0, 200)}…</p>}
                </article>
              ))}
              {!error && news.map((item, idx) => (
                <article key={'dup-'+idx} className="newsItem">
                  <div className="meta">
                    <span>{item.pubDate ? new Date(item.pubDate).toLocaleString() : ''}</span>
                    <span>·</span>
                    <span>{formatSource(item.link)}</span>
                  </div>
                  <a href={item.link} target="_blank" rel="noreferrer" style={{textDecoration:'none', color:'inherit'}}>
                    <h3 className="title">{item.title}</h3>
                  </a>
                  {item.contentSnippet && <p style={{color:'var(--muted)'}}>{item.contentSnippet.slice(0, 200)}…</p>}
                </article>
              ))}
            </div>
          </div>
        </section>

        <footer className="footer">
          <div>© {new Date().getFullYear()} CoinEdge — Live Crypto News</div>
          <div>Built with Vite + React • Deployed on Vercel</div>
        </footer>
      </main>
    </>
  )
}
