const repositoryList = document.querySelector("#repository-list");
const statusMessage = document.querySelector("#status");

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium"
});

const numberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1
});

function createRepositoryCard(event) {
  const repository = document.createElement("article");
  repository.className = "repository";

  const content = document.createElement("div");
  const name = document.createElement("h2");
  const link = document.createElement("a");
  link.href = event.repo.url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = event.repo.name;
  name.append(link);

  const description = document.createElement("p");
  description.className = "description";
  description.textContent = event.repo.description;

  const metadata = document.createElement("p");
  metadata.className = "metadata";

  const language = document.createElement("span");
  language.textContent = event.repo.language || "Repository";

  const stars = document.createElement("span");
  stars.textContent = `${numberFormatter.format(event.repo.stargazers_count)} stars`;

  metadata.append(language, stars);
  content.append(name, description, metadata);

  const date = document.createElement("time");
  date.className = "date";
  date.dateTime = event.created_at;
  date.textContent = dateFormatter.format(new Date(event.created_at));

  repository.append(content, date);
  return repository;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const events = await response.json();
    repositoryList.replaceChildren(...events.map(createRepositoryCard));
    statusMessage.textContent = `${events.length} starred repositories`;
  } catch (error) {
    statusMessage.textContent = "The starred repositories could not be loaded.";
    repositoryList.replaceChildren();
    const message = document.createElement("p");
    message.className = "empty-state";
    message.textContent = "Try refreshing the page to load the repository log again.";
    repositoryList.append(message);
    console.error(error);
  }
}

loadRepositories();
