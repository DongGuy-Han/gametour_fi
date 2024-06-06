import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Pagination = ({ total, current, perPage }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q');
    const totalPages = Math.ceil(total / perPage);  // perPage를 이용하여 총 페이지 수 계산
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handlePageClick = (pageNumber) => {
        navigate(`/search?q=${query}&page=${pageNumber}`);
    };

    return (
        <div className="pagination">
            {pageNumbers.map(number => (
                <button
                    key={number}
                    className={`page-item ${current === number ? 'active' : ''}`}
                    onClick={() => handlePageClick(number)}
                >
                    {number}
                </button>
            ))}
        </div>
    );
};

export default Pagination;
