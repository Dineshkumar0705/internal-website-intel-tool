import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

def fetch_html(url: str) -> str:
    response = requests.get(
        url,
        headers=HEADERS,
        timeout=15,
        allow_redirects=True,
    )
    response.raise_for_status()
    return response.text

def extract_visible_text(html: str) -> str:
    soup = BeautifulSoup(html, "lxml")

    # Remove scripts, styles, noscript
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()

    text = soup.get_text(separator=" ")
    clean_text = " ".join(text.split())
    return clean_text


def find_relevant_links(base_url: str, html: str) -> list[str]:
    soup = BeautifulSoup(html, "lxml")
    links = set()

    keywords = ["about", "contact", "career", "jobs", "team"]

    base_domain = urlparse(base_url).netloc

    for a in soup.find_all("a", href=True):
        href = a["href"].lower()

        if any(keyword in href for keyword in keywords):
            full_url = urljoin(base_url, href)
            if urlparse(full_url).netloc == base_domain:
                links.add(full_url)

    return list(links)