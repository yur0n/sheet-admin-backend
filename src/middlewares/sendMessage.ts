import e, { Request, Response } from 'express';
import messageModel from '../models/message.model';
import { Telegram } from '../interfaces/telegram.interface';
const BOT = process.env.BOT_TOKEN;

export async function sendMessage (req: Request, res: Response) {
  const { data, message }: Telegram = req.body;
  if (!data || !message) {
    return res.send({ ok: false, status: 'Data and message are required' });
  }
  const result: { delivered: boolean, id: string }[] = []
  for (const user of data) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT}/sendMessage?chat_id=${user.chatId}&text=${message}`);
      const responseData = await response.json();
      if (responseData.ok) {
        result.push({ delivered: true, id: user.userId });
        await messageModel.create({ userId: user.userId, telegram: user.chatId, message, user: false });
      } else {
				result.push({ delivered: false, id: user.userId });
			}
    } catch (e) {
      console.error(e);
      result.push({ delivered: false, id: user.userId });
    }
  }

  if (result.some(item => item.delivered === false)) {
    return res.send({ ok: false, status: 'Error sending message to some users', result });
  } else {
    return res.send({ ok: true, status: 'Message sent', result });
  }
}