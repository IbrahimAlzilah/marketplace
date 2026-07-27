export type NotificationItem = {
  id: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  date: string;
  read: boolean;
  type?: "order" | "promo" | "system";
};
