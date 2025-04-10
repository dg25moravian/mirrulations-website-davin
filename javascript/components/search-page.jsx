import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "/styles/styles.css";
import ResultsSection from "./results";

const API_GATEWAY_URL = import.meta.env.VITE_GATEWAY_API_URL || GATEWAY_API_URL;

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [pageNumber, setPageNumber] = useState(parseInt(searchParams.get("page")) || 1);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [navigate]);

  // Fetch results when search params change
  useEffect(() => {
    const q = searchParams.get("q");
    const page = parseInt(searchParams.get("page")) || 1;
    
    if (q) {
      fetchResults(q, page - 1); // Convert to 0-based for API
    }
}, [searchParams]);

  const fetchResults = async (term, pageNum = 0) => {
    if (!term?.trim()) {
      setError("Please enter a search term.");
      setResults(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const query_params = new URLSearchParams();
      query_params.append("searchTerm", term);
      query_params.append("pageNumber", pageNum);
      query_params.append("refreshResults", true);
      query_params.append("sortParams", JSON.stringify({
        "desc": true,
        "sortType": "relevance"
      }));
      query_params.append("filterParams", JSON.stringify({
        "dateRange": {
          "start": "2000-01-01 00:00:00.000-0400",
          "end": "2025-03-18 00:00:00.000-0400"
        },
        "docketType": "Rulemaking"
      }));

      const url = `${API_GATEWAY_URL}?${query_params.toString()}`;

      const headers = {
        "Session-Id": "test",
        "Content-Type": "application/json"
      };

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      if (!data || !data.dockets || (Array.isArray(data.dockets) && data.dockets.length === 0)) {
        throw new Error("No results found. Please try a different search term.");
      }

      setResults(data);
      setSearchTerm(term);
      setPageNumber(pageNum);
    } catch (err) {
      setError(err.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setError(null);
    const term = searchTerm.trim();
    if (term) {
      setSearchParams({ q: term, page: 1 });
      fetchResults(term, 0); // 0-based for API
    } else {
      setError("Please enter a search term.");
    }
    };
  const handlePageChange = (newPageNumber) => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Add this line
    setSearchParams({ q: searchTerm, page: newPageNumber + 1 }); // 1-based for URL
    fetchResults(searchTerm, newPageNumber); // 0-based for API
    };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("idToken");
    setIsAuthenticated(false);
    navigate("/auth");
  };

  const LoadingMessage = () => {
    const [dots, setDots] = useState("");
  
    useEffect(() => {
      const interval = setInterval(() => {
        setDots(prev => (prev.length < 3 ? prev + "." : ""));
      }, 500);
      return () => clearInterval(interval);
    }, []);
  
    return (
      <p id="loading-section" className="text-center mt-3">
        Loading{dots} (this is harder than it looks!)
      </p>
    );
  };
  
  
  return (
    <div className="search-container p-0">
      <h1 className="logo">Mirrulations</h1>
      <button className="btn btn-primary position-absolute top-0 end-0 m-3" onClick={handleLogout}>
        Logout
      </button>
      <section className="search-section">
        <div id="search" className="d-flex justify-content-center">
          <input
            type="text"
            className="search-input form-control w-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter search term"
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={handleSearch}
            className="search-button btn btn-primary ms-2"
          >
            Search
          </button>
        </div>
      </section>
      <p className="footer">
        <a href="https://www.flickr.com/photos/wallyg/3664385777">Washington DC - Capitol Hill: United States Capitol</a>
        <span> by </span><a href="https://www.flickr.com/photos/wallyg/">Wally Gobetz</a>
        <span> is licensed under </span><a href="https://creativecommons.org/licenses/by-nc-nd/2.0/">CC BY-NC-ND 2.0</a>
      </p>

      {loading && <LoadingMessage />}
      {error && <p id="error-loader" className="text-center mt-3">{error}</p>}
      {results && <ResultsSection results={results} onPageChange={handlePageChange}/>}
    </div>
  );
};

export default SearchPage;