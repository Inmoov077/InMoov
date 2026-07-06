import { useCallback, useRef, useState } from 'react';
import { Bot, Loader2, Send, Square, User } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import * as api from '@/lib/api';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  mood?: string;
}

const MODELS = [
  { id: 'gemini-text', label: 'Gemini Text' },
  { id: 'gemini-vision', label: 'Gemini Vision' },
  { id: 'llama-vision', label: 'Llama 3.2 Vision (Ollama)' },
];

export function AiChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gemini-text');
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendConversation({
        message: text,
        model_provider: model,
      });

      if (res.ok) {
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            text: res.text ?? '',
            mood: res.mood,
          },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            text: res.error ?? 'Request failed',
          },
        ]);
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: err instanceof Error ? err.message : 'Network error',
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [input, loading, model]);

  const startSession = () => {
    setActive(true);
    setMessages([
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: 'Hi! I’m InMoov. Type a message below and I’ll reply — I can move while we talk.',
        mood: 'happy',
      },
    ]);
  };

  const stopSession = () => {
    abortRef.current?.abort();
    setActive(false);
    setLoading(false);
  };

  return (
    <div>
      <PageHeader
        title="Talk to robot"
        description="Have a text conversation with InMoov. Pick an AI model, start chatting, and watch it move."
        actions={
          <div className="flex gap-2">
            {!active ? (
              <Button size="sm" onClick={startSession}>
                Start chatting
              </Button>
            ) : (
              <Button size="sm" variant="destructive" onClick={stopSession}>
                <Square className="h-4 w-4" />
                End chat
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader className="p-4 pb-2">
            <CardTitle>Choose AI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-2">
            <div className="space-y-2">
              <Label>Which brain to use?</Label>
              <Select value={model} onValueChange={setModel} disabled={!active}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODELS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Badge variant={active ? 'online' : 'offline'}>
              {active ? 'Chatting' : 'Not started'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="p-4 pb-2">
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <ScrollArea className="console-surface h-[400px] p-4">
              {messages.length === 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  Press “Start chatting” above, then type your first message here.
                </p>
              )}
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex gap-3',
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row',
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        msg.role === 'user' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary',
                      )}
                    >
                      {msg.role === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={cn(
                        'max-w-[80%] rounded-lg border px-4 py-2.5 text-sm',
                        msg.role === 'user'
                          ? 'border-accent/30 bg-accent/10 shadow-sm'
                          : 'border-border/80 bg-card-elevated/80 shadow-sm',
                      )}
                    >
                      <p>{msg.text}</p>
                      {msg.mood && (
                        <Badge variant="copper" className="mt-2">
                          mood: {msg.mood}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking…
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            <div className="mt-4 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={active ? 'Type a message…' : 'Start session first'}
                disabled={!active || loading}
              />
              <Button onClick={sendMessage} disabled={!active || loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}