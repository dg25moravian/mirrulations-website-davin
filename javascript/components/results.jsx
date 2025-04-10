import PageSwitcher from "./pageSwitcher";
import React, { useEffect, useState, useRef } from "react";
import "/styles/results.css";
import "bootstrap/dist/css/bootstrap.min.css";

const ResultsSection = ({ results, onPageChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (results.dockets.length > 0) {
      setIsVisible(true);
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [results]);

  return (
    <div ref={resultsRef} className={`results-container mt-4 ${isVisible ? "fade-in" : ""}`}>
      <h2 className="results-title">Search Results</h2>
      {results.dockets.map((docket, index) => (
        <div key={index} className="result-item border p-3 mb-2 rounded">
          <strong>{docket.title}</strong>
          <p><strong>Agency Name:</strong> {docket.agencyName}</p>
          <p>
            <strong>Docket ID: </strong>
            <a href={`https://www.regulations.gov/docket/${docket.id}`} target="_blank" rel="noopener noreferrer">
              {docket.id}
            </a>
          </p>
          <p><strong>Matching Comments:</strong> {docket.comments.match}/{docket.comments.total}</p>
          <p><strong>Matching Attachments:</strong> {docket.attachments ? `${docket.attachments.match}/${docket.attachments.total}` : "Unknown"}</p>
          <p>
            <strong>Summary:</strong> {docket.summary ? (docket.summary.length > 200 ? `${docket.summary.substring(0, 200)}...` : docket.summary) : "No summary available"}
          </p>
          <p>
            <strong>Date Modified:</strong> { docket.timelineDates && docket.timelineDates.dateModified ? new Date(docket.timelineDates.dateModified).toLocaleDateString() : docket.dateModified ? new Date(docket.dateModified).toLocaleDateString() : "Unknown"}
            <strong>&emsp;Date Created:</strong> { docket.timelineDates && docket.timelineDates.dateCreated ? new Date(docket.timelineDates.dateCreated).toLocaleDateString() : "Unknown"}
            <strong>&emsp;Date Effective:</strong> { docket.timelineDates && docket.timelineDates.dateEffective ? new Date(docket.timelineDates.dateEffective).toLocaleDateString() : "Unknown" }
            <strong>&emsp;Date Closed:</strong> { docket.timelineDates && docket.timelineDates.dateClosed ? new Date(docket.timelineDates.dateClosed).toLocaleDateString() : "Unknown" }
            <strong>&emsp;Date Comments Opened:</strong> { docket.timelineDates && docket.timelineDates.dateCommentsOpened ? new Date(docket.timelineDates.dateCommentsOpened).toLocaleDateString() : "Unknown" }
          </p>
        </div>
      ))}
      <PageSwitcher
        current_page={results.currentPage + 1} // Display as 1-based
        total_pages={results.totalPages}
        onPageChange={(page) => onPageChange(page - 1)} // Convert back to 0-based
      />
    </div>
  );
};

export default ResultsSection;