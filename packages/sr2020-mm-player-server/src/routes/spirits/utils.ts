import { ErrorResponse } from "sr2020-mm-event-engine";

export const qrIdIsNanError = (payload: string): ErrorResponse => ({
  errorTitle: 'Получен некорректный ответ от менеджера моделей',
  errorSubtitle: `QR id не число: ${payload}` 
});