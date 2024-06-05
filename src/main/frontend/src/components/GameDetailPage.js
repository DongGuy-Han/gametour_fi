import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './css/GameDetailPage.css';
import NavBar from './NavBar'; // NavBar 컴포넌트 임포트

function GameDetailPage() {
    const { gameId } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
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

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            window.location.href = `http://localhost:3000/search?q=${e.target.value}`;
        }
    };

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/games/${gameId}`);
                setGame(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch game data.');
                setLoading(false);
                console.error(err);
            }
        };

        fetchGameDetails();
    }, [gameId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!game) {
        return <div>Game not found</div>;
    }

    // 평균 별점 계산
    const reviews = game.reviewList || [];
    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.starPoint, 0) / reviews.length
        : 0;

    function generateStars(rating) {
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    }

    return (
        <div className="App">
            <NavBar
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
                handleLogin={handleLogin}
                handleSignup={handleSignup}
                textValue={textValue}
                handleSetValue={handleSetValue}
                handleKeyDown={handleKeyDown}
            />
            <div className="game-detail">
                <div className="game-data">
                    <div className="first-row">
                        <div className="game-banner">
                            <img src={game.thumb} alt={`Cover of ${game.title}`} />
                        </div>
                    </div>
                    <div className="second-row">
                        <div className="game-info">
                            <h1>{game.title}</h1>
                            <h4>출시일 : {new Date(game.releaseDate).toLocaleDateString()} | {game.publisher}</h4>
                            <p>{game.description}</p>
                        </div>
                        <div className="game-rating">
                            <div className="total-rating">
                                평균 별점: {averageRating.toFixed(1)} {generateStars(Math.round(averageRating))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameDetailPage;