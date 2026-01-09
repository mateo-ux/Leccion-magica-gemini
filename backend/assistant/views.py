from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import os
from groq import Groq
from .web_search import (
    search_and_prepare_context,
    build_system_prompt_with_sources
)
from .models import ChatHistory


class ChatView(APIView):
    """
    Vista principal del chat pedagógico con búsqueda web y citas inline.
    """
    permission_classes = [IsAuthenticated]
    
    # Respuestas predeterminadas para mensajes simples (instantáneas)
    GREETINGS = ['hola', 'hello', 'hi', 'buenos días', 'buenas tardes', 'buenas noches', 'hey', 'saludos', 'qué tal', 'como estas', 'cómo estás']
    FAREWELLS = ['adiós', 'adios', 'chao', 'bye', 'hasta luego', 'nos vemos', 'gracias', 'muchas gracias', 'thanks']
    
    GREETING_RESPONSES = [
        "¡Hola! 👋 Soy **Lección Mágica**, tu asistente pedagógico. ¿En qué puedo ayudarte hoy con tu labor docente?",
        "¡Buen día! ✨ Estoy aquí para apoyarte con estrategias pedagógicas, planificación de clases y más. ¿Qué necesitas?",
        "¡Hola, profe! 📚 ¿Cómo puedo asistirte hoy en tu práctica educativa?",
    ]
    
    FAREWELL_RESPONSES = [
        "¡Hasta pronto! 👋 Fue un gusto ayudarte. ¡Éxitos en tu labor docente!",
        "¡Nos vemos! ✨ Recuerda que estoy aquí cuando me necesites. ¡Mucho éxito!",
        "¡Gracias a ti por usar Lección Mágica! 📚 ¡Que tengas un excelente día!",
    ]

    def _is_simple_message(self, message: str) -> tuple:
        """Detecta si es un saludo o despedida simple."""
        import random
        msg_lower = message.lower().strip()
        
        for greeting in self.GREETINGS:
            if greeting in msg_lower and len(msg_lower) < 30:
                return 'greeting', random.choice(self.GREETING_RESPONSES)
        
        for farewell in self.FAREWELLS:
            if farewell in msg_lower and len(msg_lower) < 40:
                return 'farewell', random.choice(self.FAREWELL_RESPONSES)
        
        return None, None

    def post(self, request):
        user_message = request.data.get('message')
        if not user_message:
            return Response(
                {'error': 'El mensaje es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Respuesta instantánea para saludos y despedidas
        msg_type, instant_response = self._is_simple_message(user_message)
        if instant_response:
            return Response({
                'response': instant_response,
                'sources_count': 0,
                'sources': []
            }, status=status.HTTP_200_OK)

        api_key = os.environ.get('GROQ_API_KEY')
        if not api_key:
            print("Error: GROQ_API_KEY no encontrada")
            return Response(
                {'error': 'GROQ_API_KEY no configurada'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        try:
            client = Groq(api_key=api_key, timeout=20.0)  # Timeout de 20 segundos
            
            # --- FILTRO DE TEMA ---
            # Verificación rápida: ¿Es tema educativo?
            # Si no lo es, rechazamos antes de gastar tiempo en búsqueda.
            validation_prompt = f"""Responde solo SI o NO.
¿La siguiente consulta está relacionada con: educación, pedagogía, colegios, estudiantes, planificación de clases, docencia, cultura general académica o sistema educativo de Colombia?

Consulta: "{user_message}"

Responde solo SI o NO."""

            validation = client.chat.completions.create(
                messages=[{"role": "user", "content": validation_prompt}],
                model="llama-3.1-8b-instant",
                temperature=0,
                max_tokens=5,
            )
            is_valid_topic = "SI" in validation.choices[0].message.content.upper()

            if not is_valid_topic:
                return Response({
                    'response': "Lo siento, como asistente pedagógico **Lección Mágica**, solo puedo responder preguntas relacionadas con educación, pedagogía y docencia en Colombia. 🍎📘\n\n¿Tienes alguna duda sobre tu clase o estudiantes?",
                    'sources_count': 0,
                    'sources': []
                }, status=status.HTTP_200_OK)
            
            # --- SI ES EDUCATIVO, CONTINUAMOS ---

            # Búsqueda web (opcional, si falla continúa sin fuentes)
            print(f"🔍 Buscando: {user_message}")
            try:
                source_context, sources, search_query = search_and_prepare_context(
                    query=user_message,
                    user=request.user,
                    max_sources=2  # Reducido para mayor velocidad
                )
                print(f"📚 Fuentes: {len(sources)}")
            except Exception as search_error:
                print(f"⚠️ Búsqueda falló, continuando sin fuentes: {search_error}")
                source_context, sources, search_query = "", [], None
            
            # Construir prompt (funciona con o sin fuentes)
            system_prompt = build_system_prompt_with_sources(
                sources=sources,
                source_context=source_context
            )

            # Llamada a Groq con timeout
            print("🤖 Generando respuesta...")
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                model="llama-3.1-8b-instant",
                temperature=0.5,
                max_tokens=600,
            )

            bot_response = chat_completion.choices[0].message.content
            print("✅ Respuesta generada")
            
            # Guardar en historial (no crítico)
            try:
                if search_query:
                    ChatHistory.objects.create(
                        user=request.user,
                        user_message=user_message,
                        assistant_response=bot_response,
                        search_query=search_query
                    )
            except:
                pass
            
            return Response({
                'response': bot_response,
                'sources_count': len(sources),
                'sources': [
                    {
                        'position': s['position'],
                        'title': s['title'],
                        'url': s['url']
                    } for s in sources
                ]
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"❌ Error en ChatView: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': 'Hubo un problema procesando tu solicitud. Por favor intenta de nuevo.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SearchHistoryView(APIView):
    """
    Endpoint para ver el historial de búsquedas del usuario.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        from .models import SearchQuery
        
        queries = SearchQuery.objects.filter(
            user=request.user
        ).prefetch_related('results')[:20]
        
        history = []
        for query in queries:
            history.append({
                'id': query.id,
                'query': query.query,
                'created_at': query.created_at.isoformat(),
                'results': [
                    {
                        'position': r.position,
                        'title': r.title,
                        'url': r.url
                    } for r in query.results.all()
                ]
            })
        
        return Response({'history': history}, status=status.HTTP_200_OK)


class ChatHistoryView(APIView):
    """
    Endpoint para ver el historial de conversaciones.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        chats = ChatHistory.objects.filter(
            user=request.user
        ).select_related('search_query')[:50]
        
        history = []
        for chat in chats:
            history.append({
                'id': chat.id,
                'user_message': chat.user_message,
                'assistant_response': chat.assistant_response,
                'created_at': chat.created_at.isoformat(),
                'has_sources': chat.search_query is not None
            })
        
        return Response({'history': history}, status=status.HTTP_200_OK)


class StudentChatView(APIView):
    """
    Vista del chat para estudiantes ("Tutor Mágico").
    Reglas estrictas:
    1. Solo temas educativos.
    2. Método Socrático: Guía, no resuelve ejercicios completos.
    """
    permission_classes = [IsAuthenticated]

    GREETINGS = ['hola', 'hello', 'hi', 'buenos días', 'buenas tardes', 'buenas noches', 'hey', 'saludos']
    
    def post(self, request):
        user_message = request.data.get('message')
        if not user_message:
            return Response({'error': 'El mensaje es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Respuesta rápida a saludos
        msg_lower = user_message.lower().strip()
        if any(g in msg_lower for g in self.GREETINGS) and len(msg_lower) < 20:
            return Response({
                'response': "¡Hola! 👋 Soy tu **Tutor Mágico**. Estoy aquí para ayudarte a entender tus materias y guiarte en tus tareas. ¿Qué quieres aprender hoy?",
                'sources': []
            }, status=status.HTTP_200_OK)

        api_key = os.environ.get('GROQ_API_KEY')
        if not api_key:
            return Response({'error': 'Configuración incompleta'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            client = Groq(api_key=api_key, timeout=20.0)

            # 2. Validación de Tema (Estricta)
            validation_prompt = f"""Responde solo SI o NO.
¿La siguiente consulta es sobre educación, tareas escolares, ciencia, historia, matemáticas, lenguaje, cultura general o aprendizaje?
Consulta: "{user_message}"
Responde solo SI o NO."""

            validation = client.chat.completions.create(
                messages=[{"role": "user", "content": validation_prompt}],
                model="llama-3.1-8b-instant",
                temperature=0,
                max_tokens=5,
            )
            
            if "SI" not in validation.choices[0].message.content.upper():
                return Response({
                    'response': "Lo siento, como tu **Tutor Mágico**, solo puedo hablar de temas escolares y educativos. 📚\n\n¿Por qué no me preguntas sobre tu tarea de hoy?",
                    'sources': []
                }, status=status.HTTP_200_OK)

            # 3. Búsqueda Web (Simplificada para estudiantes)
            try:
                print(f"🔍 Buscando para estudiante: {user_message}")
                source_context, sources, _ = search_and_prepare_context(
                    query=user_message,
                    user=request.user,
                    max_sources=2
                )
                print(f"📚 Fuentes encontradas: {len(sources)}")
            except Exception as search_err:
                print(f"⚠️ Error búsqueda estudiante: {search_err}")
                source_context = ""
                sources = []

            # 4. Construcción del Prompt "Tutor Socrático" con Citas
            source_list_text = "\n".join([f"- {s['url']}" for s in sources]) if sources else "No hay fuentes externas."

            citation_instruction = ""
            if sources:
                citation_instruction = """
## CÓMO CITAR (IMPORTANTE):
Si usas la información de las fuentes de abajo, al final de la frase pon el nombre del sitio en un enlace.
Ejemplo: "La fotosíntesis es... [Wikipedia](URL)"
"""

            system_prompt = f"""Eres el "Tutor Mágico", un asistente virtual amigable y paciente para estudiantes colombianos.

TUS REGLAS DE ORO (A CUMPLIR OBLIGATORIAMENTE):
1. **NUNCA resuelvas la tarea completa del estudiante.**
2. Si te piden resolver un ejercicio (ej: "2x+4=10"), **NO des el resultado final**. En su lugar, explica el PRIMER PASO para resolverlo y pregunta al estudiante si entiende.
3. Usa la mayéutica/método socrático: haz preguntas guía para que el estudiante piense.
4. Explica con analogías sencillas y divertidas.
5. Sé alentador y positivo. Usa emojis.
6. Si la pregunta es teórica (ej: "¿Qué es la fotosíntesis?"), dales una explicación clara y resumida, adaptada a su nivel.

{citation_instruction}

## URLs disponibles:
{source_list_text}

INFORMACIÓN DE CONTEXTO (Puede ser útil, úsala si aplica):
{source_context}

Estás hablando con un estudiante. Responde en Español de Colombia, amigable y respetuoso.
"""

            # 5. Generar Respuesta
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                model="llama-3.1-8b-instant",
                temperature=0.6,
                max_tokens=500,
            )

            bot_response = chat_completion.choices[0].message.content

            return Response({
                'response': bot_response,
                'sources': [{'title': s['title'], 'url': s['url']} for s in sources]
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error Student Chat: {e}")
            return Response({'error': 'Tuve un pequeño mareo mágico. Intenta de nuevo.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
