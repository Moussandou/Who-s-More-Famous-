import { Anime } from '../components/AnimeCard';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let animePool: Anime[] = []; // Cache local des animés populaires

/**
 * Initialise le pool avec les ~200 animés les plus populaires de MyAnimeList.
 * On utilise la pagination pour récupérer plusieurs pages de 25.
 */
export async function initializePool(): Promise<void> {
    if (animePool.length > 0) return; // Déjà chargé

    const newPool: Anime[] = [];
    const pagesToFetch = 8; // 8 * 25 = 200 animés célèbres

    try {
        for (let page = 1; page <= pagesToFetch; page++) {
            // Jikan /v4/top/anime?filter=bypopularity récupère les plus "membres"
            const response = await fetch(`https://api.jikan.moe/v4/top/anime?filter=bypopularity&page=${page}`);

            if (!response.ok) {
                if (response.status === 429) {
                    await sleep(1000); // Trop de requêtes : on attend plus
                    page--; // On retente la même page
                    continue;
                }
                throw new Error(`Erreur API Jikan: ${response.status}`);
            }

            const json = await response.json();
            const data = json.data;

            data.forEach((anime: any) => {
                newPool.push({
                    id: anime.mal_id,
                    title: anime.title,
                    image: anime.images?.jpg?.large_image_url,
                    members: anime.members,
                    score: anime.score,
                    year: anime.year,
                });
            });

            // On attend 500ms entre chaque page pour ne pas brusquer l'API (limite 3/sec)
            await sleep(500);
        }

        animePool = newPool;
        console.log(`Pool initialisé avec ${animePool.length} animés populaires.`);
    } catch (error) {
        console.error("Erreur d'initialisation du pool :", error);
        throw error;
    }
}

/**
 * Pioche un duel aléatoirement dans le pool local.
 */
export async function fetchDuel(): Promise<{ anime1: Anime, anime2: Anime }> {
    // Si le pool est vide, on l'initialise d'abord (fallback)
    if (animePool.length === 0) {
        await initializePool();
    }

    // On pioche 2 indices différents
    let idx1 = Math.floor(Math.random() * animePool.length);
    let idx2 = Math.floor(Math.random() * animePool.length);

    // Éviter d'avoir le même animé 2 fois
    while (idx1 === idx2) {
        idx2 = Math.floor(Math.random() * animePool.length);
    }

    return {
        anime1: animePool[idx1],
        anime2: animePool[idx2]
    };
}
