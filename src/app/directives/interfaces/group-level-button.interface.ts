export interface GroupLevelButton {
  field: string;
  level: number;
  state: 'expanded' | 'collapsed';
  expIndicators: number;
  collIndicators: number;
  totalIndicators: number;
}
