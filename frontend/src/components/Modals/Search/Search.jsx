import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./Search.css";

const Search = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
useEffect(() => {
  console.log("Search rendered");
}, []);
  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/products/search/${query.trim()}`);
      if (!res.ok) return;
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="search-inline-wrapper" ref={wrapperRef}>
      <form className="search-form-inline" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Ürün ara..."
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        <button type="submit">
          <i className="bi bi-search"></i>
        </button>
      </form>

      {isFocused && (
        <div className="search-results-inline">
          {query.trim() === "" && searchResults === null ? (
            <div className="result-item empty">Ürün ara...</div>
          ) : searchResults?.length === 0 ? (
            <div className="result-item empty">
              😔 Aradığınız ürün bulunamadı
            </div>
          ) : (
            searchResults?.map((item) => (
              <Link
                to={`/product/${item._id}`}
                className="result-item"
                key={item._id}
              >
                <img
                  src={item.img[0]}
                  className="search-thumb"
                  alt={item.name}
                />
                <div className="search-info">
                  <h4>{item.name}</h4>
                  <span className="search-price">
                    ${item.price.current.toFixed(2)}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
