"""
Módulo de búsqueda web optimizado con Google Custom Search Engine.
Búsquedas rápidas con citas inline mostrando URL.
"""

import os
import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Optional, Tuple
from concurrent.futures import ThreadPoolExecutor, as_completed, wait, ALL_COMPLETED
import re


class GoogleCSESearch:
    """
    Cliente optimizado para Google Custom Search Engine API.
    """
    
    BASE_URL = "https://www.googleapis.com/customsearch/v1"
    
    def __init__(self):
        self.api_key = os.environ.get('GOOGLE_CSE_API_KEY')
        self.cx = os.environ.get('GOOGLE_CSE_CX')
        
        if not self.api_key or not self.cx:
            raise ValueError(
                "GOOGLE_CSE_API_KEY y GOOGLE_CSE_CX deben estar configurados"
            )
    
    def search(self, query: str, num_results: int = 3) -> List[Dict]:
        """
        Realiza búsqueda rápida en Google CSE.
        """
        params = {
            'key': self.api_key,
            'cx': self.cx,
            'q': query,
            'num': min(num_results, 5),
            'lr': 'lang_es',
            'gl': 'co',
        }
        
        try:
            response = requests.get(self.BASE_URL, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()
            
            results = []
            for idx, item in enumerate(data.get('items', []), 1):
                results.append({
                    'position': idx,
                    'title': item.get('title', ''),
                    'url': item.get('link', ''),
                    'snippet': item.get('snippet', ''),
                    'display_link': item.get('displayLink', ''),
                })
            
            return results
            
        except Exception as e:
            print(f"Error búsqueda: {e}")
            return []


def scrape_page_fast(url: str, max_chars: int = 1000) -> str:
    """
    Extracción rápida de contenido (timeout corto).
    """
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
        }
        response = requests.get(url, headers=headers, timeout=3)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'lxml')
        
        for tag in soup(['script', 'style', 'nav', 'header', 'footer', 'aside']):
            tag.decompose()
        
        main = soup.find('main') or soup.find('article') or soup.find('body')
        text = main.get_text(separator=' ', strip=True) if main else ""
        text = re.sub(r'\s+', ' ', text)
        
        return text[:max_chars]
        
    except:
        return ""


def scrape_pages_parallel(urls: List[str], max_chars: int = 600) -> Dict[str, str]:
    """
    Scraping en paralelo con timeout estricto y NO bloqueante.
    """
    results = {url: "" for url in urls}
    
    if not urls:
        return results

    executor = ThreadPoolExecutor(max_workers=min(3, len(urls)))
    try:
        future_to_url = {}
        for url in urls:
            try:
                future = executor.submit(scrape_page_fast, url, max_chars)
                future_to_url[future] = url
            except RuntimeError:
                return results

        # Timeout global de 25 segundos para ESPERAR resultados
        done, not_done = wait(
            future_to_url.keys(), 
            timeout=25, 
            return_when=ALL_COMPLETED
        )
        
        # Recoger resultados completados
        for future in done:
            url = future_to_url[future]
            try:
                results[url] = future.result()
            except Exception:
                pass
        
        # Si hay pendientes, imprimimos warning
        if not_done:
            print(f"⚠️ {len(not_done)} scrapings no terminaron a tiempo.")

    except Exception as e:
        print(f"⚠️ Error en scraping paralelo: {e}")
    finally:
        # shutdown(wait=False) es CLAVE para no bloquear el hilo principal
        # cancel_futures=True intenta cancelar los pendientes (Python 3.9+)
        try:
            executor.shutdown(wait=False, cancel_futures=True)
        except TypeError:
            # Fallback para Python < 3.9
            executor.shutdown(wait=False)
    
    return results


def search_and_prepare_context(
    query: str,
    user=None,
    max_sources: int = 3
) -> Tuple[str, List[Dict], Optional['SearchQuery']]:
    """
    Búsqueda optimizada con menos fuentes y scraping paralelo.
    """
    from .models import SearchQuery, SearchResult
    
    search_query_obj = None
    educational_query = f"{query} educación Colombia"
    
    try:
        if user and user.is_authenticated:
            search_query_obj = SearchQuery.objects.create(
                user=user,
                query=query,
                processed_query=educational_query
            )
        
        cse = GoogleCSESearch()
        results = cse.search(educational_query, num_results=max_sources)
        
        if not results:
            return "", [], search_query_obj
        
        # Scraping paralelo para velocidad
        urls = [r['url'] for r in results]
        scraped = scrape_pages_parallel(urls, max_chars=800)
        
        sources = []
        context_parts = []
        
        for result in results:
            url = result['url']
            title = result['title']
            snippet = result['snippet']
            content = scraped.get(url, '') or snippet
            
            if search_query_obj:
                SearchResult.objects.create(
                    search_query=search_query_obj,
                    title=title,
                    url=url,
                    snippet=snippet,
                    content=content[:2000],
                    position=result['position']
                )
            
            sources.append({
                'position': result['position'],
                'title': title,
                'url': url,
                'snippet': snippet
            })
            
            context_parts.append(
                f"[{url}]\n*{title}*\n{content[:600]}"
            )
        
        formatted_context = "\n\n---\n\n".join(context_parts)
        
        return formatted_context, sources, search_query_obj
        
    except Exception as e:
        print(f"Error: {e}")
        return "", [], search_query_obj


def format_sources_reference(sources: List[Dict]) -> str:
    """Referencias al final (solo si no hay citas inline)."""
    if not sources:
        return ""
    
    lines = ["\n\n---\n### 📚 Referencias"]
    for s in sources:
        lines.append(f"- [{s['title']}]({s['url']})")
    
    return "\n".join(lines)


def build_system_prompt_with_sources(sources: List[Dict], source_context: str) -> str:
    """
    Prompt optimizado para citas inline con URL directa.
    """
    # Si no hay fuentes, prompt sin citas
    if not sources:
        return """Eres **Lección Mágica**, asistente pedagógico para docentes colombianos.

Responde de forma BREVE y PRÁCTICA. Máximo 3-4 párrafos cortos.
Enfócate en dar consejos útiles y aplicables en el aula.
Usa emojis ocasionalmente para hacer el texto más amigable."""

    source_list = "\n".join([
        f"- {s['url']}"
        for s in sources
    ])
    
    prompt = f"""Eres **Lección Mágica**, asistente pedagógico para docentes colombianos.

## CÓMO CITAR (MUY IMPORTANTE)

Al final de cada párrafo donde uses información de una fuente, usa un enlace markdown así:

✅ CORRECTO: "Info del párrafo. [Mineducación](https://mineducacion.gov.co)"
✅ CORRECTO: "Info del párrafo. [Colombia Aprende](https://colombiaaprende.edu.co)"
❌ INCORRECTO: "Fuente: [https://...](...)" (NO pongas la URL en el texto del link)

**Reglas:**
1. Usa formato Markdown: `[Texto Corto](URL)`
2. El texto del enlace debe ser **SOLO EL NOMBRE DEL SITIO** (ej: "Mineducación", "Wikipedia", "El Tiempo").
3. MÁXIMO 2 PALABRAS para el texto del enlace.
4. Pon la cita al FINAL del párrafo.

## URLs disponibles:
{source_list}

## Info de las fuentes:
{source_context}

## Estilo
- Respuestas BREVES (máximo 5-6 párrafos)
- Práctico y aplicable
- Usa emojis ocasionalmente 📚✨"""
    
    return prompt
