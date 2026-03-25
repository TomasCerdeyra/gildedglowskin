export function buildWhatsAppLink(productName: string, price: number): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5493329516376";
  const text = `Hola! Me interesa el producto: ${productName} - $${price}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
