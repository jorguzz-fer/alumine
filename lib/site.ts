// Configuração central da LP do Método MEDIC

const WHATSAPP_NUMBER = "5511930001873";
const WHATSAPP_MESSAGE =
  "Olá, quero solicitar uma Reunião Estratégica do Método MEDIC.";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

export const CTA_LABEL = "Solicitar uma Reunião Estratégica";
