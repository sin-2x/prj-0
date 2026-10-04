export type Step =
  | 'intro'
  | 'message'
  | 'question'
  | 'date'
  | 'time'
  | 'food'
  | 'restaurant'
  | 'summary'
  | 'success';

export interface FoodCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  image?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  image: string;
}

export interface InvitationState {
  step: Step;
  date: string;
  time: string;
  foodIds: string[];
  restaurantId: string;
  customRestaurantName: string;
  sent: boolean;
}

export interface InvitationSubmission {
  date: string;
  time: string;
  foods: FoodCategory[];
  restaurant: Restaurant;
  customRestaurantName?: string;
}
