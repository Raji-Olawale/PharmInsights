import { HeartHandshake, PackageCheck, Truck } from 'lucide-react'

export const categories = {
  wholesaler: {
    name: 'Wholesaler',
    plural: 'Wholesalers',
    accent: 'blue',
    description: 'Pharmaceutical wholesale and distribution businesses.',
    icon: PackageCheck,
  },
  buyer: {
    name: 'Retailer / Buyer',
    plural: 'Retailers / Buyers',
    accent: 'green',
    description: 'Pharmacies, healthcare facilities and other product buyers.',
    icon: HeartHandshake,
  },
  logistics: {
    name: 'Logistics Business',
    plural: 'Logistics Businesses',
    accent: 'orange',
    description: 'Businesses providing pharmaceutical transportation and delivery.',
    icon: Truck,
  },
}

export const categoryPath = (category, step = 'information') =>
  `/questionnaire/${category}/${step}`
