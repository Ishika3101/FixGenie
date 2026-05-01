import { useState } from "react"

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false)  //is chatwindow open or closed?
    const [messages, setMessages] = useState([   //array of all chat messages
        {
            role: "bot",
            text: "Hi! I'm FixGenie Assistant 🔧 How can I help you today? You can ask me things like 'I need a plumber in Delhi' or 'How do I book a service?'"
        }
    ])
    const [input, setInput] = useState("")  //what user is currently typing
    const [loading, setLoading] = useState(false)

    const sendMessage = async () => {
        if (!input.trim()) return //if user send empty box or spaces do nothing

        const userMessage = input //we save input in userMessage variable because after that we clear input by setinput so to save the message
        setInput("")
        setMessages(prev => [...prev, { role: "user", text: userMessage }])
        setLoading(true)
//Type 1 — Network failure (no internet, server down)
//         ↓
// fetch() THROWS an error
//         ↓
// catch block runs ✅

// Type 2 — API responds but with error code (like 429)
//         ↓
// fetch() does NOT throw — it returns normally!
//         ↓
// catch block NEVER runs 
//         ↓
// our 429 check inside catch is useless!   so we need to check response status before reading the data
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, //import.meta.env.VITE_GEMINI_API_KEY reads from your .env file — same idea as process.env in backend but Vite uses import.meta.env!
                {
                    method: "POST",  //post because we are sending our message to gemini
                    headers: { "Content-Type": "application/json" }, //headers tell the server that json type data is coming
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                //This tells Gemini WHO it is and HOW to behave. Without this it would just be a generic AI — with this it becomes FixGenie assistant!
                                text: `You are FixGenie Assistant, a helpful chatbot for a home services booking app called FixGenie. 
                                FixGenie connects customers with service providers like plumbers, electricians, carpenters, cleaners etc.
                                Help users find services, answer booking questions, and guide them through the app.
                                Keep responses short, friendly and helpful.
                                User message: ${userMessage}`
                            }]
                        }]
                    })
                }
            )
            // check status BEFORE reading data
            if (response.status === 429) {
                setMessages(prev => [...prev, {
                    role: "bot",
                    text: "I'm getting too many requests! Please wait 1 minute and try again 😊"
                }])
                return
            }

            const data = await response.json() //.json converts data into json object
            const botReply = data.candidates[0].content.parts[0].text  //it is gemini format array of candidates and then inside content parts array

            setMessages(prev => [...prev, { role: "bot", text: botReply }])
        }catch (err) {
            setMessages(prev => [...prev, {
            role: "bot",
            text: "Sorry, I'm having trouble connecting. Please try again!"
        }])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => { //So user can press Enter instead of clicking the send button. Small but important UX detail!
        if (e.key === "Enter") sendMessage()
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-purple-950 text-white px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🔧</span>
                            <div>
                                <p className="font-semibold text-sm">FixGenie Assistant</p>
                                <p className="text-xs text-purple-300">Always here to help</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-purple-300 hover:text-white text-lg font-bold"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80 bg-gray-50">  {/*overflow-y-auto means if the content overflows add a scrollbar space-y-3     → gap between each message bubble
max-h-80      → maximum height, after that it scrolls */}
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                                    msg.role === "user"
                                        ? "bg-purple-950 text-white rounded-br-sm"
                                        : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {/* Loading dots(only shows when loading is true) */}
                        {/*Three dots with different delays so they bounce one after another:0ms   → ●  bounces first
                            150ms → ●  bounces second  
                            300ms → ●  bounces third
                            Result: ● ● ● (wave effect!) */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: "0ms"}}></span>
                                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: "150ms"}}></span>
                                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: "300ms"}}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything..."
                            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading} //no message can be sent if loading
                            className="bg-purple-950 text-white px-3 py-2 rounded-xl hover:bg-purple-800 transition disabled:opacity-50"//disabled:opacity-50 = button looks faded when disabled
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <div className="flex flex-col items-end gap-2">
                {!isOpen && (
                    <div className="bg-white text-purple-950 text-xs font-semibold px-3 py-1 rounded-full shadow-md border border-purple-100 animate-bounce">
                        Need help? Chat with us!
                    </div>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-purple-950 text-white w-14 h-14 rounded-full shadow-lg hover:bg-purple-800 transition flex items-center justify-center text-2xl"
                >
                    {isOpen ? "✕" : "💬"}
                </button>
            </div>
        </div>
    )
}

export default ChatBot