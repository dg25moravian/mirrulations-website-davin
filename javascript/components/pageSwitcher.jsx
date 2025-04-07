import React from "react";

const PageSwitcher = ({ current_page, total_pages, onPageChange }) => {
  if (total_pages <= 1) {
    return null;
  }

  const maxPagesToShow = total_pages < 10 ? total_pages : 10;

  let startPage = Math.max(0, current_page - Math.floor(maxPagesToShow / 2));
  let endPage = startPage + maxPagesToShow - 1;

  // Adjust if endPage goes out of range
  if (endPage >= total_pages) {
    endPage = total_pages - 1;
    startPage = Math.max(0, endPage - maxPagesToShow + 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const arrowButtons = [
    { text: "<<", page: 0, disabled: current_page === 0 },
    { text: "<", page: current_page - 1, disabled: current_page === 0 },
    { text: ">", page: current_page + 1, disabled: current_page === total_pages - 1 },
    { text: ">>", page: total_pages - 1, disabled: current_page === total_pages - 1 },
  ];

  return (
    <section id="page_switcher_section" className="container mt-4">
      <div id="page_switcher_container" className="container">
        <nav>
          <ul className="pagination justify-content-center">
            {/* First & Previous */}
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

            {/* Page Numbers */}
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
                  {number + 1}
                </button>
              </li>
            ))}

            {/* Next & Last */}
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
