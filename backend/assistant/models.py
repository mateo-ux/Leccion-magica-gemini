from django.db import models
from django.conf import settings


class SearchQuery(models.Model):
    """
    Almacena las consultas de búsqueda realizadas por los usuarios.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='search_queries'
    )
    query = models.TextField(help_text="Consulta original del usuario")
    processed_query = models.TextField(
        blank=True,
        help_text="Consulta procesada/optimizada para búsqueda"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Consulta de búsqueda"
        verbose_name_plural = "Consultas de búsqueda"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email}: {self.query[:50]}..."


class SearchResult(models.Model):
    """
    Almacena los resultados de búsqueda encontrados.
    """
    search_query = models.ForeignKey(
        SearchQuery,
        on_delete=models.CASCADE,
        related_name='results'
    )
    title = models.CharField(max_length=500, help_text="Título del resultado")
    url = models.URLField(max_length=2000, help_text="URL de la fuente")
    snippet = models.TextField(help_text="Fragmento/resumen del contenido")
    content = models.TextField(
        blank=True,
        help_text="Contenido extraído de la página"
    )
    position = models.PositiveIntegerField(
        help_text="Posición en los resultados (1, 2, 3...)"
    )
    relevance_score = models.FloatField(
        default=0.0,
        help_text="Puntuación de relevancia"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Resultado de búsqueda"
        verbose_name_plural = "Resultados de búsqueda"
        ordering = ['position']
        unique_together = ['search_query', 'url']
    
    def __str__(self):
        return f"[{self.position}] {self.title[:50]}"
    
    def get_citation_markdown(self):
        """
        Retorna la cita en formato Markdown para insertar inline.
        """
        return f"[[{self.position}]]({self.url})"
    
    def get_full_citation(self):
        """
        Retorna la cita completa con título y URL.
        """
        return f"**[{self.position}]** [{self.title}]({self.url})"


class ChatHistory(models.Model):
    """
    Almacena el historial de conversaciones del chat.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chat_history'
    )
    user_message = models.TextField(help_text="Mensaje del usuario")
    assistant_response = models.TextField(help_text="Respuesta del asistente")
    search_query = models.ForeignKey(
        SearchQuery,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='chat_messages'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Historial de chat"
        verbose_name_plural = "Historial de chats"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email}: {self.user_message[:30]}..."
