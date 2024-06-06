import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import NavBar from './NavBar';
import StarRatings from 'react-star-ratings';
import './css/GameDetailPage.css';
import './css/ReviewForm.css';

function ReviewForm({ gameId, isLoggedIn }) {
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);

    const changeRating = (newRating) => {
        setRating(newRating);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isLoggedIn) {
            alert('Please log in to submit a review.');
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8080/reviews/create/${gameId}`, {
                content,
                starPoint: rating
            }, {
                withCredentials: true
            });
            alert(`Review added successfully!`);
            setContent('');
            setRating(0);
            window.location.reload(); // 페이지 새로고침
        } catch (error) {
            console.error('Failed to add review:', error);
            alert('Failed to add review');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <StarRatings
                rating={rating}
                starRatedColor="gold"
                starHoverColor="orange"
                changeRating={changeRating}
                numberOfStars={5}
                name='rating'
            />
            <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write your review here"
                required
                className="review-textarea"
                disabled={!isLoggedIn}
            />
            <button type="submit" className="submit-btn" disabled={!isLoggedIn}>Submit Review</button>
            {!isLoggedIn && (
                <p className="login-message">Please log in to write a review.</p>
            )}
        </form>
    );
}

function GameDetailPage() {
    const { gameId } = useParams();
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSetValue = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            e.preventDefault();
            navigate(`/search?q=${searchQuery}`);
        }
    };

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/games/${gameId}`);
                setGame(response.data);
                const reviewResponse = await axios.get(`http://localhost:8080/reviews/list/${gameId}`);
                setReviews(reviewResponse.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch data.');
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

    return (
        <div className="App">
            <NavBar
                textValue={searchQuery}
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
                            <h4>출시일: {new Date(game.releaseDate).toLocaleDateString()} | {game.publisher}</h4>
                            <p>{game.description}</p>
                        </div>
                    </div>
                </div>
                <div className="reviews">
                    {reviews.map(review => (
                        <div key={review.id} className="review-item">
                            <h3>User: {review.user.name}</h3>
                            <p>{review.content}</p>
                            <StarRatings
                                rating={review.starPoint}
                                starDimension="20px"
                                starSpacing="5px"
                                starRatedColor="gold"
                            />
                            <p>Reviewed on: {new Date(review.createDate).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
                <ReviewForm gameId={gameId} isLoggedIn={isLoggedIn} />
            </div>
        </div>
    );
}

export default GameDetailPage;
