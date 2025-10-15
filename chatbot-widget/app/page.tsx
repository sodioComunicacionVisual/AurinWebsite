import ChatbotWidget from "@/components/chatbot-widget"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Chatbot Widget Demo</h1>
        <p className="text-slate-300 mb-8">
          Click the chatbot bubble in the bottom-right corner to start a conversation. Try sending messages, uploading
          files, and exploring the interface!
        </p>

        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-3">Features:</h2>
          <ul className="space-y-2 text-slate-300">
            <li>• Expandable chat bubble with smooth animations</li>
            <li>• Dark theme with yellow-green accent color</li>
            <li>• File upload with drag-and-drop support</li>
            <li>• Typing indicators and message timestamps</li>
            <li>• Fully responsive (mobile-friendly)</li>
            <li>• Accessible keyboard navigation</li>
          </ul>
        </div>
      </div>

      <ChatbotWidget />
    </main>
  )
}
