import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

const Pagination = ({pageCount, current}) => {
    const [currentPage, setCurrentPage] = useState(current)
    const [pageCount2, setPageCount2] = useState(pageCount)
    const maxVisibleButtons = 10;
    const navigate = useNavigate()

    const getVisiblePages = () => {
        let startPage = Math.max(1, current - Math.floor(maxVisibleButtons / 2));
        let endPage = startPage + maxVisibleButtons - 1;

        if (endPage > pageCount) {
        endPage = pageCount;
        startPage = Math.max(1, endPage - maxVisibleButtons + 1);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
        }
        return pages;
    };

    const handleClick = (page) => {
        setCurrentPage(page);
        navigate("/courses?page="+page)
        window.location.reload()
    };

    return ( 
        <div className="w-[100%] flex items-center justify-center gap-2 *:p-2 *:border-orange-500 *:border-2 *:rounded-[5px] *:aspect-square *:w-10 *:h-10 *:text-center">

            {getVisiblePages().map((page) => (
                <button
                key={page}
                onClick={() => handleClick(page)}
                style={{
                    backgroundColor: current == page ? 'oklch(70.5% 0.213 47.604)' : '#eee',
                    color: current == page ? '#fff' : '#000',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer'
                }}
                >
                {page}
                </button>
            ))}

        </div>
     );
}
 
export default Pagination;

/* 
{[...Array(pageCount)].map((page, index)=> (
                <div onClick={()=> setCurrentPage(index + 1)}>{index + 1}</div>
            ))}
*/