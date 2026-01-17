import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const ChatbotSidebar = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: t("chat.welcome"),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        "That's a great question! Based on your interests, I'd suggest starting with market research in your local area.",
        "Many successful entrepreneurs started exactly where you are. The key is to validate your idea with real potential customers.",
        "Consider starting small with a minimal viable product (MVP) to test your concept before investing heavily.",
        "Your skills could translate well into several business models. Would you like me to explore some options?",
        "Location-based businesses often have an advantage in rural areas due to less competition.",
      ];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-forest text-white shadow-large hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex items-center justify-center ${isOpen ? "hidden" : ""}`}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" strokeWidth={1.5} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-terracotta rounded-full border-2 border-background" />
      </motion.button>

      {/* Chat Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-40 w-full sm:w-96 bg-card border-l border-border shadow-xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-sage" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-foreground">{t("chat.title")}</h3>
                    <p className="text-xs text-muted-foreground">{t("chat.subtitle")}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground rounded-full"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-5">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === "user"
                            ? "bg-sage/20"
                            : "bg-secondary"
                        }`}
                      >
                        {message.role === "user" ? (
                          <User className="w-4 h-4 text-sage" strokeWidth={1.5} />
                        ) : (
                          <Bot className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                          message.role === "user"
                            ? "bg-forest text-white rounded-tr-sm"
                            : "bg-secondary text-foreground rounded-tl-sm"
                        }`}
                      >
                        {message.content}
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <Bot className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                      </div>
                      <div className="bg-secondary p-4 rounded-2xl rounded-tl-sm">
                        <div className="thinking-dots flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                          <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                          <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-5 border-t border-border">
                <div className="flex gap-3">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t("chat.placeholder")}
                    className="flex-1 rounded-full border-border bg-secondary/30 h-12"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="bg-forest hover:bg-forest/90 text-white rounded-full h-12 w-12 p-0"
                  >
                    <Send className="w-4 h-4" strokeWidth={1.5} />
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotSidebar;
