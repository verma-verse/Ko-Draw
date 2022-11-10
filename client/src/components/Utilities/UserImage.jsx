import { Link } from "react-router-dom";
export default function ({ data }) {
  return (
    <Link to="/profile" className="mr-10">
      <img src={data} className="w-10 h-10 rounded-full" alt="user" />
    </Link>
  );
}
