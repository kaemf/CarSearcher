import { Message } from "../../base/types";
import { CheckException } from "../../base/check";
import { askChatGPT } from "../../base/gpt";

export default async function BeginHandler(onTextMessage: Message, redis: any) {
    onTextMessage('BeginDataHandler', async (ctx, user, set, data) => {
        if (CheckException.TextException(data)) {
            const pre_mes = await ctx.reply("Идёт обработка запроса...");
            const gptAnswer = await askChatGPT(data.text);

            await ctx.reply(gptAnswer ?? "Извините, но ChatGPT не смог ответить на ваш вопрос, попробуйте ещё раз");
            await ctx.deleteMessage(pre_mes.message_id);
        }
        else ctx.reply("Извините, но такой тип сообщения я не понимаю, загрузите аудио/текст либо сразу фотографии продаваемого автомобиля");
    })
}