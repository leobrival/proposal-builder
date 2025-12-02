import {
	Bot,
	ExternalLink,
	Loader2,
	MessageCircle,
	Send,
	Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/components/ui/sheet";
import { cn } from "~/lib/utils";

interface Message {
	role: "user" | "assistant";
	content: string;
	sources?: {
		type: "blog" | "docs";
		slug: string;
		title: string;
	}[];
}

interface AssistantChatProps {
	className?: string;
}

export function AssistantChat({ className }: AssistantChatProps) {
	const [open, setOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [sessionId, setSessionId] = useState<string | null>(null);
	const scrollRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);

	// Check assistant availability and get suggestions
	useEffect(() => {
		const checkStatus = async () => {
			try {
				const response = await fetch("/api/assistant/status");
				const data = await response.json();
				setIsAvailable(data.available);
			} catch {
				setIsAvailable(false);
			}
		};

		const getSuggestions = async () => {
			try {
				const response = await fetch("/api/assistant/suggestions");
				const data = await response.json();
				setSuggestions(data.suggestions || []);
			} catch {
				// Ignore errors
			}
		};

		checkStatus();
		getSuggestions();
	}, []);

	// Scroll to bottom on new messages
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll on messages change
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages]);

	// Focus input when sheet opens
	useEffect(() => {
		if (open && inputRef.current) {
			setTimeout(() => inputRef.current?.focus(), 100);
		}
	}, [open]);

	const sendMessage = async (messageText?: string) => {
		const text = messageText || input.trim();
		if (!text || isLoading) return;

		const userMessage: Message = { role: "user", content: text };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		try {
			const response = await fetch("/api/assistant/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: text,
					history: messages,
					sessionId,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				const assistantMessage: Message = {
					role: "assistant",
					content: data.message,
					sources: data.sources,
				};
				setMessages((prev) => [...prev, assistantMessage]);
				if (data.sessionId) {
					setSessionId(data.sessionId);
				}
			} else {
				const errorMessage: Message = {
					role: "assistant",
					content:
						data.error || "Une erreur s'est produite. Veuillez reessayer.",
				};
				setMessages((prev) => [...prev, errorMessage]);
			}
		} catch {
			const errorMessage: Message = {
				role: "assistant",
				content:
					"Impossible de contacter l'assistant. Verifiez votre connexion.",
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const handleSuggestionClick = (suggestion: string) => {
		sendMessage(suggestion);
	};

	const clearChat = () => {
		setMessages([]);
		setSessionId(null);
	};

	if (isAvailable === false) {
		return null;
	}

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					size="icon"
					className={cn(
						"fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50",
						"bg-gradient-to-br from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600",
						"transition-transform hover:scale-105",
						className,
					)}
				>
					<MessageCircle className="h-6 w-6 text-white" />
					<span className="sr-only">Ouvrir l'assistant</span>
				</Button>
			</SheetTrigger>

			<SheetContent
				side="right"
				className="w-full sm:max-w-md flex flex-col p-0"
			>
				<SheetHeader className="px-4 py-3 border-b">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500">
								<Bot className="h-4 w-4 text-white" />
							</div>
							<div>
								<SheetTitle className="text-base">
									Assistant Sponseasy
								</SheetTitle>
								<p className="text-xs text-muted-foreground">
									Propulse par Claude
								</p>
							</div>
						</div>
						{messages.length > 0 && (
							<Button
								variant="ghost"
								size="sm"
								onClick={clearChat}
								className="text-xs"
							>
								Effacer
							</Button>
						)}
					</div>
				</SheetHeader>

				<ScrollArea className="flex-1 px-4" ref={scrollRef}>
					<div className="py-4 space-y-4">
						{messages.length === 0 ? (
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500">
										<Sparkles className="h-4 w-4 text-white" />
									</div>
									<div className="space-y-2">
										<p className="text-sm text-foreground">
											Bonjour ! Je suis l'assistant Sponseasy. Je peux vous
											aider a :
										</p>
										<ul className="text-sm text-muted-foreground space-y-1">
											<li>- Creer des propositions de sponsoring</li>
											<li>- Configurer l'integration MCP</li>
											<li>- Utiliser les fonctionnalites de la plateforme</li>
											<li>- Resoudre des problemes techniques</li>
										</ul>
									</div>
								</div>

								{suggestions.length > 0 && (
									<div className="space-y-2">
										<p className="text-xs font-medium text-muted-foreground">
											Questions suggerees
										</p>
										<div className="flex flex-wrap gap-2">
											{suggestions.map((suggestion) => (
												<button
													key={suggestion}
													type="button"
													onClick={() => handleSuggestionClick(suggestion)}
													className="text-xs px-3 py-1.5 rounded-full border bg-muted/50 hover:bg-muted transition-colors text-left"
												>
													{suggestion}
												</button>
											))}
										</div>
									</div>
								)}
							</div>
						) : (
							messages.map((message, index) => (
								<div
									key={`${message.role}-${index}`}
									className={cn(
										"flex gap-3",
										message.role === "user" ? "justify-end" : "justify-start",
									)}
								>
									{message.role === "assistant" && (
										<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500">
											<Bot className="h-4 w-4 text-white" />
										</div>
									)}

									<div
										className={cn(
											"max-w-[85%] space-y-2",
											message.role === "user"
												? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-2"
												: "space-y-2",
										)}
									>
										<p
											className={cn(
												"text-sm whitespace-pre-wrap",
												message.role === "assistant" && "text-foreground",
											)}
										>
											{message.content}
										</p>

										{message.sources && message.sources.length > 0 && (
											<div className="flex flex-wrap gap-1 pt-1">
												{message.sources.map((source) => (
													<a
														key={source.slug}
														href={`/${source.type}/${source.slug}`}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
													>
														<ExternalLink className="h-3 w-3" />
														{source.title}
													</a>
												))}
											</div>
										)}
									</div>
								</div>
							))
						)}

						{isLoading && (
							<div className="flex gap-3">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500">
									<Bot className="h-4 w-4 text-white" />
								</div>
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Loader2 className="h-4 w-4 animate-spin" />
									Reflexion en cours...
								</div>
							</div>
						)}
					</div>
				</ScrollArea>

				<div className="border-t p-4">
					<div className="flex gap-2">
						<textarea
							ref={inputRef}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Posez votre question..."
							disabled={isLoading}
							rows={1}
							className={cn(
								"flex-1 resize-none rounded-lg border bg-background px-3 py-2 text-sm",
								"placeholder:text-muted-foreground",
								"focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
								"disabled:cursor-not-allowed disabled:opacity-50",
								"min-h-[40px] max-h-[120px]",
							)}
						/>
						<Button
							size="icon"
							onClick={() => sendMessage()}
							disabled={!input.trim() || isLoading}
							className="shrink-0"
						>
							{isLoading ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Send className="h-4 w-4" />
							)}
							<span className="sr-only">Envoyer</span>
						</Button>
					</div>
					<p className="mt-2 text-[10px] text-muted-foreground text-center">
						L'assistant peut faire des erreurs. Verifiez les informations
						importantes.
					</p>
				</div>
			</SheetContent>
		</Sheet>
	);
}
