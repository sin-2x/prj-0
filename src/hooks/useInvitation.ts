import { useMemo } from 'react';
import { foods } from '../data/foods';
import { restaurants } from '../data/restaurants';
import type { InvitationState, InvitationSubmission, Step } from '../types/invitation';
import { useLocalStorage } from './useLocalStorage';

const initialState: InvitationState = {
  step: 'intro',
  date: '',
  time: '',
  foodIds: [],
  restaurantId: '',
  customRestaurantName: '',
  sent: false,
};

export function useInvitation() {
  const [storedState, setState] = useLocalStorage<InvitationState>('date-invitation-state', initialState);
  const state: InvitationState = {
    ...initialState,
    ...storedState,
    foodIds: Array.isArray(storedState.foodIds) ? storedState.foodIds : [],
    customRestaurantName: storedState.customRestaurantName ?? '',
  };
  const customRestaurantName = state.customRestaurantName.trim();

  const selectedFoods = useMemo(
    () => foods.filter((food) => state.foodIds.includes(food.id)),
    [state.foodIds],
  );

  const selectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => restaurant.id === state.restaurantId),
    [state.restaurantId],
  );

  const setStep = (step: Step) => setState((current) => ({ ...current, step }));
  const patch = (partial: Partial<InvitationState>) => setState((current) => ({ ...current, ...partial }));
  const toggleFood = (id: string) =>
    setState((current) => ({
      ...current,
      foodIds: current.foodIds.includes(id)
        ? current.foodIds.filter((foodId) => foodId !== id)
        : [...current.foodIds, id],
    }));

  const reset = () => setState(initialState);

  const hasRestaurantChoice =
    selectedRestaurant && (selectedRestaurant.id !== 'her-choice' || customRestaurantName.length > 0);

  const submission: InvitationSubmission | null =
    state.date && state.time && selectedFoods.length > 0 && selectedRestaurant && hasRestaurantChoice
      ? {
          date: state.date,
          time: state.time,
          foods: selectedFoods,
          restaurant: selectedRestaurant,
          customRestaurantName: customRestaurantName || undefined,
        }
      : null;

  return {
    state,
    selectedFoods,
    selectedRestaurant,
    submission,
    setStep,
    patch,
    toggleFood,
    reset,
  };
}
