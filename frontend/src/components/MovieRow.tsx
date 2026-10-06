import MovieCard from "./MovieCard";
import { Movie } from "../types";

interface Props {
  title: string;
  movies?: Movie[];
}

export default function MovieRow({ title, movies }: Props) {
  if (!movies?.length) return null;

  return (
    <section className="row">
      <h2>{title}</h2>
      <div className="row-scroll">
        {movies.map((m) => (
          <div className="row-item" key={m.id}>
            <MovieCard movie={m} />
          </div>
        ))}
      </div>
    </section>
  );
}
