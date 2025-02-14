import { supabase, type Session } from '../lib/supabase'

// 日付をYYYY-MM-DD形式に変換する関数
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short'
  })
}

export const Sessions = async () => {
  const { data: sessions, error } = await supabase
    .from('public_chat_sessions')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        エラーが発生しました
      </div>
    )
  }

  // セッションを日付でグループ化
  const groupedSessions = sessions.reduce((acc, session) => {
    const date = new Date(session.created_at).toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(session)
    return acc
  }, {} as { [key: string]: Session[] })

  // 日付の配列を作成（降順）
  const dates = Object.keys(groupedSessions).sort((a, b) => b.localeCompare(a))

  return (
    <>
      <div className="pt-24 pb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white">
          Chat Sessions
        </h1>
      </div>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {dates.map(date => (
            <div key={date} className="mb-6">
              <div className="text-lg font-semibold text-white mb-2">
                {formatDate(date)}
              </div>
              <div className="space-y-2">
                {groupedSessions[date].map((session: Session) => (
                  <a
                    key={session.id}
                    href={`/sessions/${session.id}`}
                    className="block bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-sm 
                      hover:shadow-md transition-all duration-200 ease-in-out"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-500 dark:text-gray-400">
                          #{session.id}
                        </span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {new Date(session.created_at).toLocaleTimeString('ja-JP', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        User: {session.user_id}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
} 