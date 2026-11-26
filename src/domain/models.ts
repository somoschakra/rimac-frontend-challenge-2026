export interface User {
  name: string
  lastName: string
  birthDay: string
}

export interface InsurancePlan {
  name: string
  price: number
  description: string[]
  age: number
}

export interface QuotedPlan extends InsurancePlan {
  quotedPrice: number
}
