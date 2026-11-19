export interface Instrument {
  id: number;
  title: string;
  description?: string;
  type?: string;
  condition?: string;
  origin?: string;
  maker?: string;
  year?: number;
  formerOwner?: string;
  acquiredAt?: Date;
  photoUrl?: string;
}
