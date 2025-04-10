import React from "react";

const PageSwitcher = ({ current_page, total_pages, onPageChange }) => {
  if (total_pages <= 1) {
    return null;
  }
  // Ensure only 10 pages are shown, if total pages are less than 10, show all
  const pageNumbers = [];
    
  // Calculate initial start and end pages (1-based)
  let startPage = Math.max(1, current_page - Math.floor((total_pages - 1) / 2));
  let endPage = startPage + total_pages - 1;

  // Adjust if we're at the end
  if (endPage > total_pages) {
    endPage = total_pages ;
    startPage = Math.max(1, endPage - (total_pages - 1));
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const arrowButtons = [
    { text: "<<", page: 1, disabled: current_page === 0 },
    { text: "<", page: current_page - 1, disabled: current_page === 0 },
    { text: ">", page: current_page + 1, disabled: current_page + 1 ===  9},
    { text: ">>", page: total_pages, disabled: current_page + 1 === 9 },
  ];

  return (
    <section id="page_switcher_section" className="container mt-4">
      <div id="page_switcher_container" className="container">
        <nav>
          <ul className="pagination justify-content-center">
            {arrowButtons.slice(0, 2).map((arrow) => (
              <li className={`page-item ${arrow.disabled ? "disabled" : ""}`} key={arrow.text}>
                <button
                  className="page-link"
                  onClick={() => onPageChange(arrow.page)}
                  disabled={arrow.disabled}
                >
                  {arrow.text}
                </button>
              </li>
            ))}

            {pageNumbers.map((number) => (
              <li
                className={`page-item ${number === current_page ? "active" : ""}`}
                key={number}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(number)}
                  disabled={number === current_page}
                >
                  {number}
                </button>
              </li>
            ))}

            {arrowButtons.slice(2).map((arrow) => (
              <li className={`page-item ${arrow.disabled ? "disabled" : ""}`} key={arrow.text}>
                <button
                  className="page-link"
                  onClick={() => onPageChange(arrow.page)}
                  disabled={arrow.disabled}
                >
                  {arrow.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default PageSwitcher;