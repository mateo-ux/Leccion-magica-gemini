import Groq from "groq-sdk";

export async function callGroqAPI(prompt: string): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
        return "Error: No se encontró la API Key de Groq. Verifica tu archivo .env.local";
    }

    try {
        const groq = new Groq({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true // Necesario para uso en cliente Next.js
        });

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile", // Modelo recomendado para español
            temperature: 0.7,
            max_tokens: 2048,
            top_p: 0.95,
        });

        if (chatCompletion.choices?.[0]?.message?.content) {
            return chatCompletion.choices[0].message.content;
        }

        return "No se pudo obtener una respuesta de la IA.";
    } catch (error) {
        console.error('Error al llamar a Groq:', error);
        return `Error de conexión: ${error instanceof Error ? error.message : 'Desconocido'}`;
    }
}
