"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Bot,
  Send,
  Lightbulb,
  BookOpen,
  GraduationCap,
  Brain,
  Sparkles,
  User,
  Minimize2,
} from "lucide-react";
import { callGroqAPI } from "../utils/groq";
import ReactMarkdown from "react-markdown";

interface TeacherChatProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  text: string;
  from: "user" | "bot";
  timestamp: Date;
}

export default function TeacherChat({ isOpen, onClose }: TeacherChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hola doctor Andres felipe Betancourt, un gusto que este ensayando Lección Magica, creada por IA CONEXIONES. Soy tu asistente pedagógico **MagiTeach**. Puedo ayudarte con estrategias de enseñanza, planificación de clases, gestión del aula y más. ¿En qué te puedo apoyar hoy?",
      from: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]); // Scroll también cuando empieza a cargar

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const currentInput = input.trim();
    const userMessage: Message = {
      text: currentInput,
      from: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const conversationHistory = messages
        .slice(-6)
        .map(
          (msg) =>
            `${msg.from === "user" ? "Profesor" : "Asistente"}: ${msg.text}`
        )
        .join("\n");

      const prompt = `Eres 'MagiTeach', un asistente pedagógico experto para docentes en Colombia.    
Tus objetivos:
- Dar estrategias prácticas y modernas.
- Sugerir recursos accesibles en el contexto colombiano.
- Mantener un tono profesional pero empático y motivador.
- Usar formato Markdown para estructurar bien la respuesta (listas, negritas).

Historial reciente:
${conversationHistory}

Consulta del profesor:
"${currentInput}"

Responde de manera concisa pero completa (máx 3-4 párrafos si es explicación, o listas si es paso a paso).
Eres un asistente pedagógico profesional para docentes. Tu función es apoyar a profesores en sus procesos de enseñanza y aprendizaje, ayudándolos a planear, mejorar y ejecutar clases de alta calidad. Solo puedes responder preguntas relacionadas con educación, pedagogía, didáctica, planeación académica, evaluación, desarrollo de competencias y procesos de aprendizaje. Si el usuario hace una pregunta que no tenga relación con el ámbito educativo, debes rechazarla de manera respetuosa e indicar que solo atiendes consultas pedagógicas.

Debes diseñar clases completas y bien estructuradas según el tema, grado o nivel educativo solicitado, incluyendo como mínimo: objetivo general, objetivos específicos, competencias, saberes previos, desarrollo de la clase (inicio, desarrollo y cierre), actividades pedagógicas claras y creativas, estrategias didácticas, recursos, criterios de evaluación y recomendaciones para atender la diversidad de los estudiantes. También debes proponer actividades educativas individuales y grupales, talleres, proyectos, evaluaciones, juegos pedagógicos y estrategias innovadoras que fortalezcan el aprendizaje.

Explica los temas académicos con claridad, usando lenguaje pedagógico, ejemplos prácticos y explicaciones paso a paso, adaptando la profundidad del contenido a la edad y nivel de los estudiantes. Ajusta tus respuestas al contexto educativo (presencial, virtual, rural o urbano) y al ritmo de aprendizaje de los estudiantes, promoviendo siempre el aprendizaje significativo, el pensamiento crítico y la participación activa.

Mantén un tono profesional, respetuoso y motivador. Tus respuestas deben ser claras, organizadas y estructuradas. No actúes como asistente general ni respondas temas ajenos a la educación. Tu misión es fortalecer la labor docente y mejorar la experiencia de enseñanza-aprendizaje.`;

      const botResponse = await callGroqAPI(prompt);
      setMessages((prev) => [
        ...prev,
        {
          text: botResponse,
          from: "bot",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error en chat:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Disculpa, tuve un pequeño problema de conexión. ¿Podrías intentar preguntar de nuevo?",
          from: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickSuggestions = [
    {
      icon: Lightbulb,
      text: "Dinámicas para iniciar clase",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: BookOpen,
      text: "Estrategias de lectura crítica",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: GraduationCap,
      text: "Formatos de evaluación",
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: Brain,
      text: "Manejo de conflictos en aula",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-[60] shadow-2xl rounded-2xl flex flex-col overflow-hidden w-[400px] sm:w-[450px] h-[600px] border border-white/20 font-sans"
          style={{
            boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
          }}
        >
          {/* Header Premium */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 shrink-0">
            {/* Patrón de fondo sutil */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

            <div className="relative flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-sm animate-pulse"></div>
                  <div className="bg-white/20 p-2 rounded-full border border-white/30 backdrop-blur-md">
                    <Bot size={24} className="text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-purple-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight">
                    MagiTeach
                  </h3>
                  <p className="text-indigo-100 text-xs font-medium">
                    Asistente Pedagógico IA
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors text-white/90 hover:text-white"
              >
                <Minimize2 size={20} />
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 scroll-smooth">
            {/* Mensaje de bienvenida / Sugerencias si no hay mensajes del usuario aún (solo el inicial del bot) */}
            {messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 space-y-4"
              >
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                  Aquí tienes algunas ideas para empezar:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {quickSuggestions.map((sug, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setInput(sug.text)}
                      className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group text-left"
                    >
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-br ${sug.color} text-white`}
                      >
                        <sug.icon size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {sug.text}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Mensajes */}
            <div className="space-y-6">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    msg.from === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.from === "user"
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                        : "bg-gradient-to-br from-purple-500 to-pink-500"
                    }`}
                  >
                    {msg.from === "user" ? (
                      <User size={14} className="text-white" />
                    ) : (
                      <Bot size={14} className="text-white" />
                    )}
                  </div>

                  {/* Burbuja */}
                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 shadow-sm text-sm leading-relaxed ${
                      msg.from === "user"
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-tl-sm"
                    }`}
                  >
                    <div className="markdown-content">
                      <ReactMarkdown
                        components={{
                          strong: ({ node, ...props }) => (
                            <span
                              className="font-bold text-indigo-700 dark:text-indigo-400"
                              {...props}
                            />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul
                              className="list-disc ml-4 my-2 space-y-1"
                              {...props}
                            />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol
                              className="list-decimal ml-4 my-2 space-y-1"
                              {...props}
                            />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3
                              className="font-bold text-base mt-2 mb-1"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Loading State */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 mt-6"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></span>
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Pensando...
                  </span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shrink-0">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu consulta pedagógica..."
                disabled={isLoading}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
              >
                {isLoading ? (
                  <Sparkles size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
            <div className="text-center mt-2">
              <p className="text-[10px] text-gray-400">
                Impulsado por IA. Verifica la información importante.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
