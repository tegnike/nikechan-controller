import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { renderer } from './renderer'
import { Layout } from './components/Layout'
import { Model } from './components/Model'
import { Gallery } from './components/Gallery'
import { Blog } from './components/Blog'
import { BlogDetail } from './components/BlogDetail'
import { MonthlySummary } from './components/MonthlySummary'
import { About } from './components/About'
import { Sessions } from './components/Sessions'
import { SessionDetail } from './components/SessionDetail'

const app = new Hono()

// 静的ファイルの配信設定を追加
app.use('/images/*', serveStatic({ root: './public' }))
app.use('/static/*', serveStatic({ root: './public' }))

app.use(renderer)

// Home page
app.get('/', (c) => {
  c.header('Cache-Control', 'public, max-age=3600') // 1時間キャッシュ

  return c.render(
    <Layout>
      <Model />
      <Gallery />
    </Layout>,
    { title: "Nike Portfolio | Gallery" } 
  )
})

// Blog page
app.get('/blog', async (c) => {
  return c.render(
    <Layout>
      {/* @ts-expect-error Server Component */}
      <Blog />
    </Layout>,
    { title: "Nike Portfolio | Blog" }
  )
})

// Blog detail page
app.get('/blog/:id', async (c) => {
  const id = c.req.param('id')
  return c.render(
    <Layout>
      {/* @ts-expect-error Server Component */}
      <BlogDetail id={id} />
    </Layout>,
    { title: "Nike Portfolio | Blog Detail" }
  )
})

// Blog monthly summary page
app.get('/blog/summary/:yearMonth', async (c) => {
  const yearMonth = c.req.param('yearMonth')
  return c.render(
    <Layout>
      {/* @ts-expect-error Server Component */}
      <MonthlySummary yearMonth={yearMonth} />
    </Layout>,
    { title: "Nike Portfolio | Monthly Summary" }
  )
})

// About me page
app.get('/about', (c) => {
  return c.render(
    <Layout>
      <About />
    </Layout>,
    { title: "Nike Portfolio | About" }
  )
})

// Sessions list page
app.get('/sessions', async (c) => {
  return c.render(
    <Layout>
      {/* @ts-expect-error Server Component */}
      <Sessions />
    </Layout>
  )
})

// Session detail page
app.get('/sessions/:id', async (c) => {
  const id = c.req.param('id')
  return c.render(
    <Layout>
      {/* @ts-expect-error Server Component */}
      <SessionDetail id={id} />
    </Layout>
  )
})

export default app
