export interface DropdownProps {
  label: string;
  items: { label: string; link?: string; onClick?: () => void }[];
  isMobile?: boolean;
}

export interface LanguageSwitcherProps {
  isMobile?: boolean;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  overview: string;
  backdrop_path: string;
  adult: boolean;
  genre_ids: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface HeroSliderProps {
  movies: Movie[];
}

export interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  style?: "vertical" | "horizontal";
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
  style: "vertical" | "horizontal";
  onMouseEnter: (movie: Movie) => void;
  activeMenuId: number | null;
  setActiveMenuId: (id: number | null) => void;
}

export interface MovieMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
  position?: "right" | "left";
}
