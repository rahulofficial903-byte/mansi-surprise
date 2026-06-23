export type Answer = {
  question: string
  answer: string
  category: 'Memory Quiz' | 'Rapid Fire' | 'Romantic' | 'Final'
  timestamp: string
}

export type DatePlan = {
  preference: 'Coffee' | 'Lunch'
  date: string
  time: string
}
