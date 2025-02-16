import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { renderer } from './renderer'
import { Layout } from './components/Layout'
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
      <Sessions />
    </Layout>,
    { title: "Nike Portfolio | Sessions" } 
  )
})

// Blog page
app.get('/sessions', async (c) => {
  return c.render(
    <Layout>
      {/* @ts-expect-error Server Component */}
      <Sessions />
    </Layout>,
    { title: "Nike Portfolio | Sessions" }
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
