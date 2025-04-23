import PageSwitcher from "./pageSwitcher";
import React, { useEffect, useState, useRef } from "react";
import "/styles/results.css";
import "bootstrap/dist/css/bootstrap.min.css";
import hammerIcon from "../../assets/icons/hammer.png";
import pencilIcon from "../../assets/icons/pencil.png";
import TimelineModal from "./timelineModal";

const ResultsSection = ({ results, onPageChange, searchTerm }) => {
  const [isVisible, setIsVisible] = useState(false);
  const resultsRef = useRef(null);

  const getDocketIcon = (docket) => {
    const isRulemaking = docket.docketType === "Rulemaking";
    return isRulemaking ? hammerIcon : pencilIcon;
  };

  const getPercentage = (numerator, denominator, decimalPlaces) => {
    // line from https://stackoverflow.com/a/45163573
    return Number(numerator/denominator).toLocaleString(undefined, {style: 'percent', minimumFractionDigits:decimalPlaces})
  }

  const getPercentHTML = (match, total, percentString, noneString) => {
    if (total === 0) {
      return (
        <span> {noneString}</span>
      )
    }

    return (<>
      <span> {match}/{total}</span>
      <span> ({percentString})</span>
    </>)
  }

  const getRegulationsCommentsLink = (id, num_of_comments) => {
    if (num_of_comments === 0) {
      return (<span>Matching Comments</span>)
    }
    
    const query_params = new URLSearchParams()
    query_params.append("filter", searchTerm)
    return (
      <a href={`https://www.regulations.gov/docket/${id}/comments?${query_params.toString()}`}>Matching Comments</a>
    )
  }

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
          <div className="d-flex justify-content-between">
            <div className="result-content">
              <strong>{docket.title}</strong>
              <p><strong>Agency Name:</strong> {docket.agencyName}</p>
              <p>
                <strong>Docket ID: </strong> 
                <a href={`https://www.regulations.gov/docket/${docket.id}`} target="_blank" rel="noopener noreferrer">
                  {docket.id}
                </a>
              </p>
              <p>
                <strong>{getRegulationsCommentsLink(docket.id, docket.comments.total)}:</strong> 
                {getPercentHTML(
                  docket.comments.match, docket.comments.total,
                  getPercentage(docket.comments.match, docket.comments.total, 2),
                  "No comments on this docket"
                )}
              </p>
              <p>
                <strong>Matching Attachments:</strong>
                {getPercentHTML(
                  docket.attachments.match, docket.attachments.total,
                  getPercentage(docket.attachments.match, docket.attachments.total, 2),
                  "No comments with attachments on this docket"
                )}
              </p>
              <p><strong>Summary:</strong> {docket.summary ? (docket.summary.length > 300 ? `${docket.summary.substring(0, 300)}...` : docket.summary) : "No summary available"}</p>
              {/* Use the new TimelineModal component instead of displaying dates directly */}
              <TimelineModal key={docket.id} timelineDates={docket.timelineDates}/>
              <p><strong>Open for comments?:</strong> {docket.isOpenForComment === true ? "Yes" : "No"}</p>
            </div>
            
            <div className="d-flex align-items-end">
              <img 
                src={getDocketIcon(docket)} 
                alt={docket.docketType === "Rulemaking" ? "Rulemaking icon" : "Non-rulemaking icon"} 
                className="docket-icon"
                title={docket.docketType === "Rulemaking" ? "Rulemaking" : "Non-rulemaking"}
              />
            </div>
          </div>
        </div>
      ))}
      <PageSwitcher current_page={Number(results.currentPage) + 1} total_pages={results.totalPages} onPageChange={(page) => onPageChange(page - 1)}/>
    </div>
  );
};

export default ResultsSection;