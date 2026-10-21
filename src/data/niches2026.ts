// src/data/niches2026.ts
export type ChannelKey = 'direct' | 'vk' | 'telegram' | 'max'

export const CHANNEL_LABELS: Record<ChannelKey, string> = {
  direct: 'Яндекс Директ',
  vk: 'Таргет ВК',
  telegram: 'Telegram',
  max: 'Мессенджер Max',
}

export interface Niche2026 {
  id: string
  name: string
  category: string
  avgCheck: number
  margin: number
  conversion: number
  salesCycle: number
  cpl: Record<ChannelKey, number>
  demandTrend: number
  competition: 'low' | 'medium' | 'high'
}

/* Реалистичные бенчмарки рынка РФ, 2026 год */
export const NICHES_2026: Niche2026[] = [
  { id: 'remont-kvartir', name: 'Ремонт квартир под ключ', category: 'Недвижимость и ремонт', avgCheck: 450000, margin: 30, conversion: 12, salesCycle: 30, cpl: { direct: 1200, vk: 700, telegram: 800, max: 600 }, demandTrend: 8, competition: 'high' },
  { id: 'stroyka-domov', name: 'Строительство домов', category: 'Недвижимость и ремонт', avgCheck: 5200000, margin: 25, conversion: 6, salesCycle: 60, cpl: { direct: 2200, vk: 1300, telegram: 1500, max: 1100 }, demandTrend: 12, competition: 'high' },
  { id: 'okna-pvh', name: 'Окна ПВХ', category: 'Недвижимость и ремонт', avgCheck: 85000, margin: 35, conversion: 18, salesCycle: 14, cpl: { direct: 900, vk: 550, telegram: 650, max: 500 }, demandTrend: 3, competition: 'high' },
  { id: 'mebel', name: 'Мебель на заказ', category: 'Недвижимость и ремонт', avgCheck: 180000, margin: 35, conversion: 14, salesCycle: 21, cpl: { direct: 950, vk: 600, telegram: 700, max: 520 }, demandTrend: 6, competition: 'medium' },
  { id: 'uchastki', name: 'Продажа земельных участков', category: 'Недвижимость и ремонт', avgCheck: 1800000, margin: 20, conversion: 8, salesCycle: 45, cpl: { direct: 1000, vk: 650, telegram: 750, max: 550 }, demandTrend: 9, competition: 'medium' },
  { id: 'skupka', name: 'Скупка техники', category: 'Торговля', avgCheck: 25000, margin: 40, conversion: 45, salesCycle: 1, cpl: { direct: 450, vk: 350, telegram: 380, max: 300 }, demandTrend: 15, competition: 'medium' },
  { id: 'klining', name: 'Клининг', category: 'Услуги', avgCheck: 6000, margin: 45, conversion: 30, salesCycle: 2, cpl: { direct: 400, vk: 280, telegram: 320, max: 250 }, demandTrend: 10, competition: 'medium' },
  { id: 'video', name: 'Видеонаблюдение', category: 'Услуги', avgCheck: 95000, margin: 40, conversion: 20, salesCycle: 10, cpl: { direct: 700, vk: 450, telegram: 500, max: 400 }, demandTrend: 18, competition: 'medium' },
  { id: 'pc-repair', name: 'Ремонт ПК и ноутбуков', category: 'Услуги', avgCheck: 8000, margin: 55, conversion: 40, salesCycle: 1, cpl: { direct: 480, vk: 330, telegram: 370, max: 290 }, demandTrend: 3, competition: 'medium' },
  { id: 'avto', name: 'Автосервис', category: 'Авто', avgCheck: 12000, margin: 40, conversion: 35, salesCycle: 1, cpl: { direct: 550, vk: 380, telegram: 420, max: 330 }, demandTrend: 5, competition: 'high' },
  { id: 'stomatologiya', name: 'Стоматология', category: 'Здоровье', avgCheck: 45000, margin: 50, conversion: 25, salesCycle: 7, cpl: { direct: 1400, vk: 900, telegram: 1000, max: 800 }, demandTrend: 7, competition: 'high' },
  { id: 'yuristy', name: 'Юридические услуги', category: 'Услуги', avgCheck: 35000, margin: 70, conversion: 22, salesCycle: 5, cpl: { direct: 1100, vk: 700, telegram: 800, max: 650 }, demandTrend: 5, competition: 'high' },
  { id: 'buhgalteriya', name: 'Бухгалтерские услуги', category: 'Услуги', avgCheck: 15000, margin: 75, conversion: 20, salesCycle: 7, cpl: { direct: 800, vk: 500, telegram: 600, max: 450 }, demandTrend: 6, competition: 'medium' },
  { id: 'fitnes', name: 'Фитнес-студия', category: 'Услуги', avgCheck: 30000, margin: 40, conversion: 25, salesCycle: 3, cpl: { direct: 500, vk: 320, telegram: 380, max: 280 }, demandTrend: 4, competition: 'high' },
  { id: 'dostavka', name: 'Доставка еды', category: 'Торговля', avgCheck: 1500, margin: 25, conversion: 40, salesCycle: 1, cpl: { direct: 250, vk: 180, telegram: 200, max: 150 }, demandTrend: 14, competition: 'high' },
]