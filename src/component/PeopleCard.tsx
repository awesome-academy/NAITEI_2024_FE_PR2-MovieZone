import React from "react";
import { Link } from "react-router-dom";
import { PeopleCardProps } from "../movie.type";

const PeopleCard: React.FC<PeopleCardProps> = ({ person }) => {
  return (
    <div className="bg-dark text-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition duration-200 hover:scale-105 hover:shadow-xl">
      <Link to={`/person/${person.id}`}>
        <img
          src={require(`../assets/image/people/profile${person.profile_path}`)}
          alt={person.name}
          className="w-full h-64 object-cover"
        />
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{person.name}</h3>
        <div className="mt-2">
          <div className="text-sm text-gray-400 space-x-1">
            {person.known_for.map((item, index) => (
              <span key={item.id}>
                <Link
                  to={`/${item.media_type}/${item.id}`}
                  className="hover:underline"
                >
                  {item.title || item.name}
                </Link>
                {index < person.known_for.length - 1 && ", "}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeopleCard;
