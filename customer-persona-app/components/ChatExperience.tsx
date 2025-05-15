"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Persona } from "@/lib/types";

interface Message {
	role: "user" | "persona";
	content: string;
}

interface ChatExperienceProps {
	persona: Persona;
	companyName: string;
}

export default function ChatExperience({
	persona,
	companyName,
}: ChatExperienceProps) {
	const [messages, setMessages] = useState<Message[]>([
		{ role: "persona", content: persona.initialChallenge },
	]);
	const [newMessage, setNewMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [chatCompleted, setChatCompleted] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Function to convert markdown to HTML (simple version)
	const convertMarkdownToHtml = (markdown: string): string => {
		// Simple markdown conversion for now
		return markdown
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/\*(.*?)\*/g, '<em>$1</em>')
			.replace(/\n/g, '<br>')
			.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
			.replace(/`(.*?)`/g, '<code>$1</code>')
			.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
			.replace(/^# (.*?)$/gm, '<h1>$1</h1>')
			.replace(/^## (.*?)$/gm, '<h2>$1</h2>')
			.replace(/^### (.*?)$/gm, '<h3>$1</h3>')
			.replace(/^\* (.*?)$/gm, '<li>$1</li>')
			.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>')
			.replace(/<li>(.*?)<\/li>/g, '<ul><li>$1</li></ul>')
			.replace(/<\/ul><ul>/g, '');
	};

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!newMessage.trim() || isLoading) return;

		const userMessage = { role: "user" as const, content: newMessage.trim() };
		setMessages((prev) => [...prev, userMessage]);
		setNewMessage("");
		setIsLoading(true);
		setError(null);

		try {
			// Call the backend API through our Next.js API route
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: userMessage,
					persona,
					companyName,
					messageHistory: messages,
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error("API error response:", errorText);
				throw new Error(`Failed to get chat response: ${response.status}`);
			}

			const result = await response.json();

			// Extract the response from the result
			const responseData = result.data || {};
			const responseContent = responseData.response || result.response || "";

			if (responseContent) {
				setMessages((prev) => [
					...prev,
					{ role: "persona", content: responseContent },
				]);

				// Check if this is the final message in the conversation
				if (messages.length >= 10) {
					setChatCompleted(true);
				}
			} else {
				throw new Error("No response content received");
			}
		} catch (error) {
			console.error("Error getting response:", error);
			setError("Failed to get response. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<motion.div
			className="bg-white p-6 rounded-lg shadow-lg border border-gray-100"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="flex items-center mb-6">
				<div
					className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold bg-blue-100 text-blue-600 mr-3`}
				>
					{persona.name.charAt(0)}
				</div>
				<div>
					<h2 className="text-xl font-semibold">Chat with {persona.name}</h2>
					<p className="text-sm text-gray-600">
						{persona.jobTitle} • {persona.location}
					</p>
				</div>
			</div>

			{error && (
				<div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
					<div className="flex items-center">
						<i className="fas fa-exclamation-circle mr-2"></i>
						<p>{error}</p>
					</div>
				</div>
			)}

			<div className="bg-gray-50 p-4 rounded-lg mb-4 h-96 overflow-y-auto">
				<AnimatePresence>
					{messages.map((message, index) => (
						<motion.div
							key={index}
							className={`mb-4 ${message.role === "user" ? "text-right" : ""}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							<div
								className={`inline-block p-4 rounded-lg max-w-[80%] ${
									message.role === "user"
										? "bg-blue-600 text-white rounded-tr-none"
										: "bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm"
								}`}
							>
								{message.role === "persona" ? (
									<div 
										className="markdown-content" 
										dangerouslySetInnerHTML={{ 
											__html: convertMarkdownToHtml(message.content) 
										}} 
									/>
								) : (
									message.content
								)}
							</div>
							<div className="text-xs text-gray-500 mt-1 flex items-center">
								{message.role === "user" ? (
									<>
										<span>You</span>
										<i className="fas fa-user-circle ml-1"></i>
									</>
								) : (
									<>
										<i className="fas fa-user ml-1 mr-1"></i>
										<span>{persona.name}</span>
									</>
								)}
							</div>
						</motion.div>
					))}
				</AnimatePresence>

				{isLoading && (
					<motion.div
						className="mb-4"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<div className="inline-block p-4 rounded-lg bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm">
							<div className="flex space-x-2">
								<motion.div
									className="w-2 h-2 bg-blue-500 rounded-full"
									animate={{ y: [0, -5, 0] }}
									transition={{ repeat: Infinity, duration: 0.6 }}
								></motion.div>
								<motion.div
									className="w-2 h-2 bg-blue-500 rounded-full"
									animate={{ y: [0, -5, 0] }}
									transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
								></motion.div>
								<motion.div
									className="w-2 h-2 bg-blue-500 rounded-full"
									animate={{ y: [0, -5, 0] }}
									transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
								></motion.div>
							</div>
						</div>
						<div className="text-xs text-gray-500 mt-1 flex items-center">
							<i className="fas fa-user ml-1 mr-1"></i>
							<span>{persona.name} is typing...</span>
						</div>
					</motion.div>
				)}

				<div ref={messagesEndRef} />
			</div>

			<form onSubmit={handleSendMessage} className="flex gap-2">
				<input
					type="text"
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
					placeholder={
						chatCompleted ? "Chat completed" : `Reply to ${persona.name}...`
					}
					disabled={isLoading || chatCompleted}
				/>
				<motion.button
					type="submit"
					className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-blue-300 disabled:cursor-not-allowed"
					disabled={!newMessage.trim() || isLoading || chatCompleted}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<i className="fas fa-paper-plane mr-2"></i>
					Send
				</motion.button>
			</form>

			<AnimatePresence>
				{chatCompleted && (
					<motion.div
						className="mt-6 p-4 bg-green-50 text-green-800 rounded-lg border-l-4 border-green-500"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						transition={{ duration: 0.5 }}
					>
						<div className="flex items-center mb-2">
							<i className="fas fa-check-circle text-green-500 mr-2 text-xl"></i>
							<h3 className="font-medium text-lg">
								Chat experience completed!
							</h3>
						</div>
						<p>
							You've successfully helped {persona.name} with their challenge.
						</p>
						<div className="mt-4 flex justify-end">
							<button
								onClick={() => window.location.reload()}
								className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
							>
								<i className="fas fa-redo mr-2"></i>
								Start Over
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
