const apiKey = '97598e685db1472bad4e5679960d7826'
const main = document.querySelector('main')
const selector = document.querySelector('#sourceSelector')
const defaultSource = 'the-washington-post'

window.addEventListener('load', async e => {
  updateNews();
  await updateSources();
  selector.value = defaultSource

  selector.addEventListener('change', e => {
    updateNews(e.target.value)
  })

  if ('serviceWorker' in navigator) {
    try {
      navigator.serviceWorker.register('sw.js')
      console.log("service worker is registered");
    } catch (e) {
      console.log("SW is failed to registered", e);
    }
  }
})

async function updateSources() {
  const res = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`)
  const json = await res.json()

  selector.innerHTML = json.sources.map(src => `
    <option value=${src.id}>
      ${src.name}
    </option>`).join('\n')
}

async function updateNews (source = defaultSource) {
  const res = await fetch(`https://newsapi.org/v2/everything?sources=${source}&apiKey=${apiKey}`)
  const json = await res.json()

  main.innerHTML = json.articles.map(createArticle).join('\n\n')
}

function createArticle(article) {
  return `
    <div class="article">
      <a href=${article.url}>
        <h2>${article.title}</h2>
        <img src="${article.urlToImage}" />
        <p>${article.description}</p>
      </a>
    </div>
  `
}
