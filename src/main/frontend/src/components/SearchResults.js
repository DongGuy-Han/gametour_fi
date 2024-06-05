import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './css/SearchResults.css';
import NavBar from './NavBar'; // NavBar 컴포넌트 임포트

function SearchResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const query = new URLSearchParams(location.search).get('q');

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [textValue, setTextValue] = useState("");
    const handleLogin = () => {
        window.location.href = 'http://localhost:8080/login';
    };

    const handleSignup = () => {
        navigate('/signup');
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/logout', {}, { withCredentials: true });
            setIsLoggedIn(false);
            alert('로그아웃 되었습니다.');
        } catch (error) {
            console.error('Logout failed:', error);
            alert('로그아웃 실패');
        }
    };

    const handleSetValue = (e) => {
        setTextValue(e.target.value);
    };

    const handleChange = (e) => {
        window.location.href = `http://localhost:3000/search?q=${e.target.value}`;
        // navigate(`search?q=${e.target.value}`, {
        //     state: {
        //         keyword: `${e.target.value}`
        //     },
        // });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleChange(e);
    };

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await axios.get(`/games`, { params: { kw: query } });
                setGames(response.data.content);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch search results.');
                setLoading(false);
                console.error(err);
            }
        };

        fetchSearchResults();
    }, [query]);

    if (loading) {
        return <div>
                    <NavBar
                        isLoggedIn={isLoggedIn}
                        handleLogout={handleLogout}
                        handleLogin={handleLogin}
                        handleSignup={handleSignup}
                        textValue={textValue}
                        handleSetValue={handleSetValue}
                        handleKeyDown={handleKeyDown}
                    />
                    <h2>Loading...</h2>
               </div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (games.length === 0) {
        return <div className='noResult'>
            <NavBar
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
                handleLogin={handleLogin}
                handleSignup={handleSignup}
                textValue={textValue}
                handleSetValue={handleSetValue}
                handleKeyDown={handleKeyDown}
            />
            <h2>No results</h2> 
            <h5>"{query}"에 대한 검색 결과가 없습니다.</h5>
            </div>;
    }

    return (
        <div className="search-results-page">
            <NavBar
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
                handleLogin={handleLogin}
                handleSignup={handleSignup}
                textValue={textValue}
                handleSetValue={handleSetValue}
                handleKeyDown={handleKeyDown}
            />
            {/* NavBar 컴포넌트 추가 */}
            <h2>Search Results for "{query}"</h2>
            <div className="search-results">
                {games.map(game => (
                    <div key={game.id} className="search-result-item" onClick={() => navigate(`/game/${game.id}`)}>
                        <img src={game.thumb} alt={game.title} className="search-result-image" />
                        <div className="search-result-title">{game.title}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchResults;
