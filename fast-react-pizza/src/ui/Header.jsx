import { Link } from 'react-router-dom';
import SearchOrder from '../features/order/SearchOrder';

function Header() {
  return (
    <header className="font-pizza flex items-center justify-between border-b border-stone-200 bg-yellow-400 px-4 py-3 uppercase">
      <Link to="/" className="tracking-widest">
        Fast React Pizza Co.
      </Link>
      <SearchOrder />
      <p className="hidden sm:block">Jonas</p>
    </header>
  );
}

export default Header;
