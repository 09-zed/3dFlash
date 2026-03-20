import type { VehicleMake, VehicleModel } from '../types'

export const makes: VehicleMake[] = [
  { id: 'renault', name: 'Renault' },
  { id: 'peugeot', name: 'Peugeot' },
  { id: 'citroen', name: 'Citroën' },
  { id: 'volkswagen', name: 'Volkswagen' },
  { id: 'toyota', name: 'Toyota' },
  { id: 'bmw', name: 'BMW' },
  { id: 'mercedes', name: 'Mercedes-Benz' },
  { id: 'ford', name: 'Ford' },
  { id: 'opel', name: 'Opel' },
  { id: 'audi', name: 'Audi' },
  { id: 'fiat', name: 'Fiat' },
  { id: 'seat', name: 'SEAT' },
]

export const models: VehicleModel[] = [
  // Renault
  { id: 'clio4', makeId: 'renault', name: 'Clio IV' },
  { id: 'clio5', makeId: 'renault', name: 'Clio V' },
  { id: 'megane3', makeId: 'renault', name: 'Mégane III' },
  { id: 'megane4', makeId: 'renault', name: 'Mégane IV' },
  { id: 'scenic3', makeId: 'renault', name: 'Scénic III' },
  { id: 'captur', makeId: 'renault', name: 'Captur' },
  { id: 'kadjar', makeId: 'renault', name: 'Kadjar' },
  { id: 'duster', makeId: 'renault', name: 'Duster' },
  // Peugeot
  { id: '208-1', makeId: 'peugeot', name: '208 (2012-2019)' },
  { id: '208-2', makeId: 'peugeot', name: '208 (2019+)' },
  { id: '308-1', makeId: 'peugeot', name: '308 (2013-2021)' },
  { id: '308-2', makeId: 'peugeot', name: '308 (2021+)' },
  { id: '3008', makeId: 'peugeot', name: '3008' },
  { id: '5008', makeId: 'peugeot', name: '5008' },
  { id: '2008', makeId: 'peugeot', name: '2008' },
  // Citroën
  { id: 'c3-3', makeId: 'citroen', name: 'C3 III' },
  { id: 'c4-2', makeId: 'citroen', name: 'C4 II' },
  { id: 'c5air', makeId: 'citroen', name: 'C5 Aircross' },
  { id: 'berlingo', makeId: 'citroen', name: 'Berlingo' },
  // Volkswagen
  { id: 'golf7', makeId: 'volkswagen', name: 'Golf VII' },
  { id: 'golf8', makeId: 'volkswagen', name: 'Golf VIII' },
  { id: 'polo6', makeId: 'volkswagen', name: 'Polo VI' },
  { id: 'passat', makeId: 'volkswagen', name: 'Passat B8' },
  { id: 'tiguan', makeId: 'volkswagen', name: 'Tiguan' },
  { id: 'touareg', makeId: 'volkswagen', name: 'Touareg' },
  // Toyota
  { id: 'yaris3', makeId: 'toyota', name: 'Yaris III' },
  { id: 'yaris4', makeId: 'toyota', name: 'Yaris IV' },
  { id: 'corolla', makeId: 'toyota', name: 'Corolla (2019+)' },
  { id: 'rav4', makeId: 'toyota', name: 'RAV4 V' },
  // BMW
  { id: 'serie1f40', makeId: 'bmw', name: 'Série 1 (F40)' },
  { id: 'serie3g20', makeId: 'bmw', name: 'Série 3 (G20)' },
  { id: 'serie5g30', makeId: 'bmw', name: 'Série 5 (G30)' },
  { id: 'x1f48', makeId: 'bmw', name: 'X1 (F48)' },
  // Mercedes
  { id: 'classa177', makeId: 'mercedes', name: 'Classe A (W177)' },
  { id: 'classc205', makeId: 'mercedes', name: 'Classe C (W205)' },
  { id: 'classe206', makeId: 'mercedes', name: 'Classe E (W213)' },
  // Ford
  { id: 'fiesta7', makeId: 'ford', name: 'Fiesta VII' },
  { id: 'focus4', makeId: 'ford', name: 'Focus IV' },
  { id: 'kuga3', makeId: 'ford', name: 'Kuga III' },
  // Opel
  { id: 'corsa5', makeId: 'opel', name: 'Corsa F' },
  { id: 'astra6', makeId: 'opel', name: 'Astra L' },
  { id: 'mokka2', makeId: 'opel', name: 'Mokka B' },
  // Audi
  { id: 'a3-8y', makeId: 'audi', name: 'A3 (8Y)' },
  { id: 'a4-b9', makeId: 'audi', name: 'A4 (B9)' },
  { id: 'q3-f3', makeId: 'audi', name: 'Q3 (F3)' },
  // Fiat
  { id: 'panda4', makeId: 'fiat', name: 'Panda IV' },
  { id: '500-3', makeId: 'fiat', name: '500 III' },
  // SEAT
  { id: 'ibiza5', makeId: 'seat', name: 'Ibiza V' },
  { id: 'leon4', makeId: 'seat', name: 'León IV' },
]

export const years = Array.from({ length: 20 }, (_, i) => 2024 - i)
