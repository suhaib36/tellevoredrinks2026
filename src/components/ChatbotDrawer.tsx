import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ShoppingBag, 
  Plus, 
  RotateCcw, 
  Check, 
  Heart,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  recommendedProducts?: Product[];
  actionPill?: { text: string; tab: string };
}

export const ChatbotDrawer: React.FC = () => {
  const { 
    isChatbotOpen, 
    setIsChatbotOpen, 
    products, 
    addToCart, 
    user, 
    setActiveTab, 
    setSelectedProduct,
    showToast 
  } = useApp();

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialGreeting: ChatMessage = {
    id: 'msg-0',
    sender: 'bot',
    text: `Moi, ${user.name.split(' ')[0]}! 🌲 Welcome to Tellervo. I am your Forest Sommelier, steeped in ancient Finnish botanical traditions and subarctic wild harvests.\n\nWhether you desire an adaptogenic tonic for daytime clarity, a zero-proof aperitif for dusk, or pairing notes for your favorite botanicals, I am here to guide your palate. What are you looking to experience today?`,
    time: 'Just now',
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);

  const quickPrompts = [
    { label: '🌿 Relaxing evening tonic', query: 'I want something relaxing for the evening without alcohol' },
    { label: '⚡ Energy & mental clarity', query: 'What is the best drink for focus and energy?' },
    { label: '🫐 Tell me about Cloudberries', query: 'Tell me about the Cloudberry Golden Sparkler' },
    { label: '🍸 Non-alcoholic cocktails', query: 'Recommend a zero-proof spirit for cocktails' },
    { label: '📦 Track my order', query: 'Where is my order #TL-89421 right now?' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatbotOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isChatbotOpen]);

  if (!isChatbotOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Smart botanical logic
    setTimeout(() => {
      const q = query.toLowerCase();
      let botResponse = '';
      let recommended: Product[] = [];
      let action: { text: string; tab: string } | undefined = undefined;

      if (q.includes('evening') || q.includes('relax') || q.includes('sleep') || q.includes('calm') || q.includes('night') || q.includes('unwind')) {
        botResponse = `For winding down in the evening, I highly recommend our **Smoked Lingon Spritz** and the copper-distilled **Taiga Botanical Reserve**.\n\nThe wild lingonberries are gently smoked over sweet alder wood coals, releasing soothing natural tannins that settle the nervous system without alcohol. Pour over crystal ice with a sprig of fresh rosemary.`;
        recommended = products.filter(p => p.id === 'smoked-lingon-spritz' || p.id === 'taiga-botanical-reserve');
      } else if (q.includes('focus') || q.includes('energy') || q.includes('morning') || q.includes('study') || q.includes('work') || q.includes('clarity')) {
        botResponse = `For morning invigoration and sharp focus, our cold-pressed **Spruce Needle & Lime Tonic** and the potent **Birch Chaga Immunity Elixir** are unmatched.\n\nYoung spring spruce tips contain high levels of refreshing pinene and natural Vitamin C, while Lapland chaga provides 2000mg of beta-glucans for sustained mental endurance.`;
        recommended = products.filter(p => p.id === 'spruce-needle-lime' || p.id === 'birch-chaga-immunity-elixir');
      } else if (q.includes('cloudberry') || q.includes('hilla') || q.includes('golden')) {
        botResponse = `The **Cloudberry Golden Sparkler** is celebrated as the "Gold of the Arctic". Hand-harvested across subarctic bogs near Inari, it pairs radiant amber berry tartness with natural spruce aromatics. It is 100% organic with zero refined sugars.`;
        recommended = products.filter(p => p.id === 'cloudberry-golden-sparkler');
      } else if (q.includes('spirit') || q.includes('cocktail') || q.includes('zero-proof') || q.includes('mocktail') || q.includes('alcohol') || q.includes('0.0')) {
        botResponse = `Our crown jewel is the **Taiga Botanical Reserve (0.0% ABV)**. Copper-pot distilled with Arctic juniper, smoked peat moss, and mountain rowanberries, it delivers the complex weight and botanic bite of high-end gin or aquavit, with zero alcohol.\n\nAlso look into our **Wild Rowanberry Aperitif** for a bittersweet Negroni-style profile.`;
        recommended = products.filter(p => p.id === 'taiga-botanical-reserve' || p.id === 'wild-rowanberry-aperitif');
      } else if (q.includes('track') || q.includes('order') || q.includes('delivery') || q.includes('where is')) {
        botResponse = `Your active order **#TL-89421** is currently on its delivery route with **Posti Eco** (Electric Van)! 🚚\n\nDriver Marko S. is approximately 4 stops away from **Mannerheimintie 14 B, Helsinki**. Expected delivery is between **14:35 and 15:15 today**.`;
        action = { text: 'View Live Delivery Map', tab: 'profile' };
      } else if (q.includes('seed') || q.includes('reward') || q.includes('point') || q.includes('patron')) {
        botResponse = `You currently have **680 Seeds** in your Taiga Patron account! You need 320 more seeds to graduate to **Borealis Master** tier.\n\nYou have enough seeds right now to claim a **Free 4-Pack of Any Tonic (500 Seeds)** or **€10 Off Next Order (400 Seeds)**.`;
        action = { text: 'Explore Rewards Catalog', tab: 'rewards' };
      } else if (q.includes('chaga') || q.includes('mushroom') || q.includes('immunity')) {
        botResponse = `Our **Birch Chaga Immunity Elixir** is wild-harvested exclusively from living silver birch trunks in Finland. It delivers 2000mg of dual-extracted beta-glucans and antioxidants per 60ml daily shot, providing gentle cellular defense.`;
        recommended = products.filter(p => p.id === 'birch-chaga-immunity-elixir' || p.id === 'birch-chaga-myrrh');
      } else {
        botResponse = `A wonderful query! At Tellervo, every blend is crafted with 100% wild-foraged Scandinavian botanicals, pure Nordic spring waters, and zero refined sugars.\n\nHere are two of our most loved seasonal cellar selections crafted for your Taiga Patron profile:`;
        recommended = products.slice(0, 2);
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProducts: recommended,
        actionPill: action,
      };

      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 700);
  };

  const handleReset = () => {
    setMessages([initialGreeting]);
    showToast('Sommelier conversation refreshed', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsChatbotOpen(false)}
        className="fixed inset-0 bg-[#0E1D14]/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container (full width on mobile, max-w-md on desktop) */}
      <div className="relative w-full max-w-md bg-[#FBF9F5] h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="p-3.5 bg-white border-b border-[#EAE4D7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Tellervo Goddess Logo Emblem */}
            <div className="w-10 h-10 rounded-full bg-white border border-[#E5A953]/60 p-0.5 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
              <img
                src="/tellervo-logo.png"
                alt="Tellervo Drinks Sommelier"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-editorial text-lg font-semibold text-[#14261B] leading-tight">
                  Forest Sommelier
                </h3>
                <span className="w-2 h-2 rounded-full bg-[#277E46] animate-pulse" />
              </div>
              <p className="text-[10px] text-[#86754D] font-bold tracking-wider uppercase">
                Luonnon Rohdot • Botanical AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReset}
              title="Reset conversation"
              className="w-8 h-8 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#55695C] hover:bg-[#ECE6DA] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsChatbotOpen(false)}
              className="w-8 h-8 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#3D5244] hover:bg-[#ECE6DA] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end gap-2 max-w-[88%]">
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-white border border-[#E5A953]/40 p-0.5 overflow-hidden shrink-0 shadow-xs mb-1">
                    <img src="/tellervo-logo.png" alt="Tellervo" className="w-full h-full object-contain" />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-soft-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#183324] text-white rounded-br-xs'
                      : 'bg-white text-[#1D3224] border border-[#EAE3D6] rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {/* Recommended Products Carousel within Chat Message */}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#F0ECE1] space-y-2">
                      <div className="text-[10px] font-bold tracking-wider text-[#A17430] uppercase flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#E5A953]" />
                        <span>Sommelier Recommendation</span>
                      </div>

                      {msg.recommendedProducts.map(prod => (
                        <div
                          key={prod.id}
                          className="bg-[#FAF7F0] rounded-xl p-2.5 border border-[#E8DFCF] flex items-center justify-between gap-2.5"
                        >
                          <div
                            onClick={() => {
                              setIsChatbotOpen(false);
                              setSelectedProduct(prod);
                            }}
                            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                          >
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80";
                              }}
                              className="w-11 h-11 rounded-lg object-cover border border-[#E6DDCD] shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <h5 className="font-editorial text-xs font-bold text-[#14261B] truncate hover:text-[#285737] transition-colors">
                                {prod.name}
                              </h5>
                              <span className="text-[10px] text-[#78887C] block truncate">
                                {prod.size} • €{prod.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => addToCart(prod)}
                            className="px-2.5 py-1.5 bg-[#183324] text-[#FAF8F3] text-[10px] font-bold rounded-lg flex items-center gap-1 hover:bg-[#284C37] active:scale-95 transition-all shrink-0 shadow-sm"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Navigation Action Pill */}
                  {msg.actionPill && (
                    <button
                      onClick={() => {
                        setActiveTab(msg.actionPill!.tab as any);
                        setIsChatbotOpen(false);
                      }}
                      className="mt-2.5 px-3 py-1.5 bg-[#183324] text-[#E5A953] text-[11px] font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#254632] transition-colors"
                    >
                      <span>{msg.actionPill.text}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <span className="text-[9px] text-[#9EAFA1] mt-1 px-1">
                {msg.time}
              </span>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white border border-[#E5A953]/40 p-0.5 overflow-hidden shrink-0 shadow-xs">
                <img src="/tellervo-logo.png" alt="Tellervo" className="w-full h-full object-contain" />
              </div>
              <div className="bg-white border border-[#EAE3D6] rounded-2xl px-3.5 py-2.5 rounded-bl-xs flex items-center gap-1.5 shadow-soft-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#183324] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#183324] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#183324] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-3 py-1.5 bg-[#F6F3EC] border-t border-[#EAE4D7] overflow-x-auto no-scrollbar flex gap-1.5 shrink-0">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              className="px-2.5 py-1 bg-white text-[#203628] rounded-full text-[10px] font-medium whitespace-nowrap border border-[#E2DBD0] hover:border-[#B5A894] hover:bg-[#FAF8F3] transition-all shrink-0"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#EAE4D7]">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask for recommendations, ingredients..."
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-[#F8F6F0] border border-[#E0D9CB] rounded-2xl text-xs text-[#183021] placeholder-[#8F9E92] focus:outline-none focus:ring-1 focus:ring-[#183324] focus:bg-white"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 rounded-2xl bg-[#183324] text-[#FAF8F3] flex items-center justify-center hover:bg-[#244531] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-1.5">
            <span className="text-[10px] text-[#9FAFA2]">
              Powered by Tellervo Nordic Botanical Lab
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
