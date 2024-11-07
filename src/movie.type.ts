import React, { ReactNode } from 'react';

export interface DropdownProps {
  label: string;
  items: { label: string; link?: string; onClick?: () => void }[];
  isMobile?: boolean;
}

export interface LanguageSwitcherProps {
  isMobile?: boolean;
}

export interface Review {
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string;
    rating: number;
  };
  content: string;
  created_at: string;
  updated_at: string;
  id: string;
  url: string;
}

export interface Participants {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

export interface Movie {
  id: number;
  title?: string;
  poster_path: string;
  release_date?: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  overview: string;
  backdrop_path: string;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  origin_country?: string[];
  original_name?: string;
  first_air_date?: string;
  name?: string;
  keywords?: { id: number; name: string }[];
  reviews?: Review[];
  recommendations?: {
    id: number;
    title: string;
    original_title: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    media_type: string;
    adult: boolean;
    original_language: string;
    genre_ids: number[];
    popularity: number;
    release_date: string;
    vote_average: number;
    vote_count: number;
  }[];
  medialink?: { [key: string]: string };
  status?: string;
  budget?: number;
  revenue?: number;
  participants?: Participants[];
}

export interface HeroSliderProps {
  movies: Movie[];
}

export interface MovieCarouselProps {
  title: string;
  data: Movie[] | Movie['participants'];
  style?: "vertical" | "horizontal";
  type?: "movie" | "participant"
}

export interface LeaderboardProps {
  movies: Movie[];
  onSort: (field: "vote_average" | "vote_count") => void;
  sortField: "vote_average" | "vote_count";
  sortOrder: "asc" | "desc";
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxPagesToShow: number;
}

export interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export interface MovieCardProps {
  movie: Movie;
  style?: "vertical" | "horizontal";
  onMouseEnter?: (movie: Movie) => void;
}

export interface MovieMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
  position?: "right" | "left";
}

export interface UserInfo {
  username: string;
  email: string;
  id: string;
}

export interface FormField {
  name: string;
  type: string;
  placeholder: string;
  validation: (value: string) => boolean;
  errorMessage: string;
}

export interface CustomFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => Promise<void>;
  submitButtonText: string;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export interface AvatarMenuProps {
  userInfo: UserInfo;
  handleLogout: () => void;
}

export interface AlertProps {
  message: string;
  type?: "success" | "warning" | "error" | "info";
  onClose: () => void;
}

export interface Filters {
  selectedGenres: number[];
  releaseDateRange: [string, string];
  voteAverageRange: [number, number];
  originalLanguage: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Language {
  iso_639_1: string;
  english_name: string;
}

export interface FilterSidebarProps {
  onFilterChange: (filters: { selectedGenres: number[], releaseDateRange: [string, string], voteAverageRange: [number, number], originalLanguage: string }) => void;
  filters: Filters;
}

export interface RatingFilterProps {
  voteAverageRange: [number, number];
  onVoteChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
}

export interface GenresFilterProps {
  genres: Genre[];
  selectedGenres: number[];
  onGenreChange: (genreId: number) => void;
}

export interface ReleaseDateFilterProps {
  releaseDateRange: [string, string];
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
}

export interface LanguageFilterProps {
  originalLanguage: string;
  languages: Language[];
  onLanguageChange: (language: string) => void;
}

export interface CardsPerPageFilterProps {
  cardsPerPage: number;
  onCardsPerPageChange: (value: number) => void;
}

export interface MovieListDropdownProps<T> {
  label: string;
  selectedValue: T | null;
  options: { value: T | null; label: string }[];
  onChange: (value: T | null) => void;
}

export interface Person {
  id: number;
  name: string;
  profile_path: string;
  popularity: number;
  known_for: Array<{
    id: number;
    title: string;
    name: string;
    media_type: "movie" | "tv";
    poster_path: string;
  }>;
}

export interface PeopleCardProps {
  person: Person;
}

export interface TooltipProps {
  text: string;
  children: ReactNode;
  width?: string;
  translateX?: string;
}

export interface MovieReviewsProps {
  reviews: Review[];
}
