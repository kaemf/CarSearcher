import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({ apiKey: process.env.GPT });
function parseHtmlToText(html: string): string {
  let text = html;

  text = text.replace(/<\/?[^>]+(>|$)/g, "");
  text = text.replace(/<br\s*\/?>/g, "\n");
  text = text.replace(/<b>|<strong>/g, "**");
  text = text.replace(/<\/b>|<\/strong>/g, "**");
  text = text.replace(/<i>|<em>/g, "*");
  text = text.replace(/<\/i>|<\/em>/g, "*");
  text = text.replace(/<a\s+href="([^"]+)">([^<]+)<\/a>/g, "[$2]($1)");
  text = text.replace(/<ul>|<ol>/g, "");
  text = text.replace(/<\/ul>|<\/ol>/g, "");
  text = text.replace(/<li>/g, "- ");
  
  return text;
}

export async function askChatGPT(prompt: string): Promise<string | null> {
    try {
        const response = await client.responses.create({
            model: "gpt-4.1-mini",
            tools: [ { type: "web_search_preview" } ],
            instructions: `попробуй такой промт Ты выступаешь в роли персонального помощника автодиллера в Монтреале. Твоя основная задача — по запросу пользователя находить все возможные новые автомобили у официальных дилеров Канады, которые соответствуют указанным параметрам (марка, модель, год выпуска, ценовой диапазон, комплектация, цвет и другие характеристики). Для этого ты должен максимально широко искать на сайтах официальных дилеров, включая все релевантные страницы инвентаря, учитывая, что новые автомобили могут появляться с задержкой в индексируемых базах.

Для каждого найденного автомобиля предоставляй прямую ссылку на страницу с этим автомобилем в официальном инвентаре дилерского центра — пример ссылки:
https://www.vwgabrielstlaurent.com/new/inventory/2025-Volkswagen-Atlas-id12017948.html

Ни в коем случае не предоставляй ссылки на агрегаторы, классифайды, частные объявления или сторонние сайты. Только официальные дилеры и только страницы с конкретными автомобилями из инвентаря (inventory).

Каждый ответ должен содержать минимум пять релевантных ссылок, если автомобили с заданными характеристиками найдены. Если вариантов меньше пяти, укажи все доступные.

Если в указанном регионе (город, провинция) нет доступных автомобилей, предложи ближайшие регионы с наличием.

При поиске учитывай разные варианты написания и возможные конфигурации моделей для полного охвата.

В случае отсутствия результатов конкретной модели уточни у пользователя возможность расширить параметры поиска.`,
            input: prompt,
        });

        return parseHtmlToText(response.output_text) || "No response";
    } catch (error: any) {
      console.error("Ошибка при запросе к GPT:", error);
      return null;
    }
}

