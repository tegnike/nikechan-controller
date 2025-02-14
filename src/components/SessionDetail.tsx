import { supabase, type Message, type Session } from '../lib/supabase'

type Props = {
  id: string
}

export const SessionDetail = async ({ id }: Props) => {
  // メッセージを取得
  const { data: messages, error: messageError } = await supabase
    .from('public_messages')
    .select('*')
    .eq('session_id', id)
    .order('created_at', { ascending: true })

  // 現在のセッションのupdated_atを取得
  const { data: currentSession } = await supabase
    .from('public_chat_sessions')
    .select('updated_at')
    .eq('id', id)
    .single()

  // 前後のセッションを取得
  const { data: prevSession } = currentSession ? await supabase
    .from('public_chat_sessions')
    .select('id, updated_at')
    .lt('updated_at', currentSession.updated_at)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single() : { data: null }

  const { data: nextSession } = currentSession ? await supabase
    .from('public_chat_sessions')
    .select('id, updated_at')
    .gt('updated_at', currentSession.updated_at)
    .order('updated_at', { ascending: true })
    .limit(1)
    .single() : { data: null }

  if (messageError) {
    return (
      <div className="text-center py-8 text-red-500">
        エラーが発生しました
      </div>
    )
  }

  return (
    <>
      <div className="pt-24 pb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white">
          Chat Session #{id}
        </h1>
        {currentSession && (
          <div className="text-center text-gray-400 mt-2">
            {new Date(currentSession.updated_at).toLocaleString('ja-JP')}
          </div>
        )}
      </div>
      <div className="container mx-auto px-4 pb-12">
        {/* ナビゲーションボタン */}
        <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
          {prevSession ? (
            <a
              href={`/sessions/${prevSession.id}`}
              className="inline-flex items-center px-4 py-2 rounded-lg
                     bg-gray-700 text-gray-200 font-medium
                     transform transition duration-200 ease-in-out
                     hover:bg-gray-600 hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              前のセッション
            </a>
          ) : (
            <div className="invisible">
              <span className="px-4 py-2">前のセッション</span>
            </div>
          )}
          
          <a
            href="/sessions"
            className="inline-flex items-center px-4 py-2 rounded-lg
                     bg-gray-700 text-gray-200 font-medium
                     transform transition duration-200 ease-in-out
                     hover:bg-gray-600 hover:scale-105"
          >
            一覧に戻る
          </a>

          {nextSession ? (
            <a
              href={`/sessions/${nextSession.id}`}
              className="inline-flex items-center px-4 py-2 rounded-lg
                     bg-gray-700 text-gray-200 font-medium
                     transform transition duration-200 ease-in-out
                     hover:bg-gray-600 hover:scale-105"
            >
              次のセッション
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ) : (
            <div className="invisible">
              <span className="px-4 py-2">次のセッション</span>
            </div>
          )}
        </div>

        {/* チャットメッセージ */}
        <div className="max-w-3xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="space-y-4">
            {messages.map((message: Message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[70%] ${
                    message.role === 'assistant'
                      ? 'bg-white dark:bg-gray-700 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'
                      : 'bg-green-500 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl'
                  } p-4 shadow-md`}
                >
                  <div className="text-sm mb-1 opacity-70">
                    {new Date(message.created_at).toLocaleTimeString('ja-JP')}
                  </div>
                  <div className="whitespace-pre-wrap text-white">{message.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
} 